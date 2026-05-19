import { useEffect, useMemo, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import { supabase } from "../../lib/supabaseClient";

const THUMBNAIL_BUCKET = "blog-thumbs";

function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-");
}

function parseTags(value) {
  return value
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

export default function AdminEditor() {
  const [posts, setPosts] = useState([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);
  const [selectedId, setSelectedId] = useState("");
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [tags, setTags] = useState("");
  const [readTime, setReadTime] = useState("");
  const [url, setUrl] = useState("");
  const [publishedAt, setPublishedAt] = useState("");
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [coverUrl, setCoverUrl] = useState("");
  const [pendingContent, setPendingContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false }),
      Image,
      Placeholder.configure({
        placeholder: "Write your post...",
      }),
    ],
    editorProps: {
      attributes: {
        class:
          "prose prose-invert max-w-none min-h-[240px] focus:outline-none",
      },
    },
  });

  const autoSlug = useMemo(() => slugify(title), [title]);
  const finalSlug = slug || autoSlug;
  const isEditing = Boolean(selectedId);

  useEffect(() => {
    let isMounted = true;

    async function loadPosts() {
      if (!supabase) {
        setIsLoadingPosts(false);
        return;
      }

      setIsLoadingPosts(true);
      const { data, error: fetchError } = await supabase
        .from("blogs")
        .select(
          "id,title,slug,excerpt,tags,read_time,url,cover_url,published_at,content"
        )
        .order("published_at", { ascending: false, nullsLast: true });

      if (fetchError) {
        setError(fetchError.message);
      } else if (isMounted) {
        setPosts(data || []);
      }

      if (isMounted) {
        setIsLoadingPosts(false);
      }
    }

    loadPosts();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (editor && pendingContent) {
      editor.commands.setContent(pendingContent);
      setPendingContent("");
    }
  }, [editor, pendingContent]);

  function formatDateInput(value) {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    const pad = (num) => String(num).padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
      date.getDate()
    )}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  }

  function resetForm() {
    setSelectedId("");
    setTitle("");
    setSlug("");
    setExcerpt("");
    setTags("");
    setReadTime("");
    setUrl("");
    setPublishedAt("");
    setThumbnailFile(null);
    setCoverUrl("");
    editor?.commands.clearContent();
    setMessage("");
    setError("");
  }

  function handleSelect(post) {
    setSelectedId(post.id);
    setTitle(post.title || "");
    setSlug(post.slug || "");
    setExcerpt(post.excerpt || "");
    setTags(Array.isArray(post.tags) ? post.tags.join(", ") : "");
    setReadTime(post.read_time ? String(post.read_time) : "");
    setUrl(post.url || "");
    setPublishedAt(formatDateInput(post.published_at));
    setThumbnailFile(null);
    setCoverUrl(post.cover_url || "");
    setMessage("");
    setError("");

    if (editor) {
      editor.commands.setContent(post.content || "");
    } else {
      setPendingContent(post.content || "");
    }
  }

  async function handleUploadThumbnail() {
    if (!thumbnailFile) return "";

    const fileExt = thumbnailFile.name.split(".").pop();
    const filePath = `thumbnails/${Date.now()}-${finalSlug}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from(THUMBNAIL_BUCKET)
      .upload(filePath, thumbnailFile, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      throw uploadError;
    }

    const { data } = supabase.storage.from(THUMBNAIL_BUCKET).getPublicUrl(filePath);
    return data.publicUrl;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!supabase) {
      setError("Supabase client not configured.");
      return;
    }

    if (!title || !finalSlug) {
      setError("Title and slug are required.");
      return;
    }

    if (!editor) {
      setError("Editor is not ready.");
      return;
    }

    setIsSaving(true);
    setError("");
    setMessage("");

    try {
      const updatedCoverUrl = thumbnailFile
        ? await handleUploadThumbnail()
        : coverUrl;
      const payload = {
        title,
        slug: finalSlug,
        excerpt,
        content: editor.getHTML(),
        tags: parseTags(tags),
        read_time: readTime ? Number(readTime) : null,
        url,
        cover_url: updatedCoverUrl,
        published_at: publishedAt ? new Date(publishedAt).toISOString() : null,
      };

      if (isEditing) {
        const { error: updateError } = await supabase
          .from("blogs")
          .update(payload)
          .eq("id", selectedId);
        if (updateError) {
          throw updateError;
        }
      } else {
        const { error: insertError } = await supabase
          .from("blogs")
          .insert(payload);
        if (insertError) {
          throw insertError;
        }
      }

      setMessage(isEditing ? "Post updated successfully." : "Post published successfully.");
      resetForm();

      const { data: refreshedPosts } = await supabase
        .from("blogs")
        .select(
          "id,title,slug,excerpt,tags,read_time,url,cover_url,published_at,content"
        )
        .order("published_at", { ascending: false, nullsLast: true });
      setPosts(refreshedPosts || []);
    } catch (err) {
      setError(err.message || "Failed to publish post.");
    } finally {
      setIsSaving(false);
    }
  }

  function handleAddImage() {
    const urlValue = window.prompt("Image URL");
    if (urlValue) {
      editor?.chain().focus().setImage({ src: urlValue }).run();
    }
  }

  function handleAddLink() {
    const urlValue = window.prompt("Link URL");
    if (urlValue) {
      editor?.chain().focus().setLink({ href: urlValue }).run();
    }
  }

  return (
    <div className="mt-8 grid gap-6">
      <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <label className="text-sm text-white/70" htmlFor="title">
              Title
            </label>
            <input
              id="title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="rounded-2xl border border-white/10 bg-transparent px-3 py-2 text-sm text-white outline-none focus:border-white/30"
            />
          </div>

          <div className="grid gap-2">
            <label className="text-sm text-white/70" htmlFor="slug">
              Slug
            </label>
            <input
              id="slug"
              value={finalSlug}
              onChange={(event) => setSlug(event.target.value)}
              placeholder={autoSlug}
              className="rounded-2xl border border-white/10 bg-transparent px-3 py-2 text-sm text-white outline-none focus:border-white/30"
            />
          </div>

          <div className="grid gap-2">
            <label className="text-sm text-white/70" htmlFor="excerpt">
              Excerpt
            </label>
            <textarea
              id="excerpt"
              value={excerpt}
              onChange={(event) => setExcerpt(event.target.value)}
              className="min-h-[80px] rounded-2xl border border-white/10 bg-transparent px-3 py-2 text-sm text-white outline-none focus:border-white/30"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <label className="text-sm text-white/70" htmlFor="tags">
                Tags (comma separated)
              </label>
              <input
                id="tags"
                value={tags}
                onChange={(event) => setTags(event.target.value)}
                className="rounded-2xl border border-white/10 bg-transparent px-3 py-2 text-sm text-white outline-none focus:border-white/30"
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm text-white/70" htmlFor="readTime">
                Read time (min)
              </label>
              <input
                id="readTime"
                type="number"
                value={readTime}
                onChange={(event) => setReadTime(event.target.value)}
                className="rounded-2xl border border-white/10 bg-transparent px-3 py-2 text-sm text-white outline-none focus:border-white/30"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <label className="text-sm text-white/70" htmlFor="url">
                Canonical URL (optional)
              </label>
              <input
                id="url"
                value={url}
                onChange={(event) => setUrl(event.target.value)}
                className="rounded-2xl border border-white/10 bg-transparent px-3 py-2 text-sm text-white outline-none focus:border-white/30"
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm text-white/70" htmlFor="publishedAt">
                Publish date
              </label>
              <input
                id="publishedAt"
                type="datetime-local"
                value={publishedAt}
                onChange={(event) => setPublishedAt(event.target.value)}
                className="rounded-2xl border border-white/10 bg-transparent px-3 py-2 text-sm text-white outline-none focus:border-white/30"
              />
            </div>
          </div>

          <div className="grid gap-2">
            <label className="text-sm text-white/70" htmlFor="thumbnail">
              Thumbnail
            </label>
            <input
              id="thumbnail"
              type="file"
              accept="image/*"
              onChange={(event) => setThumbnailFile(event.target.files?.[0] || null)}
              className="text-sm text-white/70"
            />
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
            <div className="flex flex-wrap gap-2 pb-3">
              <button
                type="button"
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70"
                onClick={() => editor?.chain().focus().toggleBold().run()}
              >
                Bold
              </button>
              <button
                type="button"
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70"
                onClick={() => editor?.chain().focus().toggleItalic().run()}
              >
                Italic
              </button>
              <button
                type="button"
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70"
                onClick={() => editor?.chain().focus().toggleBulletList().run()}
              >
                Bullets
              </button>
              <button
                type="button"
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70"
                onClick={handleAddLink}
              >
                Link
              </button>
              <button
                type="button"
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70"
                onClick={handleAddImage}
              >
                Image
              </button>
            </div>
            <EditorContent editor={editor} />
          </div>

          {error && (
            <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">
              {error}
            </div>
          )}

          {message && (
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-100">
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={isSaving}
            className="w-fit rounded-full bg-[#f7b955] px-5 py-2 text-sm font-semibold text-[#1a1206] transition hover:bg-[#f4a93b] disabled:opacity-60"
          >
            {isSaving
              ? "Saving..."
              : isEditing
              ? "Update post"
              : "Publish post"}
          </button>
        </form>
      </div>
      <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-lg font-semibold text-white">All posts</h2>
          {isEditing && (
            <button
              type="button"
              onClick={resetForm}
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/70 transition hover:text-white"
            >
              Create new
            </button>
          )}
        </div>
        {isLoadingPosts ? (
          <div className="mt-4 text-sm text-white/60">Loading posts...</div>
        ) : posts.length === 0 ? (
          <div className="mt-4 text-sm text-white/60">No posts yet.</div>
        ) : (
          <div className="mt-4 grid gap-3">
            {posts.map((post) => (
              <button
                key={post.id}
                type="button"
                onClick={() => handleSelect(post)}
                className={`flex items-center gap-4 rounded-2xl border px-4 py-3 text-left text-sm transition ${
                  selectedId === post.id
                    ? "border-[#f7b955] bg-[#f7b955]/10 text-white"
                    : "border-white/10 bg-white/5 text-white/70 hover:text-white"
                }`}
              >
                <div className="h-12 w-16 overflow-hidden rounded-xl border border-white/10 bg-white/5">
                  {post.cover_url ? (
                    <img
                      src={post.cover_url}
                      alt={post.title || "Blog thumbnail"}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="h-full w-full bg-white/10" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-white">
                    {post.title || "Untitled"}
                  </div>
                  <div className="text-xs text-white/50">{post.slug || ""}</div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

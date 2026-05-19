import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { FaPause, FaPlay } from "react-icons/fa";
import BlogCard from "../components/blog/BlogCard";

function formatDate(value) {
  if (!value) return "";
  try {
    return new Date(value).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return "";
  }
}

export default function BlogDetail() {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [isLoadingRelated, setIsLoadingRelated] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadBlog() {
      if (!supabase) {
        setError("Supabase client not configured.");
        setIsLoading(false);
        return;
      }

      if (!slug) {
        setError("Missing blog slug.");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError("");

      const { data, error: fetchError } = await supabase
        .from("blogs")
        .select("*")
        .eq("slug", slug)
        .single();

      if (!isMounted) return;

      if (fetchError) {
        setError(fetchError.message);
        setIsLoading(false);
        return;
      }

      setBlog({
        id: data.id,
        title: data.title || "Untitled",
        excerpt: data.excerpt || "",
        content: data.content || "",
        coverUrl: data.cover_url || "",
        publishedAt: data.published_at || data.created_at || "",
        readTime: data.read_time || null,
        tags: Array.isArray(data.tags) ? data.tags : [],
      });
      setIsLoading(false);
    }

    loadBlog();

    return () => {
      isMounted = false;
    };
  }, [slug]);

  useEffect(() => {
    let isMounted = true;

    async function loadRelatedPosts() {
      if (!supabase || !blog) return;

      setIsLoadingRelated(true);

      let query = supabase
        .from("blogs")
        .select("*")
        .neq("id", blog.id)
        .order("published_at", { ascending: false, nullsLast: true })
        .limit(3);

      if (blog.tags.length > 0) {
        query = query.overlaps("tags", blog.tags);
      }

      const { data, error: relatedError } = await query;

      if (!isMounted) return;

      if (relatedError) {
        setRelatedPosts([]);
      } else {
        const normalized = (data || []).map((item) => ({
          id: item.id,
          title: item.title || "Untitled",
          excerpt: item.excerpt || "",
          content: item.content || "",
          coverUrl: item.cover_url || "",
          publishedAt: item.published_at || item.created_at || "",
          readTime: item.read_time || null,
          tags: Array.isArray(item.tags) ? item.tags : [],
          slug: item.slug || "",
          url: item.url || "",
        }));
        setRelatedPosts(normalized);
      }

      setIsLoadingRelated(false);
    }

    loadRelatedPosts();

    return () => {
      isMounted = false;
    };
  }, [blog]);

  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      setSpeechSupported(true);
    }

    return () => {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  function extractPlainText(html) {
    if (!html) return "";
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    return doc.body.textContent || "";
  }

  function handleSpeak() {
    if (!speechSupported || !blog) return;
    const contentText = extractPlainText(blog.content);
    const spokenText = [blog.title, blog.excerpt, contentText]
      .filter(Boolean)
      .join(". ");

    if (!spokenText) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(spokenText);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  }

  function handleStop() {
    if (!speechSupported) return;
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }

  return (
    <div className="blogs-page relative min-h-screen overflow-hidden bg-[#0b0d12] text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-15%] top-[15%] h-[420px] w-[420px] rounded-full bg-[#f7b955]/15 blur-[140px]" />
        <div className="absolute right-[-15%] bottom-[10%] h-[420px] w-[420px] rounded-full bg-[#5ce1e6]/10 blur-[160px]" />
      </div>

      <div className="relative mx-auto w-full max-w-4xl px-5 pb-20 pt-16 md:px-8">
        <div className="flex items-center justify-between gap-4">
          <Link to="/blogs">
            <Button variant="ghost">Back to blogs</Button>
          </Link>
          <Link to="/">
            <Button variant="ghost">Home</Button>
          </Link>
        </div>

        {isLoading && (
          <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/70">
            Loading blog...
          </div>
        )}

        {error && !isLoading && (
          <div className="mt-10 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
            {error}
          </div>
        )}

        {blog && !isLoading && !error && (
          <article className="mt-10">
            {blog.coverUrl ? (
              <img
                src={blog.coverUrl}
                alt={blog.title}
                className="h-72 w-full rounded-3xl object-cover"
                loading="lazy"
              />
            ) : (
              <div className="h-72 w-full rounded-3xl bg-white/5" />
            )}

            <div className="mt-6 flex flex-wrap items-center gap-3 text-xs text-white/60">
              {blog.publishedAt && <span>{formatDate(blog.publishedAt)}</span>}
              {blog.readTime && <span>{blog.readTime} min read</span>}
            </div>

            <h1 className="mt-4 text-4xl font-display text-white">
              {blog.title}
            </h1>
            <div className="mt-4 flex flex-wrap items-start gap-6">
              <div className="flex-1">
                {blog.excerpt && (
                  <p className="text-sm text-white/70">{blog.excerpt}</p>
                )}
                {blog.tags.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {blog.tags.map((tag) => (
                      <Badge key={tag} className="border-white/20 bg-white/5 text-white/70">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex flex-col items-end gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={isSpeaking ? handleStop : handleSpeak}
                  disabled={!speechSupported}
                  className="h-11 w-11 rounded-full p-0 text-white shadow-lg shadow-emerald-500/30 hover:bg-emerald-500/20"
                  aria-label={isSpeaking ? "Pause narration" : "Play narration"}
                >
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 via-teal-400 to-cyan-400 text-black">
                    {isSpeaking ? <FaPause /> : <FaPlay />}
                  </span>
                </Button>
                {!speechSupported && (
                  <span className="text-xs text-white/50">
                    Speech not supported in this browser.
                  </span>
                )}
              </div>
            </div>

            <div
              className="prose prose-invert mt-8 max-w-none"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />

            <section className="mt-12">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.4em] text-white/50">
                    Related
                  </p>
                  <h2 className="mt-2 text-2xl font-display text-white">
                    Recommended blogs
                  </h2>
                </div>
                <Link to="/blogs">
                  <Button variant="ghost">View all</Button>
                </Link>
              </div>

              {isLoadingRelated && (
                <div className="mt-6 grid gap-5 md:grid-cols-2">
                  {Array.from({ length: 2 }).map((_, index) => (
                    <div
                      key={index}
                      className="h-56 rounded-3xl border border-white/10 bg-white/5"
                    />
                  ))}
                </div>
              )}

              {!isLoadingRelated && relatedPosts.length > 0 && (
                <div className="mt-6 grid gap-5 md:grid-cols-2">
                  {relatedPosts.map((item) => (
                    <BlogCard key={item.id} blog={item} compact />
                  ))}
                </div>
              )}

              {!isLoadingRelated && relatedPosts.length === 0 && (
                <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/70">
                  No related blogs yet.
                </div>
              )}
            </section>
          </article>
        )}
      </div>
    </div>
  );
}

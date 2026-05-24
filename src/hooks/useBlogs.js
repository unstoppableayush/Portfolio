import { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabaseClient";

function normalizeTags(tags) {
  if (Array.isArray(tags)) return tags;
  if (typeof tags === "string") {
    return tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
  }
  return [];
}

function normalizeBlog(blog) {
  return {
    id: blog.id,
    title: blog.title || "Untitled",
    author: blog.author || "",
    slug: blog.slug || "",
    excerpt: blog.excerpt || blog.summary || "No excerpt available yet.",
    coverUrl: blog.cover_url || blog.coverUrl || "",
    publishedAt: blog.published_at || blog.publishedAt || blog.created_at || null,
    readTime: blog.read_time || blog.readTime || null,
    tags: normalizeTags(blog.tags),
    url: blog.url || "",
  };
}

export function useBlogs({ limit } = {}) {
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadBlogs() {
      setIsLoading(true);
      setError("");

      if (!supabase) {
        setError("Missing Supabase env vars. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.");
        setIsLoading(false);
        return;
      }

      try {
        let query = supabase.from("blogs").select("*");
        query = query.order("published_at", { ascending: false, nullsLast: true });
        if (typeof limit === "number") {
          query = query.limit(limit);
        }

        const { data, error: fetchError } = await query;

        if (fetchError) {
          const fallback = await supabase
            .from("blogs")
            .select("*")
            .order("created_at", { ascending: false, nullsLast: true });

          if (fallback.error) {
            throw fallback.error;
          }

          if (isMounted) {
            setBlogs((fallback.data || []).map(normalizeBlog));
          }
          return;
        }

        if (isMounted) {
          setBlogs((data || []).map(normalizeBlog));
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || "Failed to load blogs.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadBlogs();

    return () => {
      isMounted = false;
    };
  }, [limit]);

  const hasBlogs = useMemo(() => blogs.length > 0, [blogs.length]);

  return { blogs, isLoading, error, hasBlogs };
}

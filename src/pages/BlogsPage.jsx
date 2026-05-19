import { Link } from "react-router-dom";
import { useBlogs } from "../hooks/useBlogs";
import BlogCard from "../components/blog/BlogCard";
import { Button } from "../components/ui/button";

export default function BlogsPage() {
  const { blogs, isLoading, error, hasBlogs } = useBlogs();

  return (
    <div className="blogs-page relative min-h-screen overflow-hidden bg-[#0b0d12] text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-15%] top-[15%] h-[420px] w-[420px] rounded-full bg-[#f7b955]/15 blur-[140px]" />
        <div className="absolute right-[-15%] bottom-[10%] h-[420px] w-[420px] rounded-full bg-[#5ce1e6]/10 blur-[160px]" />
      </div>

      <div className="relative mx-auto w-full max-w-6xl px-5 pb-20 pt-16 md:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-white/50">
              Journal
            </p>
            <h1 className="mt-3 text-4xl font-display">Thoughts & Notes</h1>
            <p className="mt-3 max-w-2xl text-sm text-white/70">
              A space for experiments, ideas, and learnings. Pulled straight from
              Supabase so it stays fresh.
            </p>
          </div>
          <Link to="/">
            <Button variant="ghost">Back to home</Button>
          </Link>
        </div>

        {isLoading && (
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="h-72 rounded-3xl border border-white/10 bg-white/5"
              />
            ))}
          </div>
        )}

        {error && (
          <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/70">
            {error}
          </div>
        )}

        {!isLoading && !error && !hasBlogs && (
          <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/70">
            No blogs yet. Add your first post in Supabase to see it here.
          </div>
        )}

        {!isLoading && !error && hasBlogs && (
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {blogs.map((blog) => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

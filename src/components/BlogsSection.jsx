import BlogCard from "./blog/BlogCard";
import { useBlogs } from "../hooks/useBlogs";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";

export default function BlogsSection() {
  const { blogs, isLoading, error, hasBlogs } = useBlogs({ limit: 3 });

  return (
    <section className="w-full">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-white/50">
            Writing
          </p>
          <h2 className="mt-2 text-3xl font-display text-white">Latest Blogs</h2>
        </div>
        <Link to="/blogs">
          <Button variant="ghost">View all</Button>
        </Link>
      </div>

      {isLoading && (
        <div className="mt-6 grid gap-5">
          {Array.from({ length: 2 }).map((_, index) => (
            <div
              key={index}
              className="h-56 rounded-3xl border border-white/10 bg-white/5"
            />
          ))}
        </div>
      )}

      {error && (
        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/70">
          {error}
        </div>
      )}

      {!isLoading && !error && !hasBlogs && (
        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/70">
          No blogs yet. Add your first post in Supabase to see it here.
        </div>
      )}

      {!isLoading && !error && hasBlogs && (
        <div className="mt-6 grid gap-5">
          {blogs.map((blog) => (
            <BlogCard key={blog.id} blog={blog} compact />
          ))}
        </div>
      )}
    </section>
  );
}

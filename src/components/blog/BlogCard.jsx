import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Link } from "react-router-dom";

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

export default function BlogCard({ blog, compact = false }) {
  const dateLabel = formatDate(blog.publishedAt);
  const tags = blog.tags || [];
  const tagList = compact ? tags.slice(0, 2) : tags.slice(0, 4);
  const cardClassName =
    "group block h-full transition hover:-translate-y-1 hover:border-white/20";
  const internalHref = blog.slug ? `/blogs/${blog.slug}` : "/blogs";

  const card = (
    <Card className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent" />
      <CardContent className="relative flex h-full flex-col gap-4">
        {blog.coverUrl ? (
          <img
            src={blog.coverUrl}
            alt={blog.title}
            className="h-40 w-full rounded-2xl object-cover"
            loading="lazy"
          />
        ) : (
          <div className="h-40 w-full rounded-2xl bg-gradient-to-br from-white/10 to-white/0" />
        )}

        <div className="flex flex-wrap items-center gap-3 text-xs text-white/60">
          {dateLabel && <span>{dateLabel}</span>}
          {blog.readTime && <span>{blog.readTime} min read</span>}
        </div>

        <div>
          <h3 className="text-xl font-semibold text-white">{blog.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-white/70">
            {blog.excerpt}
          </p>
        </div>

        {tagList.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tagList.map((tag) => (
              <Badge key={tag} className="border-white/20 bg-white/5 text-white/70">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );

  if (blog.url) {
    return (
      <a href={blog.url} target="_blank" rel="noreferrer" className={cardClassName}>
        {card}
      </a>
    );
  }

  return (
    <Link to={internalHref} className={cardClassName}>
      {card}
    </Link>
  );
}

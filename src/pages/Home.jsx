import { useState } from "react";
import { Link } from "react-router-dom";
import { FaRegNewspaper } from "react-icons/fa";
import GreetingAnimation from "../components/GreetingAnimation/GreetingAnimation";
import Details from "../components/Details";
import RightSide from "../components/RightSide";
import BlogsSection from "../components/BlogsSection";
import { Card, CardContent } from "../components/ui/card";

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navItems = [
    { id: "profile", label: "Profile" },
    { id: "about", label: "About" },
    { id: "skills", label: "Skills" },
    { id: "experience", label: "Experience" },
    { id: "education", label: "Education" },
    { id: "projects", label: "Projects" },
    { id: "blogs", label: "Blogs" },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0b0d12] text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 top-[-10%] h-[380px] w-[380px] rounded-full bg-[#f7b955]/20 blur-[120px]" />
        <div className="absolute right-[-10%] top-[20%] h-[420px] w-[420px] rounded-full bg-[#5ce1e6]/15 blur-[140px]" />
      </div>

      <GreetingAnimation />

      <div className="relative mx-auto w-full max-w-7xl px-3 pt-6 md:hidden">
        <div className="flex items-center justify-end gap-2">
          {/* <Link
            to="/blogs"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/80 transition hover:border-white/30 hover:text-white"
            aria-label="Go to blogs"
          >
            <FaRegNewspaper className="h-5 w-5" />
          </Link> */}
          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-expanded={menuOpen}
            aria-label="Toggle navigation"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/80 transition hover:border-white/30 hover:text-white"
          >
            <span className="sr-only">Toggle navigation</span>
            <span className="flex h-4 w-5 flex-col items-center justify-between">
              <span className="h-0.5 w-full rounded-full bg-current" />
              <span className="h-0.5 w-full rounded-full bg-current" />
              <span className="h-0.5 w-full rounded-full bg-current" />
            </span>
          </button>
        </div>

        {menuOpen && (
          <Card className="absolute right-3 top-20 z-30 w-max">
            <CardContent className="p-2">
              <ul className="flex flex-col whitespace-nowrap text-sm text-white">
                {navItems.map((item) => (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      className="block rounded-xl px-3 py-2 font-medium text-white/80 transition hover:bg-white/10 hover:text-white"
                      onClick={() => setMenuOpen(false)}
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-10 px-3 pb-20 pt-16 md:grid md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)_minmax(0,0.9fr)] md:gap-10 md:px-3">
        <div id="profile" className="left-side scroll-mt-24">
          <Details />
        </div>
        <div className="middle-side">
          <RightSide />
        </div>
        <div id="blogs" className="right-side scroll-mt-24 md:pt-2">
          <BlogsSection />
        </div>
      </div>
    </div>
  );
}

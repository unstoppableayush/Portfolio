import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { Button } from "../components/ui/button";

export default function StartProject() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    projectType: "",
    budget: "",
    timeline: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!supabase) {
      setError("Supabase client not configured.");
      return;
    }

    if (!form.name || !form.email || !form.message) {
      setError("Name, email, and message are required.");
      return;
    }

    setIsSubmitting(true);
    setError("");
    setSuccess("");

    const payload = {
      name: form.name,
      email: form.email,
      company: form.company || null,
      project_type: form.projectType || null,
      budget: form.budget || null,
      timeline: form.timeline || null,
      message: form.message,
    };

    const { error: insertError } = await supabase
      .from("project_requests")
      .insert(payload);

    if (insertError) {
      setError(insertError.message);
      setIsSubmitting(false);
      return;
    }

    setSuccess("Thanks! I will reply soon.");
    setForm({
      name: "",
      email: "",
      company: "",
      projectType: "",
      budget: "",
      timeline: "",
      message: "",
    });
    setIsSubmitting(false);
  }

  return (
    <div className="contact-page min-h-screen bg-[#0b0d12] px-5 py-16 text-white md:px-10">
      <div className="mx-auto w-full max-w-3xl">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-white/50">
              Start Project
            </p>
            <h1 className="mt-2 text-4xl font-display">Let us build together</h1>
            <p className="mt-3 text-sm text-white/70">
              Share your goals and I will craft a tailored plan.
            </p>
          </div>
          <Link to="/">
            <Button variant="ghost" className="w-fit">Back to home</Button>
          </Link>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-8 grid gap-4 rounded-3xl border border-white/10 bg-white/[0.03] p-6"
        >
          <div className="grid gap-2">
            <label className="text-sm text-white/70" htmlFor="name">
              Name
            </label>
            <input
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="rounded-2xl border border-white/10 bg-transparent px-3 py-2 text-sm text-white outline-none focus:border-white/30"
            />
          </div>
          <div className="grid gap-2">
            <label className="text-sm text-white/70" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className="rounded-2xl border border-white/10 bg-transparent px-3 py-2 text-sm text-white outline-none focus:border-white/30"
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <label className="text-sm text-white/70" htmlFor="company">
                Company (optional)
              </label>
              <input
                id="company"
                name="company"
                value={form.company}
                onChange={handleChange}
                className="rounded-2xl border border-white/10 bg-transparent px-3 py-2 text-sm text-white outline-none focus:border-white/30"
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm text-white/70" htmlFor="projectType">
                Project type
              </label>
              <input
                id="projectType"
                name="projectType"
                value={form.projectType}
                onChange={handleChange}
                placeholder="MVP, redesign, AI feature"
                className="rounded-2xl border border-white/10 bg-transparent px-3 py-2 text-sm text-white outline-none focus:border-white/30"
              />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <label className="text-sm text-white/70" htmlFor="budget">
                Budget range
              </label>
              <input
                id="budget"
                name="budget"
                value={form.budget}
                onChange={handleChange}
                placeholder="$2k-$5k"
                className="rounded-2xl border border-white/10 bg-transparent px-3 py-2 text-sm text-white outline-none focus:border-white/30"
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm text-white/70" htmlFor="timeline">
                Timeline
              </label>
              <input
                id="timeline"
                name="timeline"
                value={form.timeline}
                onChange={handleChange}
                placeholder="2-4 weeks"
                className="rounded-2xl border border-white/10 bg-transparent px-3 py-2 text-sm text-white outline-none focus:border-white/30"
              />
            </div>
          </div>
          <div className="grid gap-2">
            <label className="text-sm text-white/70" htmlFor="message">
              Project details
            </label>
            <textarea
              id="message"
              name="message"
              value={form.message}
              onChange={handleChange}
              className="min-h-[140px] rounded-2xl border border-white/10 bg-transparent px-3 py-2 text-sm text-white outline-none focus:border-white/30"
            />
          </div>

          {error && (
            <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">
              {error}
            </div>
          )}

          {success && (
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-100">
              {success}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-fit rounded-full bg-[#f7b955] px-5 py-2 text-sm font-semibold text-[#1a1206] transition hover:bg-[#f4a93b] disabled:opacity-60"
          >
            {isSubmitting ? "Sending..." : "Send request"}
          </button>
        </form>
      </div>
    </div>
  );
}

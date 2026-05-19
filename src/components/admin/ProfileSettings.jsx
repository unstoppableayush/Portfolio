import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { DEFAULT_PROFILE_SETTINGS } from "../../hooks/useProfileSettings";

export default function ProfileSettings() {
  const [imageUrl, setImageUrl] = useState(DEFAULT_PROFILE_SETTINGS.imageUrl);
  const [resumeUrl, setResumeUrl] = useState(DEFAULT_PROFILE_SETTINGS.resumeUrl);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadSettings() {
      if (!supabase) {
        setError("Supabase client not configured.");
        setIsLoading(false);
        return;
      }

      const { data, error: fetchError } = await supabase
        .from("profile_settings")
        .select("image_url,resume_url")
        .eq("id", 1)
        .maybeSingle();

      if (!isMounted) return;

      if (fetchError) {
        setError(fetchError.message);
      } else if (data) {
        setImageUrl(data.image_url || DEFAULT_PROFILE_SETTINGS.imageUrl);
        setResumeUrl(data.resume_url || DEFAULT_PROFILE_SETTINGS.resumeUrl);
      }

      setIsLoading(false);
    }

    loadSettings();

    return () => {
      isMounted = false;
    };
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();

    if (!supabase) {
      setError("Supabase client not configured.");
      return;
    }

    setIsSaving(true);
    setMessage("");
    setError("");

    const { error: saveError } = await supabase.from("profile_settings").upsert({
      id: 1,
      image_url: imageUrl.trim(),
      resume_url: resumeUrl.trim(),
      updated_at: new Date().toISOString(),
    });

    if (saveError) {
      setError(saveError.message);
    } else {
      setMessage("Profile links updated successfully.");
    }

    setIsSaving(false);
  }

  return (
    <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.03] p-6">
      <div>
        <p className="text-xs uppercase tracking-[0.35em] text-white/50">
          Profile
        </p>
        <h2 className="mt-2 text-2xl font-display text-white">
          Resume and Image
        </h2>
      </div>

      {isLoading ? (
        <div className="mt-4 text-sm text-white/60">Loading profile settings...</div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-5 grid gap-4">
          <div className="grid gap-2">
            <label className="text-sm text-white/70" htmlFor="profileImageUrl">
              Profile image URL
            </label>
            <input
              id="profileImageUrl"
              type="url"
              value={imageUrl}
              onChange={(event) => setImageUrl(event.target.value)}
              className="rounded-2xl border border-white/10 bg-transparent px-3 py-2 text-sm text-white outline-none focus:border-white/30"
            />
          </div>

          <div className="grid gap-2">
            <label className="text-sm text-white/70" htmlFor="resumeUrl">
              Resume URL
            </label>
            <input
              id="resumeUrl"
              type="url"
              value={resumeUrl}
              onChange={(event) => setResumeUrl(event.target.value)}
              className="rounded-2xl border border-white/10 bg-transparent px-3 py-2 text-sm text-white outline-none focus:border-white/30"
            />
          </div>

          {imageUrl && (
            <img
              src={imageUrl}
              alt="Profile preview"
              className="h-24 w-24 rounded-full border border-white/10 object-cover"
            />
          )}

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
            {isSaving ? "Saving..." : "Save profile links"}
          </button>
        </form>
      )}
    </div>
  );
}

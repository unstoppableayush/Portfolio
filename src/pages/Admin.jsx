import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import AdminEditor from "../components/admin/AdminEditor";
import ProjectRequests from "../components/admin/ProjectRequests";
import ProfileSettings from "../components/admin/ProfileSettings";

export default function Admin() {
  const [session, setSession] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadSession() {
      if (!supabase) {
        setError("Supabase client not configured.");
        setIsLoading(false);
        return;
      }

      const { data } = await supabase.auth.getSession();
      if (isMounted) {
        setSession(data.session);
        setIsLoading(false);
      }
    }

    loadSession();

    const { data: authListener } = supabase
      ? supabase.auth.onAuthStateChange((_event, newSession) => {
          setSession(newSession);
        })
      : { data: null };

    return () => {
      isMounted = false;
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  async function handleLogin(event) {
    event.preventDefault();
    if (!supabase) return;

    setError("");
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message);
    }
  }

  async function handleSignOut() {
    if (!supabase) return;
    await supabase.auth.signOut();
  }

  return (
    <div className="admin-page min-h-screen bg-[#0b0d12] px-5 py-16 text-white md:px-10">
      <div className="mx-auto w-full max-w-4xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-white/50">
              Admin
            </p>
            <h1 className="mt-2 text-4xl font-display">Blog Studio</h1>
            <p className="mt-3 text-sm text-white/70">
              Log in to publish posts to Supabase.
            </p>
          </div>
          {session && (
            <button
              onClick={handleSignOut}
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70 transition hover:text-white"
            >
              Sign out
            </button>
          )}
        </div>

        {isLoading && (
          <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/70">
            Checking session...
          </div>
        )}

        {!isLoading && error && (
          <div className="mt-8 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
            {error}
          </div>
        )}

        {!isLoading && !session && (
          <form
            onSubmit={handleLogin}
            className="mt-8 grid gap-4 rounded-3xl border border-white/10 bg-white/[0.03] p-6"
          >
            <div className="grid gap-2">
              <label className="text-sm text-white/70" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="rounded-2xl border border-white/10 bg-transparent px-3 py-2 text-sm text-white outline-none focus:border-white/30"
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm text-white/70" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="rounded-2xl border border-white/10 bg-transparent px-3 py-2 text-sm text-white outline-none focus:border-white/30"
              />
            </div>
            <button
              type="submit"
              className="mt-2 w-fit rounded-full bg-[#f7b955] px-5 py-2 text-sm font-semibold text-[#1a1206] transition hover:bg-[#f4a93b]"
            >
              Login
            </button>
          </form>
        )}

        {session && (
          <>
            <ProfileSettings />
            <AdminEditor />
            <ProjectRequests />
          </>
        )}
      </div>
    </div>
  );
}

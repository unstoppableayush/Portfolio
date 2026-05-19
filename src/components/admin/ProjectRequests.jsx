import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

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

export default function ProjectRequests() {
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadRequests() {
      if (!supabase) {
        setError("Supabase client not configured.");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      const { data, error: fetchError } = await supabase
        .from("project_requests")
        .select("*")
        .order("created_at", { ascending: false });

      if (!isMounted) return;

      if (fetchError) {
        setError(fetchError.message);
      } else {
        setRequests(data || []);
      }

      setIsLoading(false);
    }

    loadRequests();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="mt-10 rounded-3xl border border-white/10 bg-white/[0.03] p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-white/50">
            Requests
          </p>
          <h2 className="mt-2 text-2xl font-display text-white">
            Project inquiries
          </h2>
        </div>
      </div>

      {isLoading && (
        <div className="mt-4 text-sm text-white/60">Loading requests...</div>
      )}

      {error && !isLoading && (
        <div className="mt-4 rounded-2xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">
          {error}
        </div>
      )}

      {!isLoading && !error && requests.length === 0 && (
        <div className="mt-4 text-sm text-white/60">No requests yet.</div>
      )}

      {!isLoading && !error && requests.length > 0 && (
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {requests.map((request) => (
            <div
              key={request.id}
              className="w-full max-w-2xl rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/70"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-base font-semibold text-white">
                    {request.name}
                  </p>
                  <p className="text-xs text-white/50">{request.email}</p>
                </div>
                <span className="text-xs text-white/50">
                  {formatDate(request.created_at)}
                </span>
              </div>
              <div className="mt-3 grid gap-2 text-xs text-white/60">
                <div className="flex flex-wrap gap-4">
                  {request.company && <span>Company: {request.company}</span>}
                  {request.project_type && (
                    <span>Project: {request.project_type}</span>
                  )}
                </div>
                <div className="flex flex-wrap gap-4">
                  {request.budget && <span>Budget: {request.budget}</span>}
                  {request.timeline && <span>Timeline: {request.timeline}</span>}
                </div>
              </div>
              <p className="mt-3 text-sm text-white/70">Details: {request.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

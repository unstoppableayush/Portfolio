import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export const DEFAULT_PROFILE_SETTINGS = {
  imageUrl:
    "https://res.cloudinary.com/dxeslfxp7/image/upload/v1763248869/WhatsApp_Image_2025-10-29_at_11.52.04_AM_a1i4lx.jpg",
  resumeUrl:
    "https://drive.google.com/file/d/10kOURX9Gd4Rw9q-mlBOYElIMCtfpo9pv/view",
};

function normalizeSettings(settings) {
  return {
    imageUrl: settings?.image_url || DEFAULT_PROFILE_SETTINGS.imageUrl,
    resumeUrl: settings?.resume_url || DEFAULT_PROFILE_SETTINGS.resumeUrl,
  };
}

export function useProfileSettings() {
  const [settings, setSettings] = useState(DEFAULT_PROFILE_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadSettings() {
      setIsLoading(true);
      setError("");

      if (!supabase) {
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
      } else {
        setSettings(normalizeSettings(data));
      }

      setIsLoading(false);
    }

    loadSettings();

    return () => {
      isMounted = false;
    };
  }, []);

  return { settings, isLoading, error };
}

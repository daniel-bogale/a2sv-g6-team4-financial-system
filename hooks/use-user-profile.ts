import { useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export type Profile = {
  id: string;
  full_name: string;
  role: string;
};

export function useUserProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      const supabase = createSupabaseBrowserClient();
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError || !user) {
        setProfile(null);
        setLoading(false);
        return;
      }

      // Get role from app_metadata and other data from profiles table
      const role = (user.app_metadata?.role as string) || "STAFF";

      setProfile({
        id: user.id,
        full_name: user.email || "Unknown",
        role: role,
      });

      setLoading(false);
    };
    fetchProfile();
  }, []);

  return { profile, loading };
}

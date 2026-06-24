import { supabase } from "./supabase";

const SESSION_KEY = "reyhan_admin_v1";

export function isAdminLoggedIn(): boolean {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return false;
    const { ts } = JSON.parse(raw);
    return Date.now() - ts < 24 * 60 * 60 * 1000;
  } catch {
    return false;
  }
}

export async function loginAdmin(username: string, password: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from("admins")
      .select("id")
      .eq("username", username)
      .eq("password", password)
      .single();

    if (error || !data) return false;

    sessionStorage.setItem(SESSION_KEY, JSON.stringify({ ts: Date.now(), username }));
    return true;
  } catch {
    return false;
  }
}

export function logoutAdmin(): void {
  sessionStorage.removeItem(SESSION_KEY);
}

export function recordVisit(): void {
  try {
    const today = new Date().toDateString();
    const stored = localStorage.getItem("vc_date");
    const total = parseInt(localStorage.getItem("vc_total") || "0");
    if (stored !== today) {
      localStorage.setItem("vc_date", today);
      localStorage.setItem("vc_today", "1");
      localStorage.setItem("vc_total", String(total + 1));
      // Fire and forget — record in Supabase visitors table
      supabase.from("visitors").insert([{
        user_agent: navigator.userAgent.slice(0, 200),
      }]).then(() => {});
    }
  } catch {}
}

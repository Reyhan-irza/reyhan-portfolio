import { useEffect, useState } from "react";
import { Users, Calendar } from "lucide-react";
import { supabase } from "@/lib/supabase";

const KEY_SESSION = "pf_session";

function getLocalData() {
  try {
    const sessionKey = sessionStorage.getItem(KEY_SESSION);
    if (!sessionKey) {
      sessionStorage.setItem(KEY_SESSION, "1");
    }
    const bracket = Math.floor(Date.now() / 30000);
    const online  = (bracket % 4) + 1;
    return { isNewSession: !sessionKey, online };
  } catch {
    return { isNewSession: false, online: 1 };
  }
}

export default function VisitorCounter() {
  const [total,  setTotal]  = useState<number | null>(null);
  const [today,  setToday]  = useState<number | null>(null);
  const [online, setOnline] = useState(1);

  useEffect(() => {
    const { online: onlineCount } = getLocalData();
    setOnline(onlineCount);

    (async () => {
      try {
        // Total visitors
        const { count: totalCount } = await supabase
          .from("visitors")
          .select("id", { count: "exact", head: true });

        // Today's visitors (UTC date)
        const todayStart = new Date();
        todayStart.setUTCHours(0, 0, 0, 0);

        const { count: todayCount } = await supabase
          .from("visitors")
          .select("id", { count: "exact", head: true })
          .gte("created_at", todayStart.toISOString());

        if (totalCount !== null) setTotal(totalCount);
        if (todayCount !== null) setToday(todayCount);
      } catch {
        // Supabase not configured — stay hidden
      }
    })();
  }, []);

  if (total === null) return null;

  return (
    <div className="flex items-center gap-4 flex-wrap justify-center">
      <div className="flex items-center gap-1.5 text-[11px] text-white/30">
        <Users className="w-3 h-3" />
        <span>{total.toLocaleString("id-ID")} kunjungan</span>
      </div>
      <span className="text-white/15 text-[10px]">·</span>
      <div className="flex items-center gap-1.5 text-[11px] text-white/30">
        <Calendar className="w-3 h-3" />
        <span>{today ?? 0} hari ini</span>
      </div>
      <span className="text-white/15 text-[10px]">·</span>
      <div className="flex items-center gap-1.5 text-[11px] text-green-400/45">
        <span className="w-1.5 h-1.5 rounded-full bg-green-400/60 animate-pulse" />
        <span>{online} online</span>
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import { Users, Calendar } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function VisitorCounter() {
  const [total, setTotal] = useState<number | null>(null);
  const [today, setToday] = useState<number | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const { count: totalCount, error: totalError } = await supabase
          .from("visitors")
          .select("id", { count: "exact", head: true });
        if (totalError) throw totalError;

        const todayStart = new Date();
        todayStart.setUTCHours(0, 0, 0, 0);

        const { count: todayCount, error: todayError } = await supabase
          .from("visitors")
          .select("id", { count: "exact", head: true })
          .gte("created_at", todayStart.toISOString());
        if (todayError) throw todayError;

        setTotal(totalCount);
        setToday(todayCount);
      } catch {
        setTotal(null);
        setToday(null);
      }
    })();
  }, []);

  if (total === null) return null;

  return (
    <div
      className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2"
      aria-label="Visitor counts from the Supabase visitors table"
    >
       <span className="flex items-center gap-1.5 text-[11px] text-[#6d6a62]">
        <Users className="h-3 w-3" aria-hidden="true" />
        {total.toLocaleString("id-ID")} recorded visits
      </span>
      {today !== null && (
         <span className="flex items-center gap-1.5 text-[11px] text-[#6d6a62]">
          <Calendar className="h-3 w-3" aria-hidden="true" />
          {today.toLocaleString("id-ID")} today (UTC)
        </span>
      )}
       <span className="font-mono text-[9px] uppercase tracking-[.12em] text-[#6d6a62]">
        Source: Supabase
      </span>
      </div>
  );
}

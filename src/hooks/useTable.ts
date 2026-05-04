import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useTable<T = any>(table: any, select = "*") {
  return useQuery<T[]>({
    queryKey: [table, select],
    queryFn: async () => {
      const { data, error } = await (supabase as any).from(table).select(select).limit(1000);
      if (error) throw error;
      return (data ?? []) as T[];
    },
  });
}
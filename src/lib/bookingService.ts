import { supabase } from "@/lib/supabase";

export async function createBooking(payload: {
  user_id: string;
  talent_id: string;
  purpose: string;
  type: "online" | "offline";
  date: string;
  time: string;
  duration: number;
  total: number;
}) {
  const { data, error } = await supabase
    .from("bookings")
    .insert({
      ...payload,
      payment_status: "pending",
      approval_status: "pending_approval",
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

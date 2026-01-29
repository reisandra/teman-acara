import { supabase } from "@/lib/supabase";

export async function createBooking(payload: {
  user_id: string;
  talent_id: string;
  purpose: string;
  type: string;
  date: string;
  time: string;
  duration: number;
  total: number;
  payment_status?: string;
  approval_status?: string;
  payment_method?: string;
  payment_code?: string;
  payment_proof?: string;
  transfer_amount?: number;
  transfer_time?: string;
}) {
  const { data, error } = await supabase
    .from("bookings")
    .insert(payload)
    .select()
    .single();

  if (error) throw error;
  return data;
}
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function getPendingPayments() {
    const { data, error } = await supabaseAdmin
        .from("payments")
        .select(`
      id,
      user_id,
      plan,
      reference,
      created_at,
      users(email)
    `)
        .eq("status", "pending")
        .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
}

export async function approvePayment(payment) {
    const expires =
        payment.plan === "monthly"
            ? new Date(Date.now() + 30 * 86400000)
            : new Date(Date.now() + 365 * 86400000);

    // 1️⃣ Approve payment
    await supabaseAdmin
        .from("payments")
        .update({ status: "approved" })
        .eq("id", payment.id);

    // 2️⃣ Activate subscription
    await supabaseAdmin.from("subscriptions").upsert({
        user_id: payment.user_id,
        plan: payment.plan,
        status: "active",
        expires_at: expires.toISOString(),
    });
}

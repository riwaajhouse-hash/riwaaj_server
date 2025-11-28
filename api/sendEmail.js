import { Resend } from "resend";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { email, name, orderId, total, items } = req.body;

    if (!email || !orderId || !name) {
      return res
        .status(400)
        .json({ success: false, error: "Missing fields" });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    const itemsList =
      items
        ?.map(
          (item) => `
        <tr>
          <td style="padding:8px;border:1px solid #ddd;">${item.title}</td>
          <td style="padding:8px;border:1px solid #ddd;" align="center">${item.quantity}</td>
          <td style="padding:8px;border:1px solid #ddd;" align="center">${item.price}</td>
        </tr>
      `
        )
        .join("") || "";

    const html = `
      <div style="font-family:'Segoe UI',Roboto,Arial,sans-serif;background-color:#f6f9fc;padding:40px 0;margin:0;">
        <table align="center" cellpadding="0" cellspacing="0" width="600" style="background-color:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.05);">
          <tr>
            <td style="background-color:#111827;padding:20px 30px;text-align:center;">
              <img
                src="https://res.cloudinary.com/dnqcvexsd/image/upload/v1763590850/logo_icon_zraciq.png"
                alt="Riwaaj House"
                style="width:80px;height:auto;margin-bottom:10px;"
              />
              <h1 style="color:#ffffff;margin:0;font-size:22px;letter-spacing:1px;">Riwaaj House</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:30px 40px;">
              <h2 style="color:#111827;margin:0 0 10px;">Thank you, ${name}!</h2>
              <p style="color:#555;margin:0 0 20px;font-size:15px;">
                We’ve received your order <b>#${orderId}</b> Here’s a summary:
              </p>
              <table width="100%" cellpadding="6" cellspacing="0" style="border-collapse:collapse;font-size:14px;color:#111827;margin-bottom:20px;">
                <thead>
                  <tr style="background:#e5e7eb;">
                    <th align="left" style="padding:8px;border:1px solid #ddd;">Product Title</th>
                    <th align="center" style="padding:8px;border:1px solid #ddd;">Qty</th>
                    <th align="center" style="padding:8px;border:1px solid #ddd;">Price</th>                
                  </tr>
                </thead>
                <tbody>
                  ${itemsList}
                </tbody>
              </table>
              <p style="font-size:16px;color:#111827;margin-bottom:24px">
                <b>Total:</b> <span>Rs.${Number(total).toLocaleString()}</span>
              </p>
              <p style="margin-top:30px;color:#555;font-size:14px;">
                If you have any questions, reply to this email or reach on Whatsapp — we’re happy to help.
              </p>
            </td>
          </tr>
          <tr>
            <td style="background-color:#f3f4f6;padding:15px 30px;text-align:center;color:#777;font-size:12px;">
              <p style="margin:0;">© ${new Date().getFullYear()} <b>Riwaaj House</b>. All rights reserved.</p>
              <p style="margin:5px 0 0;">Made with 💛 in Pakistan</p>
            </td>
          </tr>
        </table>
      </div>
    `;

    await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: email,
      subject: "Order Confirmation",
      html,
    });

    return res.json({ success: true });
  } catch (error) {
    console.error("Email send error:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
}

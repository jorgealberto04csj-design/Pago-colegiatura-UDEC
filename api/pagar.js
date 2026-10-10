// Backend (Vercel Serverless Function) — el único lugar donde vive tu Access Token.
// Nunca pongas el Access Token en el HTML/frontend.
// Usa la API Orders (api.mercadopago.com/v1/orders), que es la que Mercado Pago
// recomienda ahora para integraciones nuevas de pago con tarjeta.

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const {
    token,
    payment_method_id,
    installments,
    email,
    identification,
    amount,
    description,
    referencia,
  } = req.body;

  if (!token || !payment_method_id || !amount) {
    return res.status(400).json({ error: "Faltan datos del pago" });
  }

  try {
    const mpResp = await fetch("https://api.mercadopago.com/v1/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.MP_ACCESS_TOKEN}`,
        "X-Idempotency-Key": referencia + "-" + Date.now(),
      },
      body: JSON.stringify({
        type: "online",
        processing_mode: "automatic",
        external_reference: referencia,
        total_amount: Number(amount).toFixed(2),
        payer: { email, identification },
        transactions: {
          payments: [
            {
              amount: Number(amount).toFixed(2),
              payment_method: {
                id: payment_method_id,
                type: "credit_card",
                token,
                installments: Number(installments) || 1,
              },
            },
          ],
        },
        description,
      }),
    });

    const result = await mpResp.json();
console.log("Respuesta Mercado Pago:", JSON.stringify(result));
return res.status(mpResp.status).json(result);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message || "Error al procesar el pago" });
  }
}

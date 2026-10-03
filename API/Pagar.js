// Backend (Vercel Serverless Function) — el único lugar donde vive tu Access Token.
// Nunca pongas el Access Token en el HTML/frontend.

import { MercadoPagoConfig, Payment } from "mercadopago";

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN, // configúralo en Vercel, no aquí
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const {
    token,
    payment_method_id,
    issuer_id,
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
    const payment = new Payment(client);
    const result = await payment.create({
      body: {
        transaction_amount: Number(amount),
        token,
        description,
        installments: Number(installments) || 1,
        payment_method_id,
        issuer_id,
        payer: {
          email,
          identification,
        },
        external_reference: referencia,
        statement_descriptor: "COLEGIATURA",
      },
    });

    // Aquí es buen lugar para guardar el resultado en tu base de datos
    // y generar/enviar el comprobante (result.id, result.status, result.date_approved, etc.)

    return res.status(200).json(result);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message || "Error al procesar el pago" });
  }
}

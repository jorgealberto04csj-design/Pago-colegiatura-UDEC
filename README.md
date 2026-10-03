# Pago de colegiatura — Mercado Pago

## Qué es cada archivo
- `index.html` — la página que ve quien paga (edítala: monto, concepto, tu Public Key).
- `api/pagar.js` — el backend que hace el cobro real con tu Access Token (secreto).
- `package.json` — dependencia del SDK de Mercado Pago.

## Pasos para dejarla funcionando

1. **Consigue tus credenciales**
   mercadopago.com.mx/developers/panel → crea una aplicación → pestaña Credenciales.
   - Copia el **Public Key** → pégalo en `index.html` donde dice `TU_PUBLIC_KEY_DE_MERCADO_PAGO`.
   - Copia el **Access Token** → NO lo pongas en ningún archivo. Se agrega como variable de entorno (paso 3).

2. **Sube este proyecto a GitHub**
   - Crea un repositorio nuevo y sube estos archivos (puedes arrastrarlos en github.com desde "Add file → Upload files").

3. **Despliega en Vercel**
   - Entra a vercel.com → inicia sesión con GitHub → "Add New… → Project" → elige tu repositorio.
   - Antes de dar "Deploy", abre "Environment Variables" y agrega:
     - Name: `MP_ACCESS_TOKEN`
     - Value: (tu Access Token)
   - Deploy. Te dará una URL tipo `pago-colegiatura.vercel.app`, ya con frontend y backend funcionando juntos.

4. **Prueba primero con credenciales de PRUEBA**
   Mercado Pago te da credenciales de "test" y tarjetas de prueba en:
   mercadopago.com.mx/developers/panel/test-users — úsalas antes de pasar a producción para no cobrar de verdad por error.

5. **Cuando ya probaste bien**, cambia a tus credenciales de producción y el dinero de cada pago aprobado caerá a tu cuenta de Mercado Pago normalmente (retirable a tu banco desde ahí).

## Nota sobre el comprobante
`api/pagar.js` recibe la respuesta completa de Mercado Pago (`result`) con el id del pago, estado y fecha. Ahí mismo puedes guardar ese resultado en una base de datos y generar el PDF/pantalla de comprobante con esos datos reales.

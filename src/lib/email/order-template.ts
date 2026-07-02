import { formatMoney } from "@/lib/utils";

export type OrderEmailLineItem = {
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  imageUrl: string | null;
};

export type OrderEmailViewModel = {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: string;
  subtotal: number;
  shippingFee: number;
  discountAmount: number;
  total: number;
  paymentStatus: string;
  orderStatus: string;
  items: OrderEmailLineItem[];
  origin: string;
};

export type OrderEmailTemplateInput = {
  title: string;
  eyebrow: string;
  intro: string;
  order: OrderEmailViewModel;
  note?: string;
};

const colors = {
  yellow: "#f4f019",
  ink: "#111111",
  muted: "#4c4a24",
  rust: "#9b3f1f",
  bone: "#fffbe2",
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function policyLinks(origin: string) {
  return [
    { label: "Refund policy", href: `${origin}/returns` },
    { label: "Terms and conditions", href: `${origin}/terms` },
    { label: "Privacy policy", href: `${origin}/privacy` },
  ];
}

export function renderOrderEmail(input: OrderEmailTemplateInput) {
  const { order } = input;
  const preview = `${input.title} for ${order.orderNumber}`;
  const itemsHtml = order.items
    .map((item) => {
      const image = item.imageUrl
        ? `<td style="width:132px;padding:18px 14px 18px 0;vertical-align:top;"><img src="${escapeHtml(item.imageUrl)}" alt="${escapeHtml(item.productName)}" width="118" style="display:block;width:118px;max-width:118px;height:auto;border:0;outline:0;background:transparent;" /></td>`
        : `<td style="width:132px;padding:18px 14px 18px 0;vertical-align:top;"></td>`;

      return `
        <tr>
          ${image}
          <td style="padding:18px 0;border-top:2px solid ${colors.ink};vertical-align:top;">
            <div style="font-family:Arial Black, Impact, Arial, sans-serif;font-size:24px;line-height:0.95;text-transform:uppercase;color:${colors.ink};">${escapeHtml(item.productName)}</div>
            <div style="margin-top:10px;font-family:Arial, sans-serif;font-size:13px;font-weight:700;line-height:1.5;color:${colors.muted};">Qty ${item.quantity} / ${formatMoney(item.unitPrice)} each</div>
            <div style="margin-top:10px;font-family:Arial, sans-serif;font-size:16px;font-weight:900;color:${colors.ink};">${formatMoney(item.totalPrice)}</div>
          </td>
        </tr>
      `;
    })
    .join("");

  const policyHtml = policyLinks(order.origin)
    .map(
      (link) =>
        `<a href="${link.href}" style="color:${colors.ink};font-weight:900;text-decoration:underline;text-transform:uppercase;">${link.label}</a>`,
    )
    .join(" &nbsp;/&nbsp; ");

  const html = `<!doctype html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <title>${escapeHtml(preview)}</title>
  </head>
  <body style="margin:0;padding:0;background:${colors.yellow};color:${colors.ink};">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(preview)}</div>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:${colors.yellow};border-collapse:collapse;">
      <tr>
        <td align="center" style="padding:0;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="width:100%;max-width:680px;border-collapse:collapse;">
            <tr>
              <td style="padding:30px 18px 22px;">
                <div style="font-family:Arial, sans-serif;font-size:11px;font-weight:900;letter-spacing:0.28em;text-transform:uppercase;color:${colors.rust};">${escapeHtml(input.eyebrow)}</div>
                <h1 style="margin:18px 0 0;font-family:Arial Black, Impact, Arial, sans-serif;font-size:56px;font-style:italic;font-weight:900;letter-spacing:0;text-transform:uppercase;line-height:0.86;color:${colors.ink};">${escapeHtml(input.title)}</h1>
                <p style="margin:22px 0 0;font-family:Arial, sans-serif;font-size:16px;font-weight:800;line-height:1.55;color:${colors.ink};">${escapeHtml(input.intro)}</p>
                ${
                  input.note
                    ? `<p style="margin:14px 0 0;font-family:Arial, sans-serif;font-size:14px;font-weight:800;line-height:1.55;color:${colors.rust};">${escapeHtml(input.note)}</p>`
                    : ""
                }
              </td>
            </tr>
            <tr>
              <td style="padding:0 18px 16px;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;border-top:3px solid ${colors.ink};border-bottom:3px solid ${colors.ink};">
                  <tr>
                    <td style="padding:14px 0;font-family:Arial, sans-serif;font-size:12px;font-weight:900;text-transform:uppercase;color:${colors.rust};">Order</td>
                    <td align="right" style="padding:14px 0;font-family:Arial, sans-serif;font-size:12px;font-weight:900;color:${colors.ink};">${escapeHtml(order.orderNumber)}</td>
                  </tr>
                  <tr>
                    <td style="padding:0 0 14px;font-family:Arial, sans-serif;font-size:12px;font-weight:900;text-transform:uppercase;color:${colors.rust};">Status</td>
                    <td align="right" style="padding:0 0 14px;font-family:Arial, sans-serif;font-size:12px;font-weight:900;text-transform:uppercase;color:${colors.ink};">${escapeHtml(order.orderStatus)} / ${escapeHtml(order.paymentStatus)}</td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:0 18px;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">
                  ${itemsHtml}
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:14px 18px 24px;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;border-top:3px solid ${colors.ink};">
                  ${summaryRow("Subtotal", formatMoney(order.subtotal))}
                  ${summaryRow("Shipping", formatMoney(order.shippingFee))}
                  ${summaryRow("Discount", `-${formatMoney(order.discountAmount)}`)}
                  ${summaryRow("Total", formatMoney(order.total), true)}
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:0 18px 30px;">
                <div style="border-top:2px solid ${colors.ink};padding-top:18px;font-family:Arial, sans-serif;font-size:12px;font-weight:800;line-height:1.6;color:${colors.muted};">
                  <strong style="color:${colors.ink};text-transform:uppercase;">Ship to</strong><br />
                  ${escapeHtml(order.customerName)}<br />
                  ${escapeHtml(order.address)}<br />
                  ${escapeHtml(order.customerPhone)}
                </div>
                <div style="margin-top:20px;font-family:Arial, sans-serif;font-size:11px;font-weight:800;line-height:1.8;color:${colors.muted};">
                  ${policyHtml}
                </div>
                <p style="margin:18px 0 0;font-family:Arial, sans-serif;font-size:11px;font-weight:800;line-height:1.6;color:${colors.muted};">
                  Reply to this email for order support. Your reply goes to orders@neverfoundco.com.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  const text = [
    input.title,
    input.intro,
    input.note,
    `Order: ${order.orderNumber}`,
    `Status: ${order.orderStatus} / ${order.paymentStatus}`,
    ...order.items.map(
      (item) =>
        `${item.productName} - Qty ${item.quantity} - ${formatMoney(item.totalPrice)}`,
    ),
    `Subtotal: ${formatMoney(order.subtotal)}`,
    `Shipping: ${formatMoney(order.shippingFee)}`,
    `Discount: -${formatMoney(order.discountAmount)}`,
    `Total: ${formatMoney(order.total)}`,
    `Policies: ${order.origin}/returns ${order.origin}/terms ${order.origin}/privacy`,
  ]
    .filter(Boolean)
    .join("\n");

  return { html, text };
}

function summaryRow(label: string, value: string, large = false) {
  return `
    <tr>
      <td style="padding:${large ? "16px" : "10px"} 0 0;font-family:Arial, sans-serif;font-size:${large ? "18px" : "13px"};font-weight:900;text-transform:uppercase;color:${large ? colors.ink : colors.rust};">${label}</td>
      <td align="right" style="padding:${large ? "16px" : "10px"} 0 0;font-family:Arial, sans-serif;font-size:${large ? "24px" : "14px"};font-weight:900;color:${colors.ink};">${value}</td>
    </tr>
  `;
}

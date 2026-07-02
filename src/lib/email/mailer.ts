import { Resend } from "resend";

const ORDER_EMAIL_ADDRESS = "orders@neverfoundco.com";
const ORDER_EMAIL_FROM = `Never Found Orders <${ORDER_EMAIL_ADDRESS}>`;
const ADMIN_ORDER_EMAIL = "neverfoundclothing@gmail.com";

type EmailMessage = {
  to: string;
  subject: string;
  html: string;
  text: string;
};

let resend: Resend | null = null;

function getResendClient() {
  if (process.env.EMAIL_DISABLED === "true") return null;

  const apiKey = process.env.RESEND_API_KEY?.trim();

  if (!apiKey) return null;

  resend ??= new Resend(apiKey);
  return resend;
}

export async function sendEmail(message: EmailMessage) {
  const client = getResendClient();

  if (!client) {
    console.warn(
      `Skipping email "${message.subject}" because RESEND_API_KEY is not configured.`,
    );
    return;
  }

  const { error } = await client.emails.send({
    from: ORDER_EMAIL_FROM,
    replyTo: ORDER_EMAIL_ADDRESS,
    to: message.to,
    subject: message.subject,
    html: message.html,
    text: message.text,
  });

  if (error) {
    throw new Error(`Resend email failed: ${error.message}`);
  }
}

export function getAdminOrderEmail() {
  return ADMIN_ORDER_EMAIL;
}

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms and Conditions",
};

export default function TermsPage() {
  return (
    <div className="prose max-w-none dark:prose-invert">
      <h1>Terms and Conditions</h1>
      <p>Placeholder legal copy. Replace with final business terms before launch.</p>
    </div>
  );
}


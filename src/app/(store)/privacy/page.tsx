import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
};

export default function PrivacyPage() {
  return (
    <div className="prose max-w-none dark:prose-invert">
      <h1>Privacy Policy</h1>
      <p>Placeholder privacy copy. Replace with final policy before launch.</p>
    </div>
  );
}


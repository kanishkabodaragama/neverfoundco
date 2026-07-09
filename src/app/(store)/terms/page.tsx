import type { Metadata } from "next";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { StoreArtSurface } from "@/components/site/StoreArtSurface";
import {
  formatLegalEffectiveDate,
  getLegalPageSettings,
  resolveLegalPageSettings,
  type ResolvedLegalPageSettings,
} from "@/lib/db/site-settings";

export const metadata: Metadata = {
  title: "Terms and Conditions",
  description: "Never Found website, checkout, preorder, and account terms.",
};

export const dynamic = "force-dynamic";

type TermsSectionData = {
  after?: string[];
  before: string[];
  items?: string[];
  title: string;
};

const termsSections: TermsSectionData[] = [
  {
    title: "1. Eligibility",
    before: [
      "By using this website, you confirm that you are at least the age of majority in your country or have permission from a parent or legal guardian to use this website.",
      "You agree not to use our website or products for any unlawful purpose or in violation of applicable laws.",
    ],
  },
  {
    title: "2. Use of Our Website",
    before: ["You agree to use this website responsibly and not to:"],
    items: [
      "Violate any applicable laws or regulations.",
      "Infringe upon our intellectual property rights or those of others.",
      "Upload or distribute viruses, malware, or malicious software.",
      "Attempt to gain unauthorized access to our systems.",
      "Interfere with the operation or security of the website.",
      "Use automated tools to scrape or collect information without permission.",
      "Submit false or misleading information.",
    ],
    after: [
      "Violation of these Terms may result in suspension or termination of your access to the website.",
    ],
  },
  {
    title: "3. Products and Availability",
    before: [
      "All products displayed on our website are subject to availability.",
      "We reserve the right to:",
    ],
    items: [
      "Modify or discontinue products at any time.",
      "Limit quantities purchased.",
      "Refuse or cancel orders when necessary.",
      "Correct pricing errors or product information without prior notice.",
    ],
    after: [
      "We make every effort to display product images and colours accurately; however, actual colours may vary depending on your device or monitor.",
    ],
  },
  {
    title: "4. Pricing",
    before: [
      "All prices displayed on our website are subject to change without notice.",
      "If an incorrect price is displayed due to an error, we reserve the right to cancel the order and provide a full refund where applicable.",
    ],
  },
  {
    title: "5. Orders",
    before: [
      "We reserve the right to refuse or cancel any order at our sole discretion.",
      "Reasons may include:",
    ],
    items: [
      "Product unavailability",
      "Pricing errors",
      "Payment issues",
      "Suspected fraudulent activity",
      "Violation of these Terms",
    ],
    after: [
      "If an order is cancelled after payment has been received, we will issue a refund where appropriate.",
    ],
  },
  {
    title: "6. Payment",
    before: [
      "Payments are processed securely through trusted third-party payment providers.",
      "By placing an order, you confirm that:",
    ],
    items: [
      "The payment information provided is accurate.",
      "You are authorized to use the selected payment method.",
    ],
    after: ["Never Found does not store your complete payment card details."],
  },
  {
    title: "7. Shipping",
    before: [
      "Shipping times provided on the website are estimates only.",
      "We are not responsible for delays caused by:",
    ],
    items: [
      "Courier services",
      "Customs clearance",
      "Weather conditions",
      "Events beyond our reasonable control",
    ],
    after: [
      "Risk of loss passes to the customer once the order has been delivered to the shipping address provided.",
    ],
  },
  {
    title: "8. Returns and Exchanges",
    before: [
      "Returns and exchanges are governed by our Return Policy.",
      "Please review our Return Policy before making a purchase.",
    ],
  },
  {
    title: "9. Intellectual Property",
    before: ["All content on this website, including but not limited to:"],
    items: [
      "Logos",
      "Product designs",
      "Images",
      "Graphics",
      "Videos",
      "Text",
      "Website design",
      "Branding",
    ],
    after: [
      "is the property of Never Found or its licensors and is protected by applicable intellectual property laws.",
      "No content may be copied, reproduced, distributed, or used without our prior written permission.",
    ],
  },
  {
    title: "10. User Content",
    before: [
      "If you submit reviews, comments, suggestions, photos, or other content to us, you grant Never Found a non-exclusive, worldwide, royalty-free licence to use, reproduce, publish, and display that content for business and promotional purposes.",
      "You confirm that your content:",
    ],
    items: [
      "Does not infringe the rights of others.",
      "Is not unlawful or offensive.",
      "Does not contain malicious software.",
    ],
    after: ["We reserve the right to remove any content at our discretion."],
  },
  {
    title: "11. Third-Party Services",
    before: [
      "Our website may contain links to third-party websites or services.",
      "We are not responsible for:",
    ],
    items: [
      "Their content",
      "Their privacy practices",
      "Their availability",
      "Their products or services",
    ],
    after: ["Accessing third-party websites is at your own risk."],
  },
  {
    title: "12. Accuracy of Information",
    before: [
      "We strive to keep all information on our website accurate and up to date.",
      "However, we do not guarantee that all information, including pricing, descriptions, availability, or specifications, will always be complete, accurate, or current.",
      "We reserve the right to correct errors at any time.",
    ],
  },
  {
    title: "13. Disclaimer",
    before: [
      'This website and all products and services are provided on an "as is" and "as available" basis.',
      "To the fullest extent permitted by law, Never Found disclaims all warranties, whether express or implied, including warranties of:",
    ],
    items: [
      "Merchantability",
      "Fitness for a particular purpose",
      "Non-infringement",
      "Accuracy",
      "Reliability",
    ],
    after: ["We do not guarantee uninterrupted or error-free access to the website."],
  },
  {
    title: "14. Limitation of Liability",
    before: [
      "To the fullest extent permitted by law, Never Found shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from:",
    ],
    items: [
      "Your use of the website",
      "Your inability to access the website",
      "Purchase or use of our products",
      "Loss of profits",
      "Loss of data",
      "Business interruption",
    ],
    after: [
      "Our total liability shall not exceed the amount paid for the product giving rise to the claim.",
    ],
  },
  {
    title: "15. Indemnification",
    before: [
      "You agree to indemnify and hold harmless Never Found, its directors, employees, contractors, affiliates, and partners from any claims, damages, losses, liabilities, or expenses arising from:",
    ],
    items: [
      "Your breach of these Terms",
      "Your misuse of the website",
      "Your violation of applicable laws",
      "Your infringement of another person's rights",
    ],
  },
  {
    title: "16. Privacy",
    before: [
      "Your use of this website is also governed by our Privacy Policy.",
      "By using our website, you consent to the collection and use of your information in accordance with that Privacy Policy.",
    ],
  },
  {
    title: "17. Termination",
    before: [
      "We reserve the right to suspend or terminate your access to the website at any time if we believe you have violated these Terms or applicable laws.",
      "Any provisions intended to survive termination shall remain in effect.",
    ],
  },
  {
    title: "18. Governing Law",
    before: [
      "These Terms shall be governed by and interpreted in accordance with the laws of Sri Lanka, without regard to conflict of law principles.",
      "Any disputes arising from these Terms shall be subject to the exclusive jurisdiction of the courts of Sri Lanka.",
    ],
  },
  {
    title: "19. Changes to These Terms",
    before: [
      "We may update these Terms of Service from time to time.",
      "Any changes will become effective immediately upon publication on this website.",
      "Your continued use of the website after changes are posted constitutes your acceptance of the updated Terms.",
    ],
  },
];

export default async function TermsPage() {
  const legalSettings = resolveLegalPageSettings(await getLegalPageSettings());
  const effectiveDate = formatLegalEffectiveDate(legalSettings.updatedAt);

  return (
    <div className="min-h-screen bg-acid text-ink">
      <Header />
      <StoreArtSurface>
        <div className="w-full px-5 pb-8 pt-32 md:px-8 md:pt-36 xl:px-12">
          <p className="font-sans text-[11px] font-bold uppercase tracking-normal text-rust">
            Terms file
          </p>
          <h1 className="mt-4 font-display text-5xl uppercase leading-none md:text-7xl">
            Terms of Service
          </h1>
          <div className="mt-5 max-w-4xl space-y-4 text-sm font-semibold leading-relaxed text-ink/70">
            <p>
              <strong>Effective Date:</strong> {effectiveDate}
            </p>
            <p>
              Welcome to <strong>{legalSettings.businessName}</strong>{" "}
              (&quot;Never Found&quot;, &quot;we&quot;, &quot;our&quot;, or
              &quot;us&quot;). These Terms of Service govern your access to and use
              of <strong>neverfoundco.com</strong> and any products or services
              offered through our website.
            </p>
            <p>
              By accessing or using this website, you agree to be bound by these
              Terms. If you do not agree with these Terms, please do not use our
              website.
            </p>
          </div>

          <div className="mt-10 max-w-4xl space-y-10 text-sm font-semibold leading-relaxed text-ink/70">
            {termsSections.map((section) => (
              <TermsSection
                businessName={legalSettings.businessName}
                data={section}
                key={section.title}
              />
            ))}

            <section>
              <h2 className="font-display text-2xl uppercase leading-none">
                20. Contact Us
              </h2>
              <div className="mt-4 space-y-4">
                <p>
                  If you have any questions regarding these Terms of Service, please
                  contact us.
                </p>
                <p>
                  <strong>{legalSettings.businessName}</strong>
                </p>
                <p>
                  <strong>Email:</strong>{" "}
                  <EmailValue settings={legalSettings} />
                </p>
                <p>
                  <strong>Phone:</strong> {legalSettings.phoneNumber}
                </p>
                <p>
                  <strong>Address:</strong>
                  <br />
                  <span className="whitespace-pre-line">
                    {legalSettings.businessAddress}
                  </span>
                </p>
              </div>
            </section>
          </div>
        </div>
      </StoreArtSurface>
      <Footer />
    </div>
  );
}

function TermsSection({
  businessName,
  data,
}: {
  businessName: string;
  data: TermsSectionData;
}) {
  return (
    <section>
      <h2 className="font-display text-2xl uppercase leading-none">{data.title}</h2>
      <div className="mt-4 space-y-4">
        {data.before.map((paragraph) => (
          <p key={paragraph}>{replaceBusinessName(paragraph, businessName)}</p>
        ))}
        {data.items ? (
          <ul className="list-disc space-y-2 pl-6">
            {data.items.map((item) => (
              <li key={item}>{replaceBusinessName(item, businessName)}</li>
            ))}
          </ul>
        ) : null}
        {data.after?.map((paragraph) => (
          <p key={paragraph}>{replaceBusinessName(paragraph, businessName)}</p>
        ))}
      </div>
    </section>
  );
}

function replaceBusinessName(value: string, businessName: string) {
  return value.replaceAll("Never Found", businessName);
}

function EmailValue({ settings }: { settings: ResolvedLegalPageSettings }) {
  if (!settings.hasEmailAddress) return settings.emailAddress;

  return (
    <a
      className="font-bold underline underline-offset-4"
      href={`mailto:${settings.emailAddress}`}
    >
      {settings.emailAddress}
    </a>
  );
}

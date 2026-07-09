import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { StoreArtSurface } from "@/components/site/StoreArtSurface";
import {
  formatLegalEffectiveDate,
  getLegalPageSettings,
  resolveLegalPageSettings,
} from "@/lib/db/site-settings";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Never Found collects, uses, and protects customer information.",
};

export const dynamic = "force-dynamic";

export default async function PrivacyPage() {
  const legalSettings = resolveLegalPageSettings(await getLegalPageSettings());
  const effectiveDate = formatLegalEffectiveDate(legalSettings.updatedAt);

  return (
    <div className="min-h-screen bg-acid text-ink">
      <Header />
      <StoreArtSurface>
        <div className="w-full px-5 pb-8 pt-32 md:px-8 md:pt-36 xl:px-12">
          <p className="font-sans text-[11px] font-bold uppercase tracking-normal text-rust">
            Policy file
          </p>
          <h1 className="mt-4 font-display text-5xl uppercase leading-none md:text-7xl">
            Privacy Policy
          </h1>
          <div className="mt-5 max-w-4xl space-y-4 text-sm font-semibold leading-relaxed text-ink/70">
            <p>
              <strong>Effective Date:</strong> {effectiveDate}
            </p>
            <p>
              At {legalSettings.businessName} (&quot;Never Found&quot;, &quot;we&quot;,
              &quot;our&quot;, or &quot;us&quot;), we value your privacy and are
              committed to protecting your personal information. This Privacy Policy
              explains how we collect, use, disclose, and protect your information
              when you visit <strong>neverfoundco.com</strong> or purchase products
              from us.
            </p>
            <p>
              By using our website, you agree to the practices described in this
              Privacy Policy.
            </p>
          </div>

          <div className="mt-10 max-w-4xl space-y-10 text-sm font-semibold leading-relaxed text-ink/70">
            <PrivacySection title="Contact Us">
              <p>
                If you have any questions about this Privacy Policy or how we handle
                your personal information, please contact us.
              </p>
              <p>
                <strong>Email:</strong>{" "}
                <EmailValue settings={legalSettings} />
              </p>
              <p>
                <strong>Address:</strong>
                <br />
                <MultilineValue value={legalSettings.businessAddress} />
              </p>
            </PrivacySection>

            <PrivacySection title="Information We Collect">
              <p>We may collect the following types of personal information.</p>
              <PrivacySubsection title="Personal Information You Provide">
                <p>
                  When you place an order, create an account, subscribe to our
                  newsletter, or contact us, we may collect:
                </p>
                <PrivacyList
                  items={[
                    "Full name",
                    "Email address",
                    "Phone number",
                    "Billing address",
                    "Shipping address",
                    "Payment information (processed securely through our payment providers)",
                    "Order history",
                    "Any information you provide when contacting customer support",
                  ]}
                />
              </PrivacySubsection>
              <PrivacySubsection title="Information Collected Automatically">
                <p>
                  When you visit our website, we may automatically collect certain
                  information, including:
                </p>
                <PrivacyList
                  items={[
                    "IP address",
                    "Browser type",
                    "Device information",
                    "Operating system",
                    "Pages visited",
                    "Time spent on pages",
                    "Referring website",
                    "Search terms used",
                    "Date and time of your visit",
                  ]}
                />
                <p>
                  This information helps us improve website performance, security, and
                  user experience.
                </p>
              </PrivacySubsection>
            </PrivacySection>

            <PrivacySection title="How We Use Your Information">
              <p>We use your personal information to:</p>
              <PrivacyList
                items={[
                  "Process and fulfil your orders",
                  "Process payments securely",
                  "Deliver products",
                  "Communicate regarding your orders",
                  "Respond to customer enquiries",
                  "Improve our website and services",
                  "Detect and prevent fraud",
                  "Comply with legal obligations",
                  "Send promotional emails and marketing communications if you have chosen to receive them",
                ]}
              />
              <p>You may unsubscribe from marketing communications at any time.</p>
            </PrivacySection>

            <PrivacySection title="Payment Information">
              <p>Payments are processed through secure third-party payment providers.</p>
              <p>
                We do not store your complete credit card or payment information on our
                servers.
              </p>
            </PrivacySection>

            <PrivacySection title="Sharing Your Information">
              <p>
                We may share your information with trusted third-party service
                providers who help us operate our business, including:
              </p>
              <PrivacyList
                items={[
                  "Payment processors",
                  "Shipping and courier providers",
                  "Website hosting providers",
                  "Analytics providers",
                  "Marketing service providers",
                ]}
              />
              <p>
                These providers only receive the information necessary to perform their
                services.
              </p>
              <p>
                We may also disclose information if required by law or to protect our
                legal rights.
              </p>
              <p>
                We do <strong>not</strong> sell your personal information to third
                parties.
              </p>
            </PrivacySection>

            <PrivacySection title="Cookies">
              <p>Our website uses cookies and similar technologies to:</p>
              <PrivacyList
                items={[
                  "Keep the website functioning properly",
                  "Remember your preferences",
                  "Improve website performance",
                  "Measure website traffic",
                  "Understand how visitors use our website",
                ]}
              />
              <p>
                You can control or disable cookies through your browser settings.
                Please note that disabling cookies may affect certain website features.
              </p>
            </PrivacySection>

            <PrivacySection title="Analytics">
              <p>
                We may use analytics tools such as Google Analytics or similar services
                to understand how visitors interact with our website.
              </p>
              <p>These services may collect information such as:</p>
              <PrivacyList
                items={[
                  "Pages visited",
                  "Time spent on pages",
                  "Device type",
                  "Browser information",
                  "Approximate location based on IP address",
                ]}
              />
              <p>
                This information is used only to improve our website and customer
                experience.
              </p>
            </PrivacySection>

            <PrivacySection title="Marketing">
              <p>
                If you subscribe to our newsletter or marketing communications, we may
                send you updates about:
              </p>
              <PrivacyList
                items={[
                  "New product releases",
                  "Promotions",
                  "Exclusive offers",
                  "Company news",
                ]}
              />
              <p>
                You may unsubscribe at any time using the unsubscribe link included in
                our emails.
              </p>
            </PrivacySection>

            <PrivacySection title="Data Retention">
              <p>
                We retain your personal information only for as long as necessary to:
              </p>
              <PrivacyList
                items={[
                  "Complete your orders",
                  "Provide customer support",
                  "Meet legal and accounting obligations",
                  "Resolve disputes",
                  "Enforce our agreements",
                ]}
              />
              <p>
                When your information is no longer required, it will be securely
                deleted or anonymized.
              </p>
            </PrivacySection>

            <PrivacySection title="Your Rights">
              <p>
                Depending on your country or region, you may have the right to:
              </p>
              <PrivacyList
                items={[
                  "Access the personal information we hold about you",
                  "Request correction of inaccurate information",
                  "Request deletion of your personal information",
                  "Restrict or object to certain processing",
                  "Withdraw consent where processing is based on consent",
                  "Request a copy of your personal information",
                ]}
              />
              <p>To exercise any of these rights, please contact us at:</p>
              <p>
                <EmailValue settings={legalSettings} />
              </p>
            </PrivacySection>

            <PrivacySection title="Children's Privacy">
              <p>
                Our website is not intended for children under <strong>16 years of
                age</strong>.
              </p>
              <p>
                We do not knowingly collect personal information from children. If you
                believe a child has provided us with personal information, please
                contact us immediately so we can remove it.
              </p>
            </PrivacySection>

            <PrivacySection title="Data Security">
              <p>
                We take appropriate technical and organizational measures to protect
                your personal information against unauthorized access, loss, misuse,
                alteration, or disclosure.
              </p>
              <p>
                While we strive to protect your information, no method of electronic
                transmission or storage is completely secure. Therefore, we cannot
                guarantee absolute security.
              </p>
            </PrivacySection>

            <PrivacySection title="International Data Transfers">
              <p>
                If you access our website from outside the country where our business
                operates, your information may be transferred to and processed in
                other countries where our service providers operate.
              </p>
              <p>
                We take reasonable steps to ensure your information remains protected
                in accordance with applicable privacy laws.
              </p>
            </PrivacySection>

            <PrivacySection title="Third-Party Links">
              <p>Our website may contain links to third-party websites.</p>
              <p>
                We are not responsible for the privacy practices or content of those
                websites. We encourage you to review their privacy policies before
                providing personal information.
              </p>
            </PrivacySection>

            <PrivacySection title="Changes to This Privacy Policy">
              <p>
                We may update this Privacy Policy from time to time to reflect changes
                in our business, legal requirements, or services.
              </p>
              <p>
                The updated version will be posted on this page with the revised
                effective date.
              </p>
            </PrivacySection>

            <PrivacySection title="Contact">
              <p>
                If you have any questions, concerns, or requests regarding this Privacy
                Policy, please contact us.
              </p>
              <p>
                <strong>{legalSettings.businessName}</strong>
              </p>
              <p>
                <strong>Email:</strong>{" "}
                <EmailValue settings={legalSettings} />
              </p>
              <p>
                <strong>Address:</strong>
                <br />
                <MultilineValue value={legalSettings.businessAddress} />
              </p>
            </PrivacySection>
          </div>
        </div>
      </StoreArtSurface>
      <Footer />
    </div>
  );
}

function PrivacySection({
  children,
  title,
}: {
  children: ReactNode;
  title: string;
}) {
  return (
    <section>
      <h2 className="font-display text-2xl uppercase leading-none">{title}</h2>
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  );
}

function PrivacySubsection({
  children,
  title,
}: {
  children: ReactNode;
  title: string;
}) {
  return (
    <section className="mt-6">
      <h3 className="font-display text-xl uppercase leading-none">{title}</h3>
      <div className="mt-3 space-y-4">{children}</div>
    </section>
  );
}

function PrivacyList({ items }: { items: string[] }) {
  return (
    <ul className="list-disc space-y-2 pl-6">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

function EmailValue({
  settings,
}: {
  settings: ReturnType<typeof resolveLegalPageSettings>;
}) {
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

function MultilineValue({ value }: { value: string }) {
  return <span className="whitespace-pre-line">{value}</span>;
}

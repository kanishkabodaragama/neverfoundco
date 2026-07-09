import type { Metadata } from "next";
import type { ReactNode } from "react";
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
  title: "Return Policy",
  description: "Never Found return, exchange, and refund guidance.",
};

export const dynamic = "force-dynamic";

export default async function ReturnsPage() {
  const legalSettings = resolveLegalPageSettings(await getLegalPageSettings());
  const effectiveDate = formatLegalEffectiveDate(legalSettings.updatedAt);

  return (
    <div className="min-h-screen bg-acid text-ink">
      <Header />
      <StoreArtSurface>
      <div className="w-full px-5 pb-8 pt-32 md:px-8 md:pt-36 xl:px-12">
        <p className="font-sans text-[11px] font-bold uppercase tracking-normal text-rust">Return file</p>
        <h1 className="mt-4 font-display text-5xl uppercase leading-none md:text-7xl">
          Return Policy
        </h1>
        <p className="mt-5 text-sm font-semibold leading-relaxed text-ink/70">
          <strong>Effective Date:</strong> {effectiveDate}
        </p>
        <p className="mt-5 max-w-4xl text-sm font-semibold leading-relaxed text-ink/70">
          At {legalSettings.businessName}, we want you to be happy with your purchase.
          If something isn&apos;t right, you may return eligible items within{" "}
          <strong>7 days</strong> of receiving your order.
        </p>
        <div className="mt-10 max-w-4xl space-y-10 text-sm font-semibold leading-relaxed text-ink/70">
          <LegalSection title="Eligibility for Returns">
            <p>To be eligible for a return, your item must:</p>
            <LegalList
              items={[
                "Be unused and unworn.",
                "Be in its original condition.",
                "Have all original tags attached.",
                "Be returned in its original packaging.",
                "Be accompanied by proof of purchase (such as your order confirmation or receipt).",
              ]}
            />
          </LegalSection>

          <LegalSection title="How to Return an Item">
            <p>
              To begin a return, please contact us at{" "}
              <EmailValue settings={legalSettings} /> within 7 days of receiving your
              order.
            </p>
            <p>Once we&apos;ve confirmed your return, please send the item to:</p>
            <p>
              <strong>{legalSettings.businessName}</strong>
              <br />
              <strong className="whitespace-pre-line">
                {legalSettings.returnAddress}
              </strong>
            </p>
            <p>
              Please include your order number with the returned package to help us
              process your return as quickly as possible.
            </p>
            <p>
              Customers are responsible for return shipping costs unless the item
              received is defective, damaged, or incorrect.
            </p>
          </LegalSection>

          <LegalSection title="Damaged, Defective, or Incorrect Items">
            <p>Please inspect your order as soon as it arrives.</p>
            <p>
              If you receive a damaged, defective, or incorrect item, contact us
              immediately at <EmailValue settings={legalSettings} /> with your
              order number and photos of the issue. We will resolve the matter as
              quickly as possible.
            </p>
          </LegalSection>

          <LegalSection title="Non-Returnable Items">
            <p>The following items cannot be returned:</p>
            <LegalList
              items={[
                "Custom or personalized products.",
                "Personal care products.",
                "Perishable goods.",
                "Hazardous materials, flammable liquids, or gases.",
                "Gift cards.",
                "Sale or clearance items.",
              ]}
            />
            <p>
              If you are unsure whether your item is eligible for return, please
              contact us before sending it back.
            </p>
          </LegalSection>

          <LegalSection title="Exchanges">
            <p>
              If you need a different size or would like to exchange an item, please
              contact us within the return period.
            </p>
            <p>
              Exchanges are subject to product availability. If the requested item is
              unavailable, we will discuss the available options with you.
            </p>
          </LegalSection>

          <LegalSection title="European Union Customers">
            <p>
              If your order is delivered within the European Union, you have the
              right to cancel or return your purchase within <strong>14 days</strong>{" "}
              of receiving it, in accordance with applicable consumer protection laws.
            </p>
            <p>
              Returned items must be unused, unworn, in their original packaging,
              include all tags, and be accompanied by proof of purchase.
            </p>
          </LegalSection>

          <LegalSection title="Refund Policy">
            <p>
              We only provide refunds where a product has a confirmed manufacturing
              defect or a significant fault.
            </p>
            <p>
              Refunds are not offered for change-of-mind purchases, incorrect size
              selection, or preference changes. For these situations, we are happy to
              assist with an exchange where applicable.
            </p>
            <p>
              If a refund is approved, it will be processed using the original payment
              method. Processing times may vary depending on your bank or payment
              provider.
            </p>
          </LegalSection>

          <LegalSection title="Contact Us">
            <p>
              If you have any questions about our Return Policy, please contact us:
            </p>
            <p>
              <strong>Email:</strong> <EmailValue settings={legalSettings} />
            </p>
          </LegalSection>
        </div>
      </div>
      </StoreArtSurface>
      <Footer />
    </div>
  );
}

function LegalSection({
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

function LegalList({ items }: { items: string[] }) {
  return (
    <ul className="list-disc space-y-2 pl-6">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
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

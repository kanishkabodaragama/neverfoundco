import { SignupForm } from "@/components/site/SignupForm";

export function ContactSignup() {
  return (
    <section className="bg-[#123f32] px-5 py-8 text-[#ead8bd] md:px-8 lg:px-10 xl:px-12">
      <div className="grid gap-6 md:grid-cols-[1fr_1.25fr]">
        <div>
          <h2 className="text-2xl font-black uppercase">Don&apos;t Miss A Drop</h2>
          <p className="mt-1 text-sm font-bold">
            New drops.
            <br />
            Good times.
            <br />
            No spam.
          </p>
        </div>
        <SignupForm />
      </div>
    </section>
  );
}


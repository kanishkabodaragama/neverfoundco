import { SignupForm } from "@/components/site/SignupForm";

export function AboutSignup() {
  return (
    <section className="bg-[#ead8bd] px-5 py-9 md:px-8 lg:px-10 xl:px-12">
      <div className="grid gap-6 md:grid-cols-[0.7fr_1fr]">
        <div>
          <h2 className="text-2xl font-black uppercase">Don&apos;t Miss A Drop</h2>
          <p className="mt-1 text-sm font-bold">New drops. Good times. No spam.</p>
        </div>
        <div className="bg-[#123f32] p-5 text-[#ead8bd]">
          <SignupForm />
        </div>
      </div>
    </section>
  );
}


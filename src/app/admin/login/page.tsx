import type { Metadata } from "next";
import { LoginForm } from "@/components/admin/login-form";

export const metadata: Metadata = {
  title: "Admin Login",
};

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-[#070B12] px-5 py-12 text-[#F7F1E6]">
      <div className="mx-auto max-w-md space-y-6 border border-[#F7F1E6]/10 bg-[#0B111C] p-6">
        <p className="font-pixel text-2xl font-black leading-none">
          never
          <br />
          found
        </p>
        <div>
          <p className="text-xs font-black uppercase tracking-[0.25em] text-[#B8A8E8]">
            Admin
          </p>
          <h1 className="mt-3 font-mono text-3xl font-black uppercase">
            Login
          </h1>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}

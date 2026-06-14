"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Envelope,
  LockKey,
  ArrowRight,
  ShieldCheck,
  WarningCircle,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import api from "@/lib/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if already logged in
    const userStr = localStorage.getItem("konverpro_user");
    if (userStr && userStr !== "undefined") {
      try {
        const user = JSON.parse(userStr);
        if (user && user.role) {
          router.push(`/${user.role}`);
        }
      } catch (e) {
        localStorage.clear();
      }
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data } = await api.post("/api/auth/login", { email, password });

      if (data.success) {
        localStorage.setItem("konverpro_token", data.data.access_token);
        localStorage.setItem("konverpro_user", JSON.stringify(data.data.user));

        toast.success(`Selamat datang, ${data.data.user.nama_lengkap}!`);
        router.push(`/${data.data.user.role}`);
      } else {
        setError(
          data.message ||
            "Login gagal. Periksa kembali email dan password Anda.",
        );
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Gagal menghubungi server. Pastikan koneksi internet aktif.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-blue-900 font-sans min-h-screen flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 rounded-[2rem] shadow-2xl overflow-hidden min-h-[550px]">
        {/* Left Side: Branding */}
        <div className="bg-blue-900 p-12 text-white flex flex-col justify-between relative overflow-hidden hidden md:flex">
          {/* Decorative circles */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-yellow rounded-full blur-[100px] opacity-10 -mr-24 -mt-24"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-700 rounded-full blur-[100px] opacity-10 -ml-12 -mb-12"></div>

          <div className="relative z-10">
            <div className="w-14 h-14 bg-yellow rounded-2xl flex items-center justify-center mb-8 text-blue-900 shadow-xl">
              <ShieldCheck size={32} weight="bold" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight mb-4">
              KonverPro <span className="text-yellow">UNSIA</span>
            </h1>
            <p className="text-blue-100/70 text-base leading-relaxed font-medium">
              Sistem Konversi Kredit Internal Universitas Siber Asia. Modern,
              Akurat, dan Terintegrasi.
            </p>
          </div>

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10">
              <div className="w-1.5 h-1.5 rounded-full bg-green shadow-[0_0_10px_rgba(22,163,74,0.5)]"></div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-blue-200">
                Akses Internal Terjamin
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="p-10 md:p-14 flex flex-col justify-center bg-white">
          <div className="mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Masuk Sistem
            </h2>
            <p className="text-sm text-gray-500 font-medium">
              Silakan masukkan kredensial akun Anda.
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-2xl text-xs font-bold flex items-center gap-2 mb-8 animate-in fade-in zoom-in duration-300">
              <WarningCircle size={20} weight="bold" />
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase text-gray-400 tracking-wider ml-1">
                Alamat Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-5 py-3.5 pl-12 bg-gray-50 border border-gray-200 rounded-2xl font-semibold text-gray-900 focus:ring-4 focus:ring-blue-900/5 focus:border-blue-900 focus:bg-white outline-none transition-all"
                  placeholder="nama@unsia.ac.id"
                />
                <Envelope
                  size={20}
                  weight="bold"
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase text-gray-400 tracking-wider ml-1">
                Kata Sandi
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-5 py-3.5 pl-12 bg-gray-50 border border-gray-200 rounded-2xl font-semibold text-gray-900 focus:ring-4 focus:ring-blue-900/5 focus:border-blue-900 focus:bg-white outline-none transition-all"
                  placeholder="••••••••"
                />
                <LockKey
                  size={20}
                  weight="bold"
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />
              </div>
            </div>

            <Button
              type="submit"
              isLoading={loading}
              className="w-full py-4 text-sm uppercase tracking-widest shadow-xl shadow-blue-900/20 mt-4 rounded-2xl"
            >
              Masuk Sekarang <ArrowRight size={18} weight="bold" />
            </Button>
          </form>

          <p className="mt-10 text-center text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
            &copy; 2026 Universitas Siber Asia • v4.0.0
          </p>
        </div>
      </div>
    </div>
  );
}

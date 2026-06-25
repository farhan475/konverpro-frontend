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
    const checkSession = async () => {
      try {
        const { data } = await api.get('/api/auth/me');
        if (data.success && data.data?.role) {
          router.push(`/${data.data.role}`);
          return;
        }
      } catch {
        // No active session — stay on login page
      }
    };

    checkSession();
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data } = await api.post("/api/auth/login", { email, password });

      if (data.success) {
        const user = data.data.user;

        if (!user?.role) {
          throw new Error("Respons login dari server tidak lengkap.");
        }

        toast.success(`Selamat datang, ${user.nama_lengkap}!`);
        router.push(`/${user.role}`);
      } else {
        setError(
          data.message ||
            "Login gagal. Periksa kembali email dan password Anda.",
        );
      }
    } catch (err: unknown) {
      const apiMessage = (err as { response?: { data?: { message?: string } }; message?: string }).response?.data?.message;
      const errorMessage = (err as { message?: string }).message;
      setError(
        apiMessage ||
          errorMessage ||
          "Gagal menghubungi server. Pastikan backend Laravel aktif.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main id="main-content" className="bg-blue-900 font-sans min-h-screen flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-sm rounded-2xl shadow-xl overflow-hidden p-8 md:p-10">
        <div className="text-center mb-10">
          <div className="w-12 h-12 bg-yellow rounded-xl flex items-center justify-center mb-4 text-blue-900 shadow-lg mx-auto">
            <ShieldCheck size={28} weight="bold" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            KonverPro
          </h1>
          <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">
            Sistem Konversi UNSIA
          </p>
        </div>

        {error && (
          <div role="alert" className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-[11px] font-bold flex items-center gap-2 mb-8 animate-in fade-in zoom-in duration-300">
            <WarningCircle size={18} weight="bold" />
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-1.5">
            <label htmlFor="email" className="text-[10px] font-bold uppercase text-gray-400 tracking-wider ml-1">
              Alamat Email
            </label>
            <div className="relative">
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 pl-11 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-900 focus:ring-4 focus:ring-blue-900/5 focus:border-blue-900 focus:bg-white outline-none transition-all"
                placeholder="nama@unsia.ac.id"
              />
              <Envelope
                size={18}
                weight="bold"
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="password" className="text-[10px] font-bold uppercase text-gray-400 tracking-wider ml-1">
              Kata Sandi
            </label>
            <div className="relative">
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 pl-11 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-900 focus:ring-4 focus:ring-blue-900/5 focus:border-blue-900 focus:bg-white outline-none transition-all"
                placeholder="********"
              />
              <LockKey
                size={18}
                weight="bold"
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />
            </div>
          </div>

          <Button
            type="submit"
            isLoading={loading}
            className="w-full py-3.5 text-xs font-bold uppercase tracking-widest mt-2 rounded-xl"
          >
            Masuk <ArrowRight size={16} weight="bold" />
          </Button>
        </form>

        <p className="mt-12 text-center text-[9px] font-bold text-gray-600 uppercase tracking-widest">
          &copy; 2026 Universitas Siber Asia
        </p>
      </div>
    </main>
  );
}

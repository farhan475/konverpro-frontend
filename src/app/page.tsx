'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Envelope, 
  LockKey, 
  ArrowRight, 
  Scan,
  WarningCircle
} from '@phosphor-icons/react';
import { cn } from '@/lib/utils';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();\n\n      if (res.ok) {\n        // Save to localStorage\n        localStorage.setItem('konverpro_user', JSON.stringify(data.user));\n        \n        // Redirect based on role\n        const role = data.user?.role || 'akademik';\n        router.push(`/${role.replace('_', '-')}`);
      } else {
        setError(data.message || 'Login gagal. Periksa email dan password Anda.');
      }
    } catch (err) {
      setError('Gagal menghubungi server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#031f37] font-sans min-h-screen flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 rounded-3xl shadow-2xl overflow-hidden min-h-[520px] animate-fadeSlideUp">
        
        {/* Left Side: Branding */}
        <div className="bg-[#031f37] p-10 text-white flex flex-col justify-between relative overflow-hidden hidden md:flex">
          <div className="absolute top-0 right-0 w-72 h-72 bg-[#FDD824] rounded-full blur-3xl opacity-10 -mr-24 -mt-24"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-400 rounded-full blur-3xl opacity-10 -ml-12 -mb-12"></div>
          <div className="relative z-10">
            <div className="w-12 h-12 bg-[#FDD824] rounded-xl flex items-center justify-center mb-6 text-[#031f37] shadow-lg">
              <Scan size={24} weight="bold" />
            </div>
            <h1 className="font-heading text-3xl font-black uppercase tracking-tight mb-2">KonverPro</h1>
            <p className="text-blue-200 text-xs font-medium tracking-widest uppercase mb-6">Enterprise Portal</p>
            <p className="text-sm text-blue-100 leading-relaxed opacity-80">
              Sistem manajemen konversi SKS berbasis AI dengan Role-Based Access Control tingkat tinggi.
            </p>
          </div>
          <div className="relative z-10 mt-8">
            <p className="text-xs font-bold uppercase tracking-widest text-blue-300 text-[9px]">Akses internal pengguna terdaftar</p>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="p-10 flex flex-col justify-center bg-white relative">
          <h2 className="text-2xl font-heading font-bold text-[#031f37] mb-1.5">Selamat Datang</h2>
          <p className="text-sm text-slate-400 mb-6 font-medium">Silakan masuk ke akun workspace Anda.</p>
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-xs font-bold flex items-center gap-2 mb-6 animate-fade-in">
              <WarningCircle size={18} weight="bold" />
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Email</label>
              <div className="relative">
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                  className="w-full px-5 py-3.5 pl-12 bg-slate-50 border border-slate-200 rounded-xl font-bold text-[#031f37] focus:ring-2 focus:ring-blue-200 outline-none transition-colors" 
                  placeholder="Email Anda..."
                />
                <Envelope size={18} weight="bold" className="absolute left-4 top-4 text-slate-400" />
              </div>
            </div>
            
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Kata Sandi</label>
              <div className="relative">
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                  className="w-full px-5 py-3.5 pl-12 bg-slate-50 border border-slate-200 rounded-xl font-bold text-[#031f37] focus:ring-2 focus:ring-blue-200 outline-none transition-colors" 
                  placeholder="••••••••"
                />
                <LockKey size={18} weight="bold" className="absolute left-4 top-4 text-slate-400" />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-3.5 bg-[#031f37] text-white rounded-xl font-black text-sm uppercase shadow-lg hover:bg-black transition flex justify-center items-center gap-2 mt-4 disabled:bg-slate-300"
            >
              {loading ? 'Memproses...' : <>Masuk Sistem <ArrowRight size={18} weight="bold" /></>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

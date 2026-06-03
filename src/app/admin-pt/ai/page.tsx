'use client';

import React, { useState, useEffect } from 'react';
import { 
  Robot, 
  Cpu, 
  Sparkle, 
  ShieldCheck, 
  FloppyDisk, 
  Spinner, 
  ArrowRight,
  Database,
  Lightning,
  TextAa,
  Key
} from '@phosphor-icons/react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const DEFAULT_PROMPT = `Anda adalah AI Assistant KonverPro untuk rekomendasi konversi SKS perguruan tinggi Indonesia.

TUJUAN UTAMA:
1. Membantu Kaprodi memetakan mata kuliah asal ke mata kuliah target.
2. Memberikan rekomendasi konversi yang explainable dan dapat diaudit.

PROSEDUR MATCHING:
- Gunakan semantic match dengan membandingkan deskripsi dan keyword.
- Beri status review_required jika confidence rendah.

FORMAT OUTPUT WAJIB JSON:
{
  "matches": [
    {
      "nama_mk_target": "string",
      "nama_mk_asal": "string",
      "confidence": 0,
      "status": "accepted|review_required",
      "reason": "string"
    }
  ]
}`;

export default function KontrolAI() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total_reference_keywords: 0,
    total_described_courses: 0,
    total_courses: 0
  });

  const [config, setConfig] = useState({
    engine: 'konverpro',
    endpoint: '',
    assistant_id: 'sumopod-konversi-v1',
    api_key: '',
    min_confidence: 85,
    prompt: DEFAULT_PROMPT
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
        const [dashRes, configRes] = await Promise.all([
            fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin-pt/dashboard`),
            fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin-pt/config`)
        ]);
        
        const dashJson = await dashRes.json();
        const configJson = await configRes.json();

        if (dashJson.ai_summary) setStats(dashJson.ai_summary);
        if (configJson.success && configJson.data.ai_config) {
            setConfig({
                ...configJson.data.ai_config,
                prompt: configJson.data.ai_config.prompt || DEFAULT_PROMPT
            });
        }
    } catch (err) {
        toast.error('Gagal memuat konfigurasi.');
    } finally {
        setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin-pt/config`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ai_config: config })
        });
        const json = await res.json();
        if (json.success) {
            toast.success('Konfigurasi AI berhasil disimpan ke database.');
        } else {
            toast.error(json.message || 'Gagal menyimpan konfigurasi.');
        }
    } catch (err) {
        toast.error('Gagal menghubungi server.');
    } finally {
        setSaving(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Spinner className="animate-spin text-blue-600" size={32} /></div>;

  return (
    <div className="space-y-8 pb-20">
      <header className="border-l-4 border-[#FDD824] pl-5">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Sumopod Ready</p>
          <h2 className="font-heading text-2xl lg:text-3xl font-black text-[#031f37] mt-1 uppercase tracking-tight">KONTROL AI</h2>
          <p className="mt-1.5 text-sm text-slate-500 font-medium">Konfigurasi integrasi AI dan kualitas library referensi sistem.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="akd-card p-6 bg-blue-50 border-blue-100">
            <div className="flex items-center gap-3 mb-4">
                <Database size={24} weight="bold" className="text-blue-600" />
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Keyword Aktif</p>
            </div>
            <h4 className="text-3xl font-black text-[#031f37]">{stats.total_reference_keywords}</h4>
            <p className="text-[10px] font-bold text-blue-500 mt-2 uppercase tracking-tight">MK Referensi AI</p>
        </div>
        <div className="akd-card p-6 bg-emerald-50 border-emerald-100">
            <div className="flex items-center gap-3 mb-4">
                <TextAa size={24} weight="bold" className="text-emerald-600" />
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Semantic Ready</p>
            </div>
            <h4 className="text-3xl font-black text-[#031f37]">{stats.total_described_courses} <span className="text-sm text-slate-400 font-bold">/ {stats.total_courses}</span></h4>
            <p className="text-[10px] font-bold text-emerald-600 mt-2 uppercase tracking-tight">MK Berdeskripsi</p>
        </div>
        <div className="akd-card p-6 bg-[#031f37] text-white border-none shadow-xl">
            <div className="flex items-center gap-3 mb-4">
                <Cpu size={24} weight="bold" className="text-yellow-400" />
                <p className="text-[10px] font-black uppercase text-blue-200 tracking-widest">Active Engine</p>
            </div>
            <h4 className="text-3xl font-black text-yellow-400">{config.engine === 'konverpro' ? 'AI-Like' : 'Sumopod'}</h4>
            <p className="text-[10px] font-bold text-blue-200 mt-2 uppercase tracking-tight">{config.engine === 'konverpro' ? 'Matching Internal' : 'Real AI API'}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-6">
            <div className="akd-card p-8">
                <h3 className="font-heading text-lg font-black text-[#031f37] mb-8 flex items-center gap-2 uppercase tracking-tight">
                    <Lightning size={22} weight="bold" className="text-blue-600" /> Konfigurasi Mesin Rekomendasi
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    <button 
                        onClick={() => setConfig({...config, engine: 'konverpro'})}
                        className={cn(
                            "p-5 rounded-3xl border-2 transition-all text-left",
                            config.engine === 'konverpro' ? "bg-blue-50 border-blue-600" : "bg-white border-slate-100 hover:border-slate-200"
                        )}
                    >
                        <p className="font-black text-[#031f37] uppercase text-xs">AI-Like KonverPro</p>
                        <p className="text-[11px] text-slate-500 mt-1 font-medium leading-relaxed">Gunakan algoritma fuzzy matching & semantic library internal KonverPro.</p>
                    </button>
                    <button 
                        onClick={() => setConfig({...config, engine: 'sumopod'})}
                        className={cn(
                            "p-5 rounded-3xl border-2 transition-all text-left",
                            config.engine === 'sumopod' ? "bg-blue-50 border-blue-600" : "bg-white border-slate-100 hover:border-slate-200"
                        )}
                    >
                        <p className="font-black text-[#031f37] uppercase text-xs">Real AI Sumopod</p>
                        <p className="text-[11px] text-slate-500 mt-1 font-medium leading-relaxed">Integrasikan dengan API Sumopod AI untuk pemetaan berbasis LLM.</p>
                    </button>
                </div>

                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1">AI API Key / Token</label>
                            <div className="relative">
                                <input 
                                    type="password" value={config.api_key}
                                    onChange={(e) => setConfig({...config, api_key: e.target.value})}
                                    placeholder="Masukkan API Key (OpenAI/Sumopod)"
                                    className="w-full mt-1.5 p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-[#031f37] outline-none" 
                                />
                                <Key size={18} className="absolute right-4 top-5 text-slate-300" />
                            </div>
                        </div>
                        <div>
                            <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1">Min. Confidence (%)</label>
                            <input 
                                type="number" value={config.min_confidence}
                                onChange={(e) => setConfig({...config, min_confidence: parseInt(e.target.value)})}
                                className="w-full mt-1.5 p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-[#031f37] outline-none" 
                            />
                        </div>
                    </div>

                    {config.engine === 'sumopod' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-top-2 duration-300">
                            <div>
                                <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1">Sumopod Endpoint</label>
                                <input 
                                    type="text" value={config.endpoint}
                                    onChange={(e) => setConfig({...config, endpoint: e.target.value})}
                                    placeholder="https://api.sumopod.ai/v1/..."
                                    className="w-full mt-1.5 p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-[#031f37] outline-none" 
                                />
                            </div>
                            <div>
                                <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1">Assistant ID</label>
                                <input 
                                    type="text" value={config.assistant_id}
                                    onChange={(e) => setConfig({...config, assistant_id: e.target.value})}
                                    className="w-full mt-1.5 p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-[#031f37] outline-none" 
                                />
                            </div>
                        </div>
                    )}

                    <div>
                        <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1">Prompt Prosedural AI</label>
                        <textarea 
                            value={config.prompt}
                            onChange={(e) => setConfig({...config, prompt: e.target.value})}
                            className="w-full mt-1.5 p-5 bg-slate-50 border border-slate-200 rounded-2xl text-[11px] font-mono text-[#031f37] outline-none min-h-[300px] leading-relaxed"
                        />
                    </div>
                </div>

                <div className="flex justify-end pt-8">
                    <button 
                        onClick={handleSave}
                        disabled={saving}
                        className="px-10 py-4 bg-[#031f37] text-white rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-xl hover:bg-black transition transform active:scale-95 disabled:bg-slate-300 flex items-center gap-3"
                    >
                        {saving ? <Spinner className="animate-spin" /> : <><FloppyDisk size={18} weight="bold" className="text-[#FDD824]" /> Simpan Konfigurasi</>}
                    </button>
                </div>
            </div>
        </div>

        <div className="space-y-6">
            <div className="akd-card p-6 bg-gradient-to-br from-indigo-600 to-blue-700 text-white border-none shadow-xl">
                <Sparkle size={32} weight="fill" className="text-yellow-400 mb-4" />
                <h4 className="font-black text-lg uppercase tracking-tight">AI Readiness</h4>
                <p className="text-sm font-medium opacity-80 mt-2 leading-relaxed">Pastikan setiap mata kuliah di kurikulum memiliki deskripsi singkat agar AI dapat memahami materi yang diajarkan.</p>
                <div className="mt-6 p-4 bg-white/10 rounded-2xl border border-white/10">
                    <div className="flex justify-between text-[10px] font-black uppercase mb-2">
                        <span>Progress</span>
                        <span>{stats.total_courses > 0 ? Math.round((stats.total_described_courses / stats.total_courses) * 100) : 0}%</span>
                    </div>
                    <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                        <div 
                            className="h-full bg-yellow-400 transition-all duration-1000" 
                            style={{ width: `${stats.total_courses > 0 ? (stats.total_described_courses / stats.total_courses) * 100 : 0}%` }}
                        ></div>
                    </div>
                </div>
            </div>

            <div className="akd-card p-6">
                <h4 className="text-xs font-black uppercase text-[#031f37] mb-4">Prinsip Matching AI</h4>
                <div className="space-y-4">
                    {[
                        { t: 'Kualitas Data', d: 'AI bekerja maksimal jika deskripsi MK lengkap.' },
                        { t: 'Explainability', d: 'Sistem wajib memberi alasan di setiap match.' },
                        { t: 'Human-in-the-loop', d: 'Kaprodi memiliki kendali penuh atas keputusan AI.' }
                    ].map((item, i) => (
                        <div key={i} className="flex gap-3">
                            <div className="w-6 h-6 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 text-[10px] font-black">{i+1}</div>
                            <div>
                                <p className="text-[11px] font-black uppercase text-slate-700">{item.t}</p>
                                <p className="text-[10px] text-slate-400 font-medium leading-relaxed">{item.d}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}

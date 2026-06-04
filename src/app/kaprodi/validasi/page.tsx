"use client";

import React, { useState, useEffect } from "react";
import {
  ArrowRight,
  ListChecks,
  Clock,
  CheckCircle,
  XCircle,
  FilePdf,
  Tag,
  Checks,
  Spinner,
} from "@phosphor-icons/react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface ValidasiItem {
  id: string;
  nama_lengkap: string;
  asal_kampus: string;
  status: string;
  jalur_masuk: string;
  total_sks_diakui: number;
  id_kampus: number;
  prodi?: {
    nama_prodi: string;
  };
}

export default function ValidasiKonversiKaprodi() {
  const [antrean, setAntrean] = useState<ValidasiItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isBulkProcessing, setIsBulkProcessing] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    setLoading(true);

    const token = localStorage.getItem("token");

    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/kaprodi/validasi`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          setAntrean(res.data);
        } else {
          toast.error(res.message || "Gagal mengambil data validasi.");
        }
        setLoading(false);
      })
      .catch(() => {
        toast.error("Gagal menghubungi server.");
        setLoading(false);
      });
  };

  const getStatusStyle = (status: string) => {
    const s = status.toLowerCase();
    if (s.includes("approved"))
      return "bg-green-100 text-green-700 border-green-200";
    if (s.includes("rejected") || s.includes("revisi"))
      return "bg-red-100 text-red-700 border-red-200";
    if (s.includes("pending") || s.includes("review"))
      return "bg-orange-100 text-orange-700 border-orange-200 animate-pulse";
    return "bg-slate-100 text-slate-600 border-slate-200";
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const toggleSelectAll = () => {
    const pendingIds = antrean
      .filter((i) => i.status === "Pending Kaprodi")
      .map((i) => i.id);
    if (selectedIds.length === pendingIds.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(pendingIds);
    }
  };

  const handleBulkApprove = async () => {
    if (selectedIds.length === 0) return;

    setIsBulkProcessing(true);
    const hash =
      "BULK-ACC-" + Math.random().toString(36).substr(2, 9).toUpperCase();

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/kaprodi/validasi/bulk-process`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ids: selectedIds,
            hash_ba_digital: hash,
          }),
        },
      );
      const json = await res.json();
      if (json.success) {
        toast.success(json.message);
        setSelectedIds([]);
        fetchData();
      } else {
        toast.error(json.message);
      }
    } catch (err) {
      toast.error("Gagal memproses validasi massal.");
    } finally {
      setIsBulkProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <section className="flex flex-col h-[calc(100vh-280px)] min-h-[500px]">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 shrink-0 gap-4">
          <div className="border-l-4 border-[#FDD824] pl-5">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
              Decision Center
            </p>
            <h3 className="font-heading text-xl font-black text-[#031f37] mt-1 uppercase tracking-tight">
              EVALUASI KONVERSI
            </h3>
            <p className="mt-1 text-xs text-slate-400 font-medium">
              Berikan keputusan akhir secara massal atau individual.
            </p>
          </div>

          <div className="flex gap-2">
            {antrean.some((i) => i.status === "Pending Kaprodi") && (
              <button
                onClick={toggleSelectAll}
                className="px-4 py-2.5 bg-slate-100 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition"
              >
                {selectedIds.length > 0
                  ? `Deselect (${selectedIds.length})`
                  : "Pilih Semua Pending"}
              </button>
            )}

            {selectedIds.length > 0 && (
              <button
                onClick={handleBulkApprove}
                disabled={isBulkProcessing}
                className="px-6 py-2.5 bg-[#031f37] text-[#FDD824] rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-blue-950/20 flex items-center gap-2 hover:scale-105 transition transform active:scale-95 disabled:bg-slate-300 disabled:text-slate-500"
              >
                {isBulkProcessing ? (
                  <Spinner className="animate-spin" />
                ) : (
                  <>
                    <Checks size={18} weight="bold" /> Approve Massal
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-4 flex-1 overflow-y-auto no-scrollbar pb-6">
          {loading ? (
            <div className="bg-white rounded-[2rem] border border-slate-100 p-16 text-center shadow-sm">
              <p className="font-black text-[#031f37] uppercase tracking-widest text-xs">
                Memuat antrean validasi...
              </p>
            </div>
          ) : antrean.length === 0 ? (
            <div className="bg-white rounded-[2rem] border-2 border-dashed border-slate-200 p-16 text-center my-auto shadow-sm">
              <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-slate-100">
                <CheckCircle size={40} className="text-slate-300 opacity-50" />
              </div>
              <p className="font-black text-[#031f37] text-lg tracking-tight">
                Tidak ada antrean validasi saat ini.
              </p>
              <p className="text-sm text-slate-400 mt-1">
                Semua berkas telah diproses atau belum ada pendaftar baru.
              </p>
            </div>
          ) : (
            antrean.map((mhs) => (
              <div
                key={mhs.id}
                className={cn(
                  "bg-white rounded-3xl border shadow-sm transition-all duration-300 p-5 flex flex-col lg:flex-row lg:items-center gap-6 shrink-0 group",
                  selectedIds.includes(mhs.id)
                    ? "border-blue-500 ring-2 ring-blue-100"
                    : "border-slate-200 hover:shadow-xl hover:border-blue-200",
                )}
              >
                {/* 0. Checkbox (Only for Pending) */}
                {mhs.status === "Pending Kaprodi" && (
                  <div
                    onClick={() => toggleSelect(mhs.id)}
                    className={cn(
                      "w-8 h-8 rounded-xl border-2 flex items-center justify-center cursor-pointer transition-all shrink-0",
                      selectedIds.includes(mhs.id)
                        ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-600/30"
                        : "bg-slate-50 border-slate-200 text-transparent",
                    )}
                  >
                    <Checks size={16} weight="bold" />
                  </div>
                )}

                {/* 1. Identity */}
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 text-[#031f37] flex items-center justify-center font-black text-lg border border-slate-200 shrink-0 shadow-inner group-hover:scale-110 transition-transform">
                    {mhs.nama_lengkap.substring(0, 1).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-black text-[#031f37] text-sm lg:text-base leading-tight truncate uppercase tracking-tight">
                      {mhs.nama_lengkap}
                    </h3>
                    <p className="text-[10px] text-slate-400 font-bold mt-1 truncate uppercase tracking-widest">
                      ID: {mhs.id} • Asal: {mhs.asal_kampus || "-"}
                    </p>
                  </div>
                </div>

                {/* 2. Academic Data */}
                <div className="flex flex-wrap sm:flex-nowrap items-center gap-6 shrink-0 border-t border-slate-50 lg:border-none pt-4 lg:pt-0 w-full lg:w-auto">
                  <div className="w-32 lg:w-40 min-w-0">
                    <p className="text-[9px] font-black uppercase text-slate-400 mb-1 tracking-widest">
                      Program Studi
                    </p>
                    <p className="font-black text-[#031f37] text-[10px] uppercase truncate">
                      {mhs.prodi?.nama_prodi || "-"}
                    </p>
                    <span
                      className={cn(
                        "mt-1.5 inline-block px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider border",
                        mhs.jalur_masuk === "leads"
                          ? "bg-amber-50 text-amber-600 border-amber-100"
                          : "bg-slate-50 text-slate-500 border-slate-200",
                      )}
                    >
                      {mhs.jalur_masuk === "leads" ? "Leads" : "Walk-In"}
                    </span>
                  </div>

                  <div className="w-20 text-center border-l border-slate-100 pl-6">
                    <p className="text-[9px] font-black uppercase text-slate-400 mb-1 tracking-widest">
                      SKS
                    </p>
                    <p className="font-black text-[#094E8B] text-xl leading-none">
                      {mhs.total_sks_diakui}
                    </p>
                  </div>

                  <div className="w-28 text-center border-l border-slate-100 pl-6">
                    <p className="text-[9px] font-black uppercase text-slate-400 mb-2 tracking-widest">
                      Status
                    </p>
                    <span
                      className={cn(
                        "inline-block px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest border w-full truncate",
                        getStatusStyle(mhs.status),
                      )}
                    >
                      {mhs.status}
                    </span>
                  </div>
                </div>

                {/* 3. Actions */}
                <div className="flex flex-wrap items-center justify-end gap-2 shrink-0 w-full lg:w-auto lg:border-l lg:border-slate-100 lg:pl-6 mt-2 lg:mt-0 pt-4 lg:pt-0 border-t border-slate-50 lg:border-t-0">
                  <Link
                    href={`/kaprodi/validasi/${mhs.id}`}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#031f37] px-5 py-2.5 text-[10px] font-black uppercase text-white shadow-lg shadow-blue-900/20 hover:bg-black transition transform active:scale-95 ml-2"
                  >
                    Keputusan <ArrowRight size={14} weight="bold" />
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}

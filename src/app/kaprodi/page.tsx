import ImportKurikulum from "@/components/kurikulum/ImportKurikulum";

export default function KaprodiDashboard() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Dashboard Kaprodi</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-sm border border-zinc-200">
        <h2 className="text-lg font-semibold mb-4">Import Kurikulum Mata Kuliah</h2>
        <p className="text-sm text-zinc-600 mb-4">
          Silakan unggah file Excel kurikulum untuk pemetaan SKS.
        </p>
        <ImportKurikulum id_prodi={1} />
      </div>
    </div>
  );
}

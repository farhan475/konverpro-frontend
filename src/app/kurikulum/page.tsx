import ImportKurikulum from "@/components/kurikulum/ImportKurikulum";
import TabelKurikulum from "@/components/kurikulum/TabelKurikulum";

export default function KurikulumDashboard() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Dashboard Kurikulum</h1>
      <div className="bg-white p-6 rounded-lg shadow-sm border border-zinc-200 mb-8">
        <h2 className="text-lg font-semibold mb-4">Import Kurikulum</h2>
        <ImportKurikulum id_prodi={1} />
      </div>
      <div className="bg-white p-6 rounded-lg shadow-sm border border-zinc-200">
        <h2 className="text-lg font-semibold mb-4">Daftar Mata Kuliah</h2>
        <TabelKurikulum />
      </div>
    </div>
  );
}

import ScannerAkademik from "@/components/akademik/ScannerAkademik";

export default function AkademikDashboard() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Dashboard Akademik</h1>
      <div className="bg-white p-6 rounded-lg shadow-sm border border-zinc-200">
        <ScannerAkademik />
      </div>
    </div>
  );
}

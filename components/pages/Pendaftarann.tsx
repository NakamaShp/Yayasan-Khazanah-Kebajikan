import { supabase } from "@/lib/supabase";
import Image from "next/image";

export default async function Pendaftaran() {
  const { data: pendaftaran, error } = await supabase
    .from("pendaftaran")
    .select("*");

  console.log("Data:", pendaftaran);
  console.log("Error:", error);

  if (error) {
    console.error("Error:", error);
    return <p className="text-red-500">Gagal mengambil data</p>;
  }

  return (
    <main className="p-6 px-8">
      <h1 className="text-2xl font-bold mb-6 px-8">Data Pendaftar</h1>

      {pendaftaran && pendaftaran.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-8">
          {pendaftaran.map((item) => (
            <div
              key={item.nisn}
              className="border rounded-xl p-4 shadow hover:shadow-lg transition"
            >
              <div className="flex flex-col items-center">
                {item.foto ? (
                  <Image
                    src={item.foto}
                    alt={item.name}
                    width={100}
                    height={100}
                    className="rounded-full object-cover"
                  />
                ) : (
                  <div className="w-[100px] h-[100px] bg-gray-200 rounded-full" />
                )}
                <h2 className="text-lg font-semibold mt-3">{item.name}</h2>
                <p className="text-gray-600">NISN: {item.nisn}</p>
                <p className="text-gray-500">{item.asal_sekolah}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>Tidak ada data pendaftar.</p>
      )}
    </main>
  );
}

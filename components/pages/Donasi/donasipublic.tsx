"use client";

import React, { useState, useEffect } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Share2, Copy, ArrowLeft, Trash2 } from "lucide-react"; // Tambah icon Trash
import { toast } from "sonner";

const BANK_DETAILS = {
  nama: "BSI (Bank Syariah Indonesia)",
  rek: "7123456789",
  an: "YAYASAN KHAZANAH",
};
const WA_ADMIN = "6281234567890";

export default function HalamanDonasi() {
  const supabase = createSupabaseBrowserClient();

  const [step, setStep] = useState<"FORM" | "PAYMENT">("FORM");
  const [loading, setLoading] = useState(false);
  const [checkingStorage, setCheckingStorage] = useState(true); // State untuk loading awal

  // Data Form
  const [nominal, setNominal] = useState("");
  const [nama, setNama] = useState("");
  const [doa, setDoa] = useState("");
  const [wa, setWa] = useState("");
  const [method, setMethod] = useState<"QRIS" | "BANK_TRANSFER">(
    "BANK_TRANSFER"
  );
  const [donationId, setDonationId] = useState("");

  const formatRupiah = (val: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(val);

  // ---------------------------------------------------------
  // 1. LOGIKA CEK DRAFT DONASI (Saat halaman dimuat)
  // ---------------------------------------------------------
  useEffect(() => {
    const checkLastDonation = async () => {
      // Ambil ID dari penyimpanan browser
      const savedId = localStorage.getItem("last_donation_id");

      if (savedId) {
        // Jika ada ID, cek ke database Supabase
        const { data, error } = await supabase
          .from("donasi")
          .select("*")
          .eq("id", savedId)
          .single();

        // Jika data ditemukan dan statusnya belum lunas (misal masih PENDING)
        if (data && !error) {
          setDonationId(data.id);
          setNama(data.nama_lengkap);
          setNominal(data.nominal.toString());
          setDoa(data.doa_pesan || "");
          setWa(data.no_wa || "");
          setMethod(data.metode_pembayaran as never);

          // Langsung loncat ke halaman pembayaran
          setStep("PAYMENT");
          toast.info("Melanjutkan sesi donasi terakhir Anda.");
        } else {
          // Jika error atau data tidak ada (sudah dihapus), bersihkan storage
          localStorage.removeItem("last_donation_id");
        }
      }
      setCheckingStorage(false);
    };

    checkLastDonation();
  }, []);

  // ---------------------------------------------------------
  // 2. HANDLE SUBMIT (Simpan ke Storage)
  // ---------------------------------------------------------
  const handleSubmit = async () => {
    const amount = parseInt(nominal.replace(/\./g, ""));
    if (!amount || amount < 1000) return toast.error("Minimal donasi Rp 1.000");
    if (!nama) return toast.error("Nama wajib diisi");

    setLoading(true);

    const { data, error } = await supabase
      .from("donasi")
      .insert({
        nama_lengkap: nama,
        nominal: amount,
        doa_pesan: doa,
        no_wa: wa,
        metode_pembayaran: method,
        status: "PENDING",
      })
      .select("id")
      .single();

    setLoading(false);

    if (error) {
      console.error(error);
      toast.error("Gagal: " + error.message);
    } else {
      setDonationId(data.id);

      // === SIMPAN ID KE STORAGE ===
      localStorage.setItem("last_donation_id", data.id);

      setStep("PAYMENT");
      toast.success("Data tersimpan, silakan transfer");
    }
  };

  // ---------------------------------------------------------
  // 3. RESET / BUAT BARU (Hapus Storage)
  // ---------------------------------------------------------
  const handleBuatBaru = () => {
    localStorage.removeItem("last_donation_id");
    setDonationId("");
    setNominal("");
    setNama("");
    setDoa("");
    setWa("");
    setStep("FORM");
    toast.success("Formulir di-reset.");
  };

  const handleKonfirmasi = () => {
    const amount = parseInt(nominal.replace(/\./g, ""));
    const text = `Assalamualaikum Admin, saya sudah transfer.\n\nID: ${donationId.slice(
      0,
      8
    )}\nNama: ${nama}\nNominal: ${formatRupiah(amount)}\nVia: Transfer Bank`;
    window.open(
      `https://wa.me/${WA_ADMIN}?text=${encodeURIComponent(text)}`,
      "_blank"
    );
  };

  // Loading state awal agar tidak kedip
  if (checkingStorage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        Memuat...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-20 px-3 sm:px-4 flex justify-center">
      <Card className="w-full max-w-lg border-none shadow-xl h-fit">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Formulir Infaq</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {step === "FORM" ? (
            <>
              {/* --- FORM INPUT SAMA SEPERTI SEBELUMNYA --- */}
              <div className="space-y-2">
                <Label>Nominal (Rp)</Label>
                <Input
                  type="number"
                  placeholder="Contoh: 50000"
                  value={nominal}
                  onChange={(e) => setNominal(e.target.value)}
                  className="text-lg font-semibold"
                />
                <div className="flex gap-2 justify-center flex-wrap px-2">
                  {[10000, 50000, 100000].map((v) => (
                    <Button
                      key={v}
                      variant="outline"
                      size="sm"
                      onClick={() => setNominal(v.toString())}
                    >
                      {formatRupiah(v).replace(",00", "")}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Nama Lengkap</Label>
                <Input
                  placeholder="Hamba Allah"
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>No WhatsApp (Opsional)</Label>
                <Input
                  placeholder="08..."
                  value={wa}
                  onChange={(e) => setWa(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Doa (Opsional)</Label>
                <Textarea
                  placeholder="Doa..."
                  value={doa}
                  onChange={(e) => setDoa(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Metode Pembayaran</Label>
                <Tabs
                  value={method}
                  onValueChange={(v) => {
                    if (v === "QRIS") return;
                    setMethod(v as "BANK_TRANSFER");
                  }}
                  className="w-full"
                >
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger
                      value="QRIS"
                      disabled
                      className="opacity-60 cursor-not-allowed"
                    >
                      QRIS (Coming Soon)
                    </TabsTrigger>
                    <TabsTrigger value="BANK_TRANSFER">
                      Transfer Bank
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              <Button
                className="w-full mt-4"
                size="lg"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? "Memproses..." : "Lanjut Pembayaran"}
              </Button>
            </>
          ) : (
            <div className="text-center space-y-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Total Tagihan</p>
                <p className="text-3xl font-bold text-blue-700">
                  {formatRupiah(parseInt(nominal))}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  ID: {donationId.slice(0, 8)}
                </p>
              </div>

              <div className="text-left bg-gray-100 p-4 rounded-lg space-y-2 border border-gray-200">
                <p className="font-bold text-gray-700">{BANK_DETAILS.nama}</p>
                <div className="flex justify-between items-center bg-white p-3 rounded border border-gray-200">
                  <p className="text-xl font-mono font-semibold text-gray-800">
                    {BANK_DETAILS.rek}
                  </p>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => {
                      navigator.clipboard.writeText(BANK_DETAILS.rek);
                      toast.success("No Rekening disalin!");
                    }}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-sm text-gray-600">A.n {BANK_DETAILS.an}</p>
              </div>

              <div className="space-y-2">
                <Button
                  className="w-full bg-green-600 hover:bg-green-700"
                  size="lg"
                  onClick={handleKonfirmasi}
                >
                  <Share2 className="mr-2 w-4 h-4" /> Konfirmasi WhatsApp
                </Button>

                {/* Tombol "Batal / Buat Baru" untuk menghapus session storage */}
                <Button
                  variant="ghost"
                  className="w-full text-red-500 hover:text-red-600 hover:bg-red-50"
                  onClick={handleBuatBaru}
                >
                  <Trash2 className="mr-2 w-4 h-4" /> Batalkan & Buat Baru
                </Button>

                {/* Jika tombol kembali biasa hanya back ke form tanpa hapus data, opsional */}
                {/* <Button variant="ghost" className="w-full" onClick={() => setStep("FORM")}>
                  <ArrowLeft className="mr-2 w-4 h-4" /> Edit Data
                </Button> */}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

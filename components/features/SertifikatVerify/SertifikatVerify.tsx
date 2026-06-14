"use client";

import { useContext, useState } from "react";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Spinner } from "@heroui/spinner";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { FaArrowLeftLong } from "react-icons/fa6";
import { FaCertificate, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

import { sertifikatVerifyServices } from "@/services/sertifikatVerify.service";
import { ToasterContext } from "@/context/ToasterContext";
import errorHandling from "@/utils/errrorHandling";

const SertifikatVerify = () => {
  const { setToaster } = useContext(ToasterContext);
  const [nomorSertifikat, setNomorSertifikat] = useState("");
  const [verificationResult, setVerificationResult] = useState<any>(null);

  const {
    mutate: mutateVerify,
    isPending: isPendingVerify,
    isError,
    error,
  } = useMutation({
    mutationFn: (nomor: string) =>
      sertifikatVerifyServices.verifySertifikat({ nomorSertifikat: nomor }),
    onSuccess: (response) => {
      setVerificationResult(response.data.data);
    },
    onError: (error) => {
      const message = errorHandling(error);
      setVerificationResult(null);
      setToaster({
        title: "Gagal",
        type: "error",
        message: message || "Terjadi kesalahan",
      });
    },
  });

  const handleVerify = () => {
    if (nomorSertifikat.trim()) {
      mutateVerify(nomorSertifikat.trim());
    }
  };

  const handleReset = () => {
    setNomorSertifikat("");
    setVerificationResult(null);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const detailItems: { label: string; value: string }[] = verificationResult
    ? [
        { label: "Nama Peserta", value: verificationResult.namaLengkap },
        { label: "Email", value: verificationResult.email },
        { label: "No. HP", value: verificationResult.noHp },
        { label: "Training", value: verificationResult.training },
        { label: "Batch", value: verificationResult.batch },
        { label: "Materi", value: verificationResult.materi },
        {
          label: "Instansi",
          value: verificationResult.instansi || "-",
        },
        {
          label: "Tanggal Terbit",
          value: formatDate(verificationResult.tanggalTerbit),
        },
      ]
    : [];

  return (
    <section className="w-full max-w-4xl mx-auto px-4 z-10">
      <div className="mb-6">
        <div className="flex text-sm flex-row border-1 items-center border-brand justify-center rounded-2xl my-5 w-fit hover:bg-brand/10">
          <Link
            className="flex flex-row items-center gap-2 py-2 px-4 group"
            href={`/`}
          >
            <FaArrowLeftLong className="text-brand transition-transform duration-300 group-hover:-translate-x-1" />
            <p className="text-brand font-medium transition-transform duration-300 group-hover:scale-105">
              Kembali Ke -{" "}
              <span className="text-white bg-brand rounded-xl p-1.5 inline-block transition-transform duration-300 group-hover:scale-105">
                Beranda
              </span>
            </p>
          </Link>
        </div>
        <h1 className="text-3xl font-bold text-brand mb-2">Cek Sertifikat</h1>
        <p>Masukkan nomor sertifikat untuk memverifikasi keasliannya</p>
      </div>

      <div className="flex flex-col items-start gap-y-4 lg:flex-row lg:items-center lg:justify-between mb-6">
        <div className="flex flex-col lg:flex-row gap-4 w-full sm:w-auto">
          <Input
            className="max-w-64 lg:max-w-80"
            placeholder="Masukkan nomor sertifikat"
            value={nomorSertifikat}
            onChange={(e) => setNomorSertifikat(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleVerify();
              }
            }}
          />
        </div>

        <div className="flex flex-col lg:flex-row gap-2 items-center w-full sm:w-auto">
          <Button
            className="bg-brand text-white"
            isDisabled={isPendingVerify || !nomorSertifikat.trim()}
            onPress={handleVerify}
          >
            {isPendingVerify ? (
              <Spinner color="white" size="sm" />
            ) : (
              "Verifikasi"
            )}
          </Button>
          {(verificationResult || isError) && (
            <Button color="default" variant="bordered" onPress={handleReset}>
              Reset
            </Button>
          )}
        </div>
      </div>

      {/* Before Verification - Empty State */}
      {!isPendingVerify && !verificationResult && !isError && (
        <Card className="w-full shadow-sm border-2 border-dashed border-gray-300">
          <CardBody className="flex flex-col items-center justify-center py-20">
            <FaCertificate className="text-gray-200" size={72} />
            <p className="text-gray-400 mt-6 text-center text-lg">
              Silakan masukkan nomor sertifikat
            </p>
            <p className="text-gray-400 text-sm">
              untuk memverifikasi keasliannya
            </p>
          </CardBody>
        </Card>
      )}

      {/* Loading State */}
      {isPendingVerify && (
        <Card className="w-full shadow-sm">
          <CardBody className="flex items-center justify-center py-20">
            <Spinner color="primary" size="lg" />
            <p className="text-gray-500 mt-4">Memverifikasi sertifikat...</p>
          </CardBody>
        </Card>
      )}

      {/* Error State */}
      {isError && !isPendingVerify && (
        <Card className="w-full shadow-sm border-2 border-red-400">
          <CardHeader className="bg-red-50 flex items-center gap-3 px-6 py-5">
            <FaTimesCircle className="text-red-600 flex-shrink-0" size={28} />
            <h3 className="text-xl font-bold text-red-800">
              Sertifikat Tidak Valid
            </h3>
          </CardHeader>
          <CardBody className="px-6 py-5">
            <p className="text-gray-700">
              {errorHandling(error) || "Nomor sertifikat tidak ditemukan. Pastikan nomor yang Anda masukkan benar."}
            </p>
          </CardBody>
        </Card>
      )}

      {/* Success State */}
      {verificationResult && !isPendingVerify && (
        <Card className="w-full shadow-sm border-2 border-green-400">
          <CardHeader className="bg-green-50 flex items-center gap-3 px-6 py-5">
            <FaCheckCircle className="text-green-600 flex-shrink-0" size={28} />
            <div className="flex-1">
              <h3 className="text-xl font-bold text-green-800">
                Sertifikat Valid
              </h3>
            </div>
            <Chip color="success" size="sm" variant="flat">
              VALID
            </Chip>
          </CardHeader>

          <CardBody className="px-6 py-6">
            <div className="mb-6 pb-6 border-b border-gray-100">
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">
                Nomor Sertifikat
              </p>
              <p className="text-lg font-bold text-gray-900 break-all">
                {verificationResult.nomorSertifikat}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
              {detailItems.map((item) => (
                <div key={item.label}>
                  <p className="text-xs text-gray-400 uppercase tracking-wider">
                    {item.label}
                  </p>
                  <p className="text-base font-semibold text-gray-800 mt-0.5">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      )}
    </section>
  );
};

export default SertifikatVerify;

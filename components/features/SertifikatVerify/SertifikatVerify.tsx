"use client";

import { useState } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Spinner } from "@heroui/spinner";
import { useMutation } from "@tanstack/react-query";
import { FaCertificate, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

import { sertifikatVerifyServices } from "@/services/sertifikatVerify.service";

const SertifikatVerify = () => {
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
      setVerificationResult(response.data);
    },
    onError: () => {
      setVerificationResult(null);
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

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-2xl shadow-2xl">
        <CardHeader className="flex flex-col items-center gap-3 bg-brand text-white p-8">
          <FaCertificate size={64} />
          <div className="text-center">
            <h1 className="text-3xl font-bold">Verifikasi E-Sertifikat</h1>
            <p className="text-sm mt-2 opacity-90">
              Masukkan nomor sertifikat untuk memverifikasi keasliannya
            </p>
          </div>
        </CardHeader>

        <CardBody className="p-8">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4">
              <Input
                label="Nomor Sertifikat"
                placeholder="Masukkan nomor sertifikat"
                size="lg"
                value={nomorSertifikat}
                variant="bordered"
                onChange={(e) => setNomorSertifikat(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleVerify();
                  }
                }}
              />

              <div className="flex gap-3">
                <Button
                  className="flex-1 bg-brand text-white font-semibold"
                  disabled={isPendingVerify || !nomorSertifikat.trim()}
                  size="lg"
                  onPress={handleVerify}
                >
                  {isPendingVerify ? (
                    <Spinner color="white" size="sm" />
                  ) : (
                    "Verifikasi"
                  )}
                </Button>
                {(verificationResult || isError) && (
                  <Button
                    className="font-semibold"
                    color="default"
                    size="lg"
                    variant="bordered"
                    onPress={handleReset}
                  >
                    Reset
                  </Button>
                )}
              </div>
            </div>

            {verificationResult && (
              <Card className="bg-green-50 border-2 border-green-500">
                <CardBody className="p-6">
                  <div className="flex items-start gap-4">
                    <FaCheckCircle
                      className="text-green-600 flex-shrink-0"
                      size={32}
                    />
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-green-800 mb-4">
                        Sertifikat Valid
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600 font-medium">
                            Nama Peserta
                          </p>
                          <p className="text-base font-semibold text-gray-800">
                            {verificationResult.peserta?.nama || "-"}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 font-medium">
                            Nama Training
                          </p>
                          <p className="text-base font-semibold text-gray-800">
                            {verificationResult.jadwalTraining?.training
                              ?.namaTraining || "-"}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 font-medium">
                            Batch
                          </p>
                          <p className="text-base font-semibold text-gray-800">
                            BATCH-
                            {verificationResult.jadwalTraining?.batch || "-"}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 font-medium">
                            Nilai Akhir
                          </p>
                          <p className="text-base font-semibold text-gray-800">
                            {verificationResult.nilaiAkhir || "-"}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 font-medium">
                            Tanggal Terbit
                          </p>
                          <p className="text-base font-semibold text-gray-800">
                            {verificationResult.tanggalTerbit
                              ? new Date(
                                  verificationResult.tanggalTerbit,
                                ).toLocaleDateString("id-ID")
                              : "-"}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 font-medium">
                            Status
                          </p>
                          <p className="text-base font-semibold text-green-600">
                            {verificationResult.status || "-"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            )}

            {isError && (
              <Card className="bg-red-50 border-2 border-red-500">
                <CardBody className="p-6">
                  <div className="flex items-start gap-4">
                    <FaTimesCircle
                      className="text-red-600 flex-shrink-0"
                      size={32}
                    />
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-red-800 mb-2">
                        Sertifikat Tidak Valid
                      </h3>
                      <p className="text-gray-700">
                        {error instanceof Error
                          ? error.message
                          : "Nomor sertifikat tidak ditemukan atau tidak valid. Pastikan nomor yang Anda masukkan benar."}
                      </p>
                    </div>
                  </div>
                </CardBody>
              </Card>
            )}
          </div>
        </CardBody>
      </Card>
    </section>
  );
};

export default SertifikatVerify;

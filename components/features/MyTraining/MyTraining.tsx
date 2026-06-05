"use client";

import { useEffect, useState } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Button } from "@heroui/button";
import { useRouter } from "next/navigation";
import { IoArrowBack } from "react-icons/io5";

import { myTrainingServices } from "@/services/myTraining.service";

interface IMyTraining {
  id: string;
  namaTraining: string;
  tanggalMulai: string;
  tanggalSelesai: string;
  lokasi: string;
  status: string;
}

interface MyTrainingProps {
  isGridUI?: boolean;
}

const MyTraining = ({ isGridUI = false }: MyTrainingProps) => {
  const router = useRouter();
  const [trainings, setTrainings] = useState<IMyTraining[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyTraining();
  }, []);

  const fetchMyTraining = async () => {
    try {
      setLoading(true);
      const response = await myTrainingServices.getMyTraining();

      setTrainings(response.data?.data || []);
    } catch (error) {
      console.error("Error fetching my training:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetail = (jadwalTrainingId: string) => {
    router.push(`/my-training/${jadwalTrainingId}/detail`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className={`w-full ${isGridUI ? "max-w-7xl mx-auto px-4" : ""}`}>
      {isGridUI && (
        <div className="mb-6">
          <Button
            className="bg-brand-500 text-white"
            startContent={<IoArrowBack />}
            onPress={() => router.push("/")}
          >
            Kembali
          </Button>
        </div>
      )}

      <div className="mb-6">
        <h1 className="text-3xl font-bold">Training Saya</h1>
        <p className="text-gray-600 mt-2">Daftar training yang Anda ikuti</p>
      </div>

      {trainings.length === 0 ? (
        <Card>
          <CardBody>
            <p className="text-center text-gray-500">Belum ada training</p>
          </CardBody>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {trainings.map((training) => (
            <Card
              key={training.id}
              className="hover:shadow-lg transition-shadow"
            >
              <CardHeader className="flex flex-col items-start gap-2">
                <h3 className="text-lg font-semibold">
                  {training.namaTraining}
                </h3>
                <Chip
                  color={training.status === "active" ? "success" : "default"}
                  size="sm"
                >
                  {training.status}
                </Chip>
              </CardHeader>
              <CardBody>
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="font-medium">Tanggal:</span>{" "}
                    {new Date(training.tanggalMulai).toLocaleDateString(
                      "id-ID",
                    )}{" "}
                    -{" "}
                    {new Date(training.tanggalSelesai).toLocaleDateString(
                      "id-ID",
                    )}
                  </p>
                  <p>
                    <span className="font-medium">Lokasi:</span>{" "}
                    {training.lokasi}
                  </p>
                </div>
                <Button
                  className="mt-4 w-full"
                  color="primary"
                  size="sm"
                  onPress={() => handleViewDetail(training.id)}
                >
                  Lihat Detail
                </Button>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyTraining;

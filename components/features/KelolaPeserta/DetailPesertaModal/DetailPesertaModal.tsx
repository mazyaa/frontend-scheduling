"use client";

import { Modal, ModalBody, ModalContent, ModalHeader } from "@heroui/modal";
import { format } from "date-fns";

import { IParticipant } from "@/types/participant";

interface PropTypes {
  isOpen: boolean;
  onOpenChange: () => void;
  selectedData: IParticipant | null;
}

const DetailRow = ({
  label,
  value,
}: {
  label: string;
  value?: string | null;
}) => (
  <div className="flex flex-col gap-1">
    <span className="text-xs text-slate-500">{label}</span>
    <span className="text-sm font-medium text-slate-800">{value || "-"}</span>
  </div>
);

const DetailPesertaModal = ({
  isOpen,
  onOpenChange,
  selectedData,
}: PropTypes) => {
  return (
    <Modal
      isOpen={isOpen}
      scrollBehavior="inside"
      size="2xl"
      onOpenChange={onOpenChange}
    >
      <ModalContent>
        {() => (
          <>
            <ModalHeader>
              <div className="flex flex-col gap-1">
                <h2 className="text-lg font-semibold text-slate-800">
                  Detail Peserta
                </h2>
                <p className="text-sm font-normal text-slate-500">
                  Informasi detail mengenai peserta
                </p>
              </div>
            </ModalHeader>

            <ModalBody className="pb-6">
              <div className="grid grid-cols-2 gap-4">
                <DetailRow label="Nama" value={selectedData?.name} />
                <DetailRow label="Email" value={selectedData?.email} />
                <DetailRow label="No WhatsApp" value={selectedData?.noWa} />
                <DetailRow label="Instansi" value={selectedData?.instansi} />
                <DetailRow label="Keahlian" value={selectedData?.keahlian} />

                {/* Additional fields that might be useful */}
                <DetailRow
                  label="Dibuat Pada"
                  value={
                    selectedData?.createdAt
                      ? format(
                          new Date(selectedData.createdAt),
                          "dd MMM yyyy, HH:mm",
                        )
                      : undefined
                  }
                />
              </div>

              {/* Document Section if needed later*/}
              <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col gap-3">
                <h3 className="text-sm font-semibold text-slate-800">
                  Dokumen
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <DetailRow
                    label="File CV"
                    value={selectedData?.fileCv ? "Tersedia" : "Tidak ada"}
                  />
                  <DetailRow
                    label="File Ijazah"
                    value={selectedData?.fileIjazah ? "Tersedia" : "Tidak ada"}
                  />
                  <DetailRow
                    label="Surat Rekomendasi"
                    value={
                      selectedData?.fileSuratRekomendasi
                        ? "Tersedia"
                        : "Tidak ada"
                    }
                  />
                  <DetailRow
                    label="KTP"
                    value={selectedData?.fileKtp ? "Tersedia" : "Tidak ada"}
                  />
                </div>
              </div>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default DetailPesertaModal;

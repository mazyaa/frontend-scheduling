"use client";

import { Controller } from "react-hook-form";
import { useEffect, useRef } from "react";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/modal";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Spinner } from "@heroui/spinner";
import { CiCircleInfo } from "react-icons/ci";

import useEditPesertaModal from "./useEditPesertaModal";

import InputFile from "@/components/ui/InputFile";
import { IParticipant } from "@/types/participant";

interface PropTypes {
  isOpen: boolean;
  onOpenChange: () => void;
  refetchPeserta: () => void;
  selectedData: IParticipant | null;
}

const EditPesertaModal = (props: PropTypes) => {
  const { isOpen, onOpenChange, refetchPeserta, selectedData } = props;
  const onCloseRef = useRef<() => void>();

  const {
    control,
    errors,
    handleSubmitForm,
    handleEditPeserta,
    isPendingMutateEditPeserta,
    isSuccessMutateEditPeserta,
    reset,
    handleUploadFile,
    handleDeleteFile,
    isPendingMutateUploadFile,
    isPendingMutateDeleteFile,
    watchFileCv,
    watchFileIjazah,
    watchFileSuratRekomendasi,
    watchFileKtp,
    watchFileFoto,
    watchFileBuktiBayar,
    watchFileBuktiFollow,
  } = useEditPesertaModal(selectedData);

  useEffect(() => {
    if (isSuccessMutateEditPeserta) {
      refetchPeserta();
      if (onCloseRef.current) {
        onCloseRef.current();
      }
    }
  }, [isSuccessMutateEditPeserta]);

  useEffect(() => {
    if (!isOpen) {
      reset();
    }
  }, [isOpen]);

  return (
    <Modal
      hideCloseButton={isPendingMutateEditPeserta}
      isDismissable={!isPendingMutateEditPeserta}
      isKeyboardDismissDisabled={isPendingMutateEditPeserta}
      isOpen={isOpen}
      scrollBehavior="inside"
      size="2xl"
      onOpenChange={onOpenChange}
    >
      <ModalContent>
        {(onClose) => {
          onCloseRef.current = onClose;

          return (
            <>
              <ModalHeader>
                <div className="flex flex-col gap-1">
                  <h2 className="text-lg font-semibold text-brand">
                    Ubah Peserta
                  </h2>
                  <p className="text-sm font-normal text-brand">
                    Ubah data peserta di bawah ini
                  </p>
                </div>
              </ModalHeader>

              <ModalBody>
                <form className="flex flex-col gap-4">
                  <Controller
                    control={control}
                    name="name"
                    render={({ field }) => (
                      <Input
                        {...field}
                        errorMessage={errors.name?.message}
                        isInvalid={!!errors.name}
                        label="Nama"
                        labelPlacement="outside"
                        placeholder="Nama Peserta"
                        type="text"
                        variant="bordered"
                      />
                    )}
                  />

                  <Controller
                    control={control}
                    name="email"
                    render={({ field }) => (
                      <Input
                        {...field}
                        errorMessage={errors.email?.message}
                        isInvalid={!!errors.email}
                        label="Email"
                        labelPlacement="outside"
                        placeholder="Email Peserta"
                        type="email"
                        variant="bordered"
                      />
                    )}
                  />

                  <Controller
                    control={control}
                    name="noWa"
                    render={({ field }) => (
                      <Input
                        {...field}
                        errorMessage={errors.noWa?.message}
                        isInvalid={!!errors.noWa}
                        label="No WhatsApp"
                        labelPlacement="outside"
                        placeholder="Nomor WhatsApp Peserta"
                        type="text"
                        variant="bordered"
                      />
                    )}
                  />

                  <Controller
                    control={control}
                    name="instansi"
                    render={({ field }) => (
                      <Input
                        {...field}
                        errorMessage={errors.instansi?.message}
                        isInvalid={!!errors.instansi}
                        label="Instansi"
                        labelPlacement="outside"
                        placeholder="Instansi Peserta"
                        type="text"
                        variant="bordered"
                      />
                    )}
                  />

                  {/* File Inputs */}
                  <Controller
                    control={control}
                    name="fileCv"
                    render={({ field: { onChange, ...field } }) => (
                      <InputFile
                        {...field}
                        isDropable
                        errorMessage={errors.fileCv?.message}
                        isDeleting={isPendingMutateDeleteFile}
                        isInvalid={!!errors.fileCv}
                        isUploading={isPendingMutateUploadFile}
                        label={
                          <div className="flex flex-col gap-0.5 mb-1">
                            <div className="flex items-center gap-1 text-[11px] text-gray-500">
                              <CiCircleInfo className="w-3 h-3" />
                              <span>
                                File harus berupa gambar (JPG, PNG, dll)
                              </span>
                            </div>
                            <p className="font-bold text-sm my-2">File CV</p>
                          </div>
                        }
                        preview={
                          typeof watchFileCv === "string" ? watchFileCv : ""
                        }
                        onDelete={() => handleDeleteFile(watchFileCv, onChange)}
                        onUpload={(files) => handleUploadFile(files, onChange)}
                      />
                    )}
                  />

                  <Controller
                    control={control}
                    name="fileIjazah"
                    render={({ field: { onChange, ...field } }) => (
                      <InputFile
                        {...field}
                        isDropable
                        errorMessage={errors.fileIjazah?.message}
                        isDeleting={isPendingMutateDeleteFile}
                        isInvalid={!!errors.fileIjazah}
                        isUploading={isPendingMutateUploadFile}
                        label={
                          <div className="flex flex-col gap-0.5 mb-1">
                            <div className="flex items-center gap-1 text-[11px] text-gray-500">
                              <CiCircleInfo className="w-3 h-3" />
                              <span>
                                File harus berupa gambar (JPG, PNG, dll)
                              </span>
                            </div>
                            <p className="font-bold text-sm my-2">
                              File Ijazah
                            </p>
                          </div>
                        }
                        preview={
                          typeof watchFileIjazah === "string"
                            ? watchFileIjazah
                            : ""
                        }
                        onDelete={() =>
                          handleDeleteFile(watchFileIjazah, onChange)
                        }
                        onUpload={(files) => handleUploadFile(files, onChange)}
                      />
                    )}
                  />

                  <Controller
                    control={control}
                    name="fileSuratRekomendasi"
                    render={({ field: { onChange, ...field } }) => (
                      <InputFile
                        {...field}
                        isDropable
                        errorMessage={errors.fileSuratRekomendasi?.message}
                        isDeleting={isPendingMutateDeleteFile}
                        isInvalid={!!errors.fileSuratRekomendasi}
                        isUploading={isPendingMutateUploadFile}
                        label={
                          <div className="flex flex-col gap-0.5 mb-1">
                            <div className="flex items-center gap-1 text-[11px] text-gray-500">
                              <CiCircleInfo className="w-3 h-3" />
                              <span>
                                File harus berupa gambar (JPG, PNG, dll)
                              </span>
                            </div>
                            <p className="font-bold text-sm my-2">
                              File Surat Rekomendasi
                            </p>
                          </div>
                        }
                        preview={
                          typeof watchFileSuratRekomendasi === "string"
                            ? watchFileSuratRekomendasi
                            : ""
                        }
                        onDelete={() =>
                          handleDeleteFile(watchFileSuratRekomendasi, onChange)
                        }
                        onUpload={(files) => handleUploadFile(files, onChange)}
                      />
                    )}
                  />

                  <Controller
                    control={control}
                    name="fileKtp"
                    render={({ field: { onChange, ...field } }) => (
                      <InputFile
                        {...field}
                        isDropable
                        errorMessage={errors.fileKtp?.message}
                        isDeleting={isPendingMutateDeleteFile}
                        isInvalid={!!errors.fileKtp}
                        isUploading={isPendingMutateUploadFile}
                        label={
                          <div className="flex flex-col gap-0.5 mb-1">
                            <div className="flex items-center gap-1 text-[11px] text-gray-500">
                              <CiCircleInfo className="w-3 h-3" />
                              <span>
                                File harus berupa gambar (JPG, PNG, dll)
                              </span>
                            </div>
                            <p className="font-bold text-sm my-2">File KTP</p>
                          </div>
                        }
                        preview={
                          typeof watchFileKtp === "string" ? watchFileKtp : ""
                        }
                        onDelete={() =>
                          handleDeleteFile(watchFileKtp, onChange)
                        }
                        onUpload={(files) => handleUploadFile(files, onChange)}
                      />
                    )}
                  />

                  <Controller
                    control={control}
                    name="fileFoto"
                    render={({ field: { onChange, ...field } }) => (
                      <InputFile
                        {...field}
                        isDropable
                        errorMessage={errors.fileFoto?.message}
                        isDeleting={isPendingMutateDeleteFile}
                        isInvalid={!!errors.fileFoto}
                        isUploading={isPendingMutateUploadFile}
                        label={
                          <div className="flex flex-col gap-0.5 mb-1">
                            <div className="flex items-center gap-1 text-[11px] text-gray-500">
                              <CiCircleInfo className="w-3 h-3" />
                              <span>
                                File harus berupa gambar (JPG, PNG, dll)
                              </span>
                            </div>
                            <p className="font-bold text-sm my-2">File Foto</p>
                          </div>
                        }
                        preview={
                          typeof watchFileFoto === "string" ? watchFileFoto : ""
                        }
                        onDelete={() =>
                          handleDeleteFile(watchFileFoto, onChange)
                        }
                        onUpload={(files) => handleUploadFile(files, onChange)}
                      />
                    )}
                  />

                  <Controller
                    control={control}
                    name="fileBuktiBayar"
                    render={({ field: { onChange, ...field } }) => (
                      <InputFile
                        {...field}
                        isDropable
                        errorMessage={errors.fileBuktiBayar?.message}
                        isDeleting={isPendingMutateDeleteFile}
                        isInvalid={!!errors.fileBuktiBayar}
                        isUploading={isPendingMutateUploadFile}
                        label={
                          <div className="flex flex-col gap-0.5 mb-1">
                            <div className="flex items-center gap-1 text-[11px] text-gray-500">
                              <CiCircleInfo className="w-3 h-3" />
                              <span>
                                File harus berupa gambar (JPG, PNG, dll)
                              </span>
                            </div>
                            <p className="font-bold text-sm my-2">
                              File Bukti Bayar
                            </p>
                          </div>
                        }
                        preview={
                          typeof watchFileBuktiBayar === "string"
                            ? watchFileBuktiBayar
                            : ""
                        }
                        onDelete={() =>
                          handleDeleteFile(watchFileBuktiBayar, onChange)
                        }
                        onUpload={(files) => handleUploadFile(files, onChange)}
                      />
                    )}
                  />

                  <Controller
                    control={control}
                    name="fileBuktiFollow"
                    render={({ field: { onChange, ...field } }) => (
                      <InputFile
                        {...field}
                        isDropable
                        errorMessage={errors.fileBuktiFollow?.message}
                        isDeleting={isPendingMutateDeleteFile}
                        isInvalid={!!errors.fileBuktiFollow}
                        isUploading={isPendingMutateUploadFile}
                        label={
                          <div className="flex flex-col gap-0.5 mb-1">
                            <div className="flex items-center gap-1 text-[11px] text-gray-500">
                              <CiCircleInfo className="w-3 h-3" />
                              <span>
                                File harus berupa gambar (JPG, PNG, dll)
                              </span>
                            </div>
                            <p className="font-bold text-sm my-2">
                              File Bukti Follow
                            </p>
                          </div>
                        }
                        preview={
                          typeof watchFileBuktiFollow === "string"
                            ? watchFileBuktiFollow
                            : ""
                        }
                        onDelete={() =>
                          handleDeleteFile(watchFileBuktiFollow, onChange)
                        }
                        onUpload={(files) => handleUploadFile(files, onChange)}
                      />
                    )}
                  />
                </form>
              </ModalBody>

              <ModalFooter>
                <Button
                  className="bg-gray-200 hover:bg-gray-300 text-danger"
                  isDisabled={isPendingMutateEditPeserta}
                  variant="light"
                  onPress={onClose}
                >
                  Batal
                </Button>
                <Button
                  className="bg-brand text-white hover:bg-brand/90"
                  isDisabled={isPendingMutateEditPeserta}
                  onPress={() =>
                    void handleSubmitForm((data) =>
                      handleEditPeserta(data as any),
                    )()
                  }
                >
                  {isPendingMutateEditPeserta ? (
                    <Spinner color="white" size="sm" />
                  ) : (
                    "Simpan Perubahan"
                  )}
                </Button>
              </ModalFooter>
            </>
          );
        }}
      </ModalContent>
    </Modal>
  );
};

export default EditPesertaModal;

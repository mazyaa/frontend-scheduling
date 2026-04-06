"use client";

import { useContext } from "react";
import { useMutation } from "@tanstack/react-query";

import { ToasterContext } from "@/context/ToasterContext";
import { uploadServices } from "@/services/upload.service";

const useMediaHandling = () => {
  const { setToaster } = useContext(ToasterContext);

  const uploadFile = async (
    file: File,
    callback: (fileUrl: string) => void,
  ) => {
    const formData = new FormData();

    formData.append("file", file); // append the file to formData with key "file" because in backend we will receive the file with req.file (multer) which means the key must be "file"
    const {
      data: {
        data: { secure_url: image }, // destructuring secure_url from response and rename it to image
      },
    } = await uploadServices.uploadFile(formData);

    callback(image); // pass the fileUrl to the callback function
  };

  const { mutate: mutateUploadFile, isPending: isPendingMutateUploadFile } =
    useMutation({
      mutationFn: (varaibles: {
        file: File;
        callback: (fileUrl: string) => void;
      }) => uploadFile(varaibles.file, varaibles.callback),
      onError: (error) => {
        setToaster({
          title: "Upload Gagal",
          type: "error",
          message:
            error instanceof Error
              ? error.message
              : "Terjadi kesalahan saat mengupload file",
        });
      },
    });

  const deleteFile = async (fileUrl: string, callback: () => void) => {
    const response = await uploadServices.deleteFile({ fileUrl });

    if (response.status === 200) {
      callback();
    }
  };

  const { mutate: mutateDeleteFile, isPending: isPendingMutateDeleteFile } =
    useMutation({
      mutationFn: (variables: { fileUrl: string; callback: () => void }) =>
        deleteFile(variables.fileUrl, variables.callback),
      onError: (error) => {
        setToaster({
          title: "Hapus Gagal",
          type: "error",
          message:
            error instanceof Error
              ? error.message
              : "Terjadi kesalahan saat menghapus file",
        });
      },
    });

  return {
    mutateUploadFile,
    isPendingMutateUploadFile,
    mutateDeleteFile,
    isPendingMutateDeleteFile,
  };
};

export default useMediaHandling;

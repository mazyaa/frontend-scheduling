"use client";

import { Button } from "@heroui/button";
import { Spinner } from "@heroui/spinner";
import { cn } from "@heroui/theme";
import Image from "next/image";
import { ChangeEvent, ReactNode, useEffect, useId, useRef } from "react";
import { CiSaveUp2, CiTrash } from "react-icons/ci";

interface PropTypes {
  className?: string;
  errorMessage?: string;
  isDropable?: boolean;
  isDeleting?: boolean;
  isInvalid?: boolean;
  isUploading?: boolean;
  label: ReactNode;
  name: string;
  onUpload: (files: FileList) => void;
  onDelete: () => void;
  preview?: string;
}

const InputFile = (props: PropTypes) => {
  const {
    className,
    errorMessage,
    isDropable,
    isDeleting,
    isUploading,
    label,
    name,
    onUpload,
    onDelete,
    isInvalid,
    preview,
  } = props;
  const inputRef = useRef<HTMLInputElement | null>(null); // for accesing the input element like getElementById in vanilla js
  const drop = useRef<HTMLLabelElement>(null); // for accesing the label element (drop zone area) like getElementById in vanilla js
  const dropZoneId = useId(); // for creating unique id for the drop zone area

  // for handling preventing default behavior of dragover and drop events
  const handleDragOver = (e: DragEvent) => {
    if (isDropable) {
      // only allow drag over if isDropable is true
      e.preventDefault(); // for preventing default behavior of opening the file in the browser
      e.stopPropagation(); // for preventing event bubbling (event bubbling is the event that propagates up the DOM tree)
    }
  };

  // get file via drag and drop zone
  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer?.files; // get files from the dataTransfer object

    if (files && onUpload) {
      onUpload(files); // set files to function onUpload passed via props
    }
  };

  // add event listeners for dragover and drop events to the label element
  useEffect(() => {
    const dropCurrent = drop.current; // get the current label element

    if (dropCurrent) {
      dropCurrent.addEventListener("dragover", handleDragOver);
      dropCurrent.addEventListener("drop", handleDrop);

      // remove event listeners if the component unmounts/isDropable changes
      return () => {
        dropCurrent.removeEventListener("dragover", handleDragOver);
        dropCurrent.removeEventListener("drop", handleDrop);
      };
    }
  }, []);

  // handle file input change event (for handling file selection via click)
  const handleOnUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;

    if (files && onUpload) {
      // if files exist and onUpload function is provided
      onUpload(files); // set files to function onUpload passed via props
    }
  };

  return (
    <div>
      {label}
      <label
        ref={drop} // reference to the label element for drag and drop events
        className={cn(
          "flex min-h-24 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-100 hover:bg-gray-200",
          className,
          isInvalid && "border-danger-500", // add danger border if isInvalid uploadedImage is true
        )}
        htmlFor={`dropzone-file-${dropZoneId}`}
      >
        {preview && ( // render this component if preview image is available
          <div className="relative flex flex-col items-center justify-center p-5">
            <div className="mb-2 w-1/2">
              <Image fill alt="image" className="!relative" src={preview} />
              <Button
                isIconOnly
                className="absolute right-2 top-2 h-9 w-9 items-center justify-center rounded bg-danger-100"
                disabled={isDeleting}
                onPress={onDelete}
              >
                {isDeleting ? (
                  <Spinner color="danger" size="sm" />
                ) : (
                  <CiTrash className="h-5 w-5 text-danger-500" />
                )}
              </Button>
            </div>
          </div>
        )}

        {!preview &&
          !isUploading && ( // render this component if preview image is not available and isUploading is false
            <div className="flex flex-col items-center justify-center p-5">
              <CiSaveUp2 className="mb-2 h-10 w-10 text-gray-400" />
              <p className="text-center text-[13px] font-semibold text-gray-500">
                {isDropable
                  ? "Drag and drop atau klik untuk mengunggah file di sini"
                  : "Klik untuk mengunggah file"}
              </p>
            </div>
          )}

        {isUploading && (
          <div className="flex flex-col items-center justify-center p-5">
            <Spinner color="danger" size="sm" />
          </div>
        )}

        <input
          ref={inputRef} // set reference to the input element (use ref like getElementById in vanilla js) so inputRef.current === the input element
          accept="image/*"
          className="hidden"
          disabled={preview !== ""}
          id={`dropzone-file-${dropZoneId}`}
          name={name}
          type="file"
          onChange={handleOnUpload}
          onClick={() => {
            if (inputRef.current) inputRef.current.value = ""; // reset the input value to allow uploading the "same file" again
          }}
        />
      </label>
      {isInvalid && (
        <p className="mt-1 text-sm text-danger-500">{errorMessage}</p>
      )}
    </div>
  );
};

export default InputFile;

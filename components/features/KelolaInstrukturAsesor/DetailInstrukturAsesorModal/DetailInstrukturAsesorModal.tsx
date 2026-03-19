"use client";

import { Key, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Modal, ModalBody, ModalContent, ModalHeader } from "@heroui/modal";
import { Skeleton } from "@heroui/skeleton";
import { cn } from "@heroui/theme";

import useDetailInstrukturAsesorModal from "./UseDetailInstrukturAsesor";

interface PropTypes {
  columns: Record<string, unknown>[];
  isOpen: boolean;
  selectedId: string;
  onOpenChange: () => void; // for tracking open state of modal, because when user click cancel button, the state of isOpen will be set to false, but when user click add button, the state of isOpen will be set to true, so we need to track the state of modal open or close
  renderCell: (
    item: Record<string, unknown>,
    columnKey: Key,
  ) => React.ReactNode;
}

const DetailInstrukturAsesorModal = (props: PropTypes) => {
  const { columns, isOpen, selectedId, onOpenChange, renderCell } = props;
  const onCloseRef = useRef<() => void>();

  const { instrukturAsesorDataById, handleOnClose } =
    useDetailInstrukturAsesorModal(selectedId, isOpen);

  useEffect(() => {
    if (onCloseRef.current) {
      handleOnClose(onCloseRef.current);
    }
  }, [instrukturAsesorDataById]);

  return (
    <Modal isOpen={isOpen} placement="center" onOpenChange={onOpenChange}>
      <ModalContent className="m-4">
        {(onClose) => {
          onCloseRef.current = onClose; // set onClose function to ref, so we can call it in useEffect when mutation is success, because onClose function is only available in this scope, so we need to set it to ref to make it available in useEffect scope

          return (
            <>
              <ModalHeader>
                <h3 className="text-medium text-brand font-medium">
                  Detail Instruktur/Asesor
                </h3>
              </ModalHeader>
              <ModalBody className="flex flex-col gap-5 pb-7">
                <Skeleton
                  className="rounded-sm"
                  isLoaded={!!instrukturAsesorDataById} // show skeleton when data is null, and show form when data is not null
                >
                  <div className="grid grid-rows-2 gap-2">
                    {Array.isArray(columns) && instrukturAsesorDataById
                      ? columns
                          .filter(
                            // fillter by isSummary false, and uid not image and uid not aksi
                            (col) =>
                              col.isSummary === false &&
                              col.uid !== "image" &&
                              col.uid !== "aksi",
                          )
                          .map((column, index) => (
                            <motion.div
                              key={column.uid as Key}
                              animate={{ opacity: 1, scale: 1 }}
                              className={cn(
                                "flex flex-col items-center text-center gap-1 p-3 rounded-xl",
                                "bg-default-50 hover:bg-default-100",
                                "border border-default-100 hover:border-brand/20",
                                "transition-all duration-200 group cursor-default",
                              )}
                              initial={{ opacity: 0, scale: 0.95 }}
                              transition={{
                                duration: 0.2,
                                delay: index * 0.05,
                              }}
                            >
                              {/* Label */}
                              <span
                                className={cn(
                                  "text-[13px] font-bold uppercase tracking-[0.12em]",
                                  "text-default-400 group-hover:text-brand",
                                  "transition-colors duration-200",
                                )}
                              >
                                {column.name as string}
                              </span>

                              {/* Value */}
                              <span
                                className={cn(
                                  "text-[13px] font-semibold text-default-800 leading-snug",
                                  "group-hover:text-default-900 transition-colors duration-200",
                                )}
                              >
                                {renderCell(
                                  instrukturAsesorDataById.data,
                                  column.uid as Key,
                                )}
                              </span>
                            </motion.div>
                          ))
                      : null}
                  </div>
                </Skeleton>
              </ModalBody>
            </>
          );
        }}
      </ModalContent>
    </Modal>
  );
};

export default DetailInstrukturAsesorModal;

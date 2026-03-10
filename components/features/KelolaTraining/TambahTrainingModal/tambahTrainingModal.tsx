import { Controller } from "react-hook-form";
import { useEffect } from "react";
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

import useKelolaTrainingModal from "../TambahTrainingModal/useTambahTrainingModal";

interface PropTypes {
  isOpen: boolean;
  onClose: () => void;
  onOpenChange: () => void;
  refetchTraining: () => void;
}

const TambahTrainingModal = (props: PropTypes) => {
  const { isOpen, onClose, onOpenChange, refetchTraining } = props;
  const {
    control,
    errors,
    handleSubmitForm,
    handleAddTraining,
    isPendingMutateAddTraining,
    isSuccessMutateAddTraining,

    handleOnClose,
  } = useKelolaTrainingModal();

  useEffect(() => {
    if (isSuccessMutateAddTraining) {
      handleOnClose(onClose);
      refetchTraining();
    }
  }, [isSuccessMutateAddTraining, refetchTraining, onClose, handleOnClose]);

  const disabledSubmit = isPendingMutateAddTraining;

  return (
    <Modal
      isOpen={isOpen}
      placement="center"
      onClose={() => handleOnClose(onClose)}
      onOpenChange={onOpenChange}
    >
      <form onSubmit={handleSubmitForm(handleAddTraining)}>
        <ModalContent className="m-4">
          <ModalHeader>
            <h3 className="text-lg font-medium">Tambah Training Baru</h3>
          </ModalHeader>

          <ModalBody>
            <Controller
              control={control}
              name="namaTraining"
              render={({ field }) => {
                return (
                  <Input
                    {...field}
                    className="rounded"
                    errorMessage={errors.namaTraining?.message}
                    isInvalid={errors.namaTraining !== undefined}
                    label="Nama Training"
                    variant="bordered"
                  />
                );
              }}
            />

            <Controller
              control={control}
              name="description"
              render={({ field }) => {
                return (
                  <Input
                    {...field}
                    className="rounded"
                    errorMessage={errors.description?.message}
                    isInvalid={errors.description !== undefined}
                    label="Deskripsi"
                    variant="bordered"
                  />
                );
              }}
            />
          </ModalBody>

          <ModalFooter>
            <div className="flex flex-row justify-end gap-3">
              <Button
                className="font-medium text-danger-500"
                disabled={disabledSubmit}
                type="button"
                variant="flat"
                onPress={() => handleOnClose(onClose)}
              >
                Cancel
              </Button>
              <Button
                className="font-medium text-white bg-brand"
                disabled={disabledSubmit}
                type="submit"
              >
                {isPendingMutateAddTraining ? (
                  <Spinner color="white" size="sm" />
                ) : (
                  "Tambah Training"
                )}
              </Button>
            </div>
          </ModalFooter>
        </ModalContent>
      </form>
    </Modal>
  );
};

export default TambahTrainingModal;

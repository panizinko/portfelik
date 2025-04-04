import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useMobileDialog } from "@/hooks/useMobileDialog";
import { type Transaction } from "@/modules/transactions/transaction";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { TransactionForm } from "./TransactionForm";

interface TransactionDialogProps {
  trigger?: React.ReactNode;
  onSubmit?: (transaction: Transaction) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  transaction: Transaction | null;
}

export function TransactionDialog({
  trigger,
  onSubmit,
  open: controlledOpen,
  onOpenChange,
  transaction,
}: TransactionDialogProps) {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();

  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : open;
  const setIsOpen = isControlled ? onOpenChange! : setOpen;

  const { contentRef } = useMobileDialog(isOpen);

  const isEditing = !!transaction?.id;

  const handleSave = (transaction: Transaction) => {
    if (onSubmit) {
      onSubmit(transaction);
      setIsOpen(false);
    }
  };

  const handleCancel = () => {
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent
        ref={contentRef}
        className="w-full max-w-md mx-auto sm:max-w-lg p-4 sm:p-6 overflow-y-auto max-h-[95vh]"
      >
        <DialogHeader>
          <DialogTitle className="text-xl">
            {isEditing
              ? t("transactions.transactionDialog.editTransaction")
              : t("transactions.transactionDialog.addTransaction")}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? t("transactions.transactionDialog.editTransactionDescription")
              : t("transactions.transactionDialog.addTransactionDescription")}
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4">
          <TransactionForm
            onSubmit={handleSave}
            onCancel={handleCancel}
            initialValues={transaction || null}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

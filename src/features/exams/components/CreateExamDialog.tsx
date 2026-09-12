import type {  FormExam } from "../types";
import ExamForm from "./ExamForm";
type Props = {
  open: boolean;
  error: string;
  setClose: (open: boolean) => void;
  confirmCreate: (data: FormExam) => Promise<boolean>;
};

export default function CreateExamDialog({
  open,
  setClose,
  confirmCreate,
  error,
}: Props) {
  return (
    <ExamForm
      action="CREATE"
      open={open}
      setClose={setClose}
      confirm={confirmCreate}
      error={error}
    />
  );
}

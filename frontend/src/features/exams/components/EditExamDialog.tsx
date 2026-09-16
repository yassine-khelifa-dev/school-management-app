import type { ExamType, FormExam } from "../types";
import ExamForm from "./ExamForm";
type Props = {
  exam: ExamType;
  open: boolean;
  error: string;
  setClose: (open: boolean) => void;
  confirmEdit: (data: FormExam) => Promise<boolean>;
};

export default function EditExamDialog({
  exam,
  open,
  setClose,
  confirmEdit,
  error,
}: Props) {
  return (
    <ExamForm
      action="EDIT"
      exam={exam}
      open={open}
      setClose={setClose}
      confirm={confirmEdit}
      error={error}
    />
  );
}

import { api } from "../../../api";
import type {
  FormStudentInputs,
  InputsCreateStudentValues,
  StudentListType,
  StudentQueryType,
  StudentType,
} from "../types";

export async function getStudents(
  query: StudentQueryType,
  signal?: AbortSignal,
): Promise<StudentListType> {
  const res = await api.get("students", {
    params: query,
    signal,
  });
  return res.data;
}

export async function delStudent(student: StudentType, signal?: AbortSignal) {
  const res = await api.delete("students/" + student.id, {
    signal,
  });

  return res.data;
}

export async function updateStudent(student: FormStudentInputs) {
  const [firstName, ...rest] = student.fullname.trim().split(" ");
  const lastName = rest.join(" ");

  const res = await api.patch("students/" + student.id, {
    first_name: firstName,
    last_name: lastName,
    email: student.email,
    phone: student.phone,
  });
  return res.data;
}

export async function createStudent(student: InputsCreateStudentValues) {
  const rep = await api.post("students", student);
  return rep.data;
}

export const delayTestFetachData = (ms: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

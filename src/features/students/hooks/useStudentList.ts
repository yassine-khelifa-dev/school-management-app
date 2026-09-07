import { useEffect, useState } from "react";
import {
  createStudent,
  delStudent,
  getStudents,
  updateStudent,
} from "../services/studentService";
import type {
  FormStudentInputs,
  InputsCreateStudentValues,
  PaginateType,
  StudentQueryType,
  StudentType,
} from "../types";
import useApiError from "../../../hooks/useApiError";

export function useStudentList() {
  const [students, setStudents] = useState<StudentType[]>([]);

  const [paginate, setPaginate] = useState<PaginateType | null>(null);

  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<string | null>(null);
  const { error, clearError, handleError } = useApiError();

  const [query, setQuery] = useState<StudentQueryType>({
    page: 1,
  });

  async function deleteStudent(student: StudentType) {
    console.log("hook:deleteStudnet ", student.email);
    try {
      setLoading(true);
      clearError();

      await delStudent(student);

      const remainingStudents = students.filter((s) => s.id !== student.id);

      if (remainingStudents.length === 0 && paginate?.current_page > 1)
        setQuery((prev) => ({ ...prev, page: paginate.current_page - 1 }));
      else setQuery((prev) => ({ ...prev, page: paginate?.current_page ?? 1 }));

      //console.log(rep);
      return true;
    } catch (err) {
      handleError(err);
      return false;
    } finally {
      setLoading(false);
    }
  }

  async function storeStudent(student: InputsCreateStudentValues) {
    try {
      setLoading(true);
      clearError();
      setMessages(null);

      const rep = await createStudent(student);

      if (rep?.id >= 0) {
        setMessages("Student has been created successfully with ID: " + rep.id);
        setQuery((prev) => ({ ...prev, page: 1 }));
        return true;
      } else {
        console.log("storeStudent: Something went wrong");
        handleError(rep);
        return false;
      }
    } catch (err) {
      console.log(err);
      handleError(err);
      return false;
    } finally {
      setLoading(false);
    }
  }

  async function editStudent(
    newStudent: FormStudentInputs,
    oldStudent: StudentType,
  ) {
    if (newStudent.id !== oldStudent.id) return;
    console.log("hook:deleteStudnet ", oldStudent.email);
    try {
      setLoading(true);
      clearError();
      const rep = await updateStudent(newStudent);

      const [firstName, ...rest] = newStudent.fullname.trim().split(" ");
      const lastName = rest.join(" ");

      setStudents((prev) =>
        prev.map((student) =>
          student.id === newStudent.id
            ? {
                ...student,
                id: newStudent.id,
                full_name: newStudent.fullname,
                first_name: firstName,
                last_name: lastName,
                email: newStudent.email,
                phone: newStudent.phone,
              }
            : student,
        ),
      );
      console.log("success: editStudent: ", rep);
      return true;
    } catch (err) {
      handleError(err);
      return false;
    } finally {
      setLoading(false);
      console.log("end -- editStudent");
    }
  }

  useEffect(() => {
    const controller = new AbortController();

    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        clearError();
        const data = await getStudents(query, controller.signal);
        setStudents(data.data);
        setPaginate(data.meta);

        console.log("data", data.data);
      } catch (err) {
        handleError(err);
      } finally {
        setLoading(false);
      }
    }, 500);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  return {
    students,
    storeStudent,
    deleteStudent,
    editStudent,

    query,
    setQuery,

    error,
    messages,

    loading,

    paginate,
  };
}

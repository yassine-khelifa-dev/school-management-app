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
import axios from "axios";

export function useStudentList() {
  const [students, setStudents] = useState<StudentType[]>([]);

  const [paginate, setPaginate] = useState<PaginateType | null>(null);

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<string | null>(null);
  const [messages, setMessages] = useState<string | null>(null);

  const [query, setQuery] = useState<StudentQueryType>({
    page: 1,
  });

  function handleErrorsMessage(err: unknown) {
    if (axios.isCancel(err)) {
      return "request cancelled";
    }
    if (axios.isAxiosError(err)) {
      if (err.response) {
        setErrors(err.response.data?.message || "Backend error");
      } else if (err.request) {
        setErrors("Unable to reach the server");
      } else {
        setErrors("Request error");
      }
    } else {
      setErrors("Something went wrong");
    }
  }

  async function deleteStudent(student: StudentType) {
    console.log("hook:deleteStudnet ", student.email);
    try {
      setLoading(true);
      setErrors(null);
      const rep = await delStudent(student);

      const remainingStudents = students.filter((s) => s.id !== student.id);
      setStudents(remainingStudents);

      if (remainingStudents.length === 0 && paginate?.current_page > 1)
        setQuery({ ...query, page: paginate.current_page - 1 });

      console.log(rep);
      return true;
    } catch (err) {
      handleErrorsMessage(err);
      return false;
    } finally {
      setLoading(false);
    }
  }

  async function storeStudent(student: InputsCreateStudentValues) {
    try {
      setLoading(true);
      setErrors(null);
      setMessages(null);

      const rep = await createStudent(student);

      if (rep?.id >= 0) {
        setMessages("Student has been created successfully with ID: " + rep.id);
        setQuery({ ...query, page: 1 });
        return true;
      } else {
        console.log("storeStudent: Something went wrong");
        handleErrorsMessage(rep);
        return false;
      }
    } catch (err) {
      console.log(err);
      handleErrorsMessage(err);
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
      setErrors(null);
      const rep = await updateStudent(newStudent);

      const [firstName, ...rest] = newStudent.fullname.trim().split(" ");
      const lastName = rest.join(" ");

      setStudents((prev) =>
        prev.map((student) =>
          student.id === newStudent.id
            ? {
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
      handleErrorsMessage(err);
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
        setErrors(null);
        const data = await getStudents(query, controller.signal);
        setStudents(data.data);
        setPaginate(data.meta);
      } catch (err) {
        handleErrorsMessage(err);
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

    errors,
    messages,

    loading,

    paginate,
  };
}

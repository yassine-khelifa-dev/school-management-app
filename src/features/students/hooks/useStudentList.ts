import { useEffect, useState } from "react";
import { delStudent, getStudents } from "../services/studentService";
import type { PaginateType, StudentQueryType, StudentType } from "../types";
import axios from "axios";

export function useStudentList() {
  const [students, setStudents] = useState<StudentType[]>([]);

  const [paginate, setPaginate] = useState<PaginateType | null>(null);

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<string | null>(null);

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
    } catch (err) {
      handleErrorsMessage(err);
    } finally {
      setLoading(false);
      console.log("end -- deleteStudnet");
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
    deleteStudent,

    query,
    setQuery,

    errors,

    loading,

    paginate,
  };
}

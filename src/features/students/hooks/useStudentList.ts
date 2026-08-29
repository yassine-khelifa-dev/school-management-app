import { useEffect, useState } from "react";
import {  getStudents } from "../services/studentService";
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

  useEffect(() => {
    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        setErrors(null);
        const data = await getStudents(query);
        setStudents(data.data);
        setPaginate(data.meta);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          const message = err.response?.data?.message || "Something went wrong";

          setErrors(message);
          console.log(message);
        } else {
          setErrors("Something went wrong");
          console.log(err);
        }
      } finally {
        setLoading(false);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [query]);

  return {
    students,

    query,
    setQuery,

    errors,

    loading,

    paginate,
  };
}

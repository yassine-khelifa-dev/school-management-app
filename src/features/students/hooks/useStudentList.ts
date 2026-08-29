import { useEffect, useState } from "react";
import { getStudents } from "../services/studentService";
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
    const controller = new AbortController();

    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        setErrors(null);
        const data = await getStudents(query, controller.signal);
        setStudents(data.data);
        setPaginate(data.meta);
      } catch (err) {
        if (axios.isCancel(err)) {
          console.log("request cancelled");
          return;
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

    query,
    setQuery,

    errors,

    loading,

    paginate,
  };
}

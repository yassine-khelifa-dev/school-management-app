import { useEffect, useState } from "react";
import type { AcademicYearsType } from "../../academicYears/types";
import type { EnrollmentListType, EnrollQueryType } from "../types";
import { getEnrollments } from "../services/enrollmentService";
import { getAcademicYears } from "../../academicYears/services/academicYears";
import getSchoolClasses from "../../schoolClasses/services/schoolClass";
import type { SchoolClassType } from "../../schoolClasses/types";
import axios from "axios";

export function useEnrollment() {
  const [enrollmentList, setEnrollmentList] =
    useState<EnrollmentListType>(null);

  const [academicYers, setAcademicYers] = useState<AcademicYearsType[]>([]);
  const [schoolClasses, setSchoolClasses] = useState<SchoolClassType[]>([]);

  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<string>("");

  const [query, setQuery] = useState<EnrollQueryType>({
    page: 1,
    filter: {
      status: "all",
    },
  });

  const handleErrorsMessage = (err: unknown) => {
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
  };

  useEffect(() => {
    const getData = async () => {
      const resAcademic = await getAcademicYears();
      const resSchool = await getSchoolClasses();
      setAcademicYers(resAcademic);
      setSchoolClasses(resSchool);
    };
    getData();
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      const getData = async () => {
        try {
          setLoading(true);

          setErrors("");

          const resEnroll = await getEnrollments(query, controller.signal);
          // console.log("getData->resEnroll: ", resEnroll);
          setEnrollmentList(resEnroll);
        } catch (err) {
          console.log("errors: ", err);
          handleErrorsMessage(err);
        } finally {
          if (!controller.signal.aborted) {
            setLoading(false);
          }
        }
      };
      getData();
    }, 500);

    return () => {
      // cleanUp
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  const changePage = (page: number) =>
    setQuery((prev) => ({ ...prev, page: page }));

  const changeFilter = (
    field: keyof EnrollQueryType["filter"],
    value: string,
  ) =>
    setQuery({
      ...query,
      page: 1,
      filter: { ...query.filter, [field]: value },
    });

  // export :

  return {
    enrollmentList,
    academicYers,
    schoolClasses,
    query,
    loading,
    errors,
    changePage,
    changeFilter,
  };
}

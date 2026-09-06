import { useEffect, useState } from "react";
import type { AcademicYearsType } from "../../academicYears/types";
import type {
  EnrollmentListType,
  EnrollmentType,
  EnrollQueryType,
} from "../types";
import {
  delay,
  deleteEnrollment,
  getEnrollments,
} from "../services/enrollmentService";
import { getAcademicYears } from "../../academicYears/services/academicYears";
import getSchoolClasses from "../../schoolClasses/services/schoolClass";
import type { SchoolClassType } from "../../schoolClasses/types";
import useApiError from "../../../hooks/useApiError";

export function useEnrollment() {
  const [enrollmentList, setEnrollmentList] =
    useState<EnrollmentListType | null>(null);

  const [academicYers, setAcademicYers] = useState<AcademicYearsType[]>([]);
  const [schoolClasses, setSchoolClasses] = useState<SchoolClassType[]>([]);

  const [loading, setLoading] = useState<boolean>(false);
  const [deleting, setDeleting] = useState<boolean>(false);

  const [messages, setMessages] = useState<string | null>(null);

  const [query, setQuery] = useState<EnrollQueryType>({
    page: 1,
    filter: {
      status: "all",
    },
  });

  const { error, clearError, handleError } = useApiError();

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
          await delay(500);

          clearError();

          const resEnroll = await getEnrollments(query, controller.signal);
          // console.log("getData->resEnroll: ", resEnroll);
          setEnrollmentList(resEnroll);
        } catch (err) {
          console.log("errors: ", err);
          handleError(err);
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

  const refresh = () => {
    changePage(query.page);
  };

  const changePage = (page: number) =>
    setQuery((prev) => ({ ...prev, page: page }));

  const changeFilter = (
    field: keyof EnrollQueryType["filter"],
    value: string,
  ) =>
    setQuery((prev) => ({
      ...prev,
      page: 1,
      filter: { ...prev.filter, [field]: value },
    }));

  const resetFilter = () => {
    setQuery({
      page: 1,
      filter: {
        status: "all",
        search: "",
      },
    });
  };

  const handledeleteEnrollment = async (enroll: EnrollmentType) => {
    // console.log(enroll);
    try {
      setMessages("");
      setDeleting(true);
      clearError();
      const res = await deleteEnrollment(enroll);
      //console.log(res.status);

      if (res.status === 204) {
        // cas : success
        const remaining = enrollmentList.data.filter(
          (en) => en.id !== enroll.id,
        );

        // update paginate and enroll-list:
        if (remaining.length === 0 && query.page > 1)
          changePage(query.page - 1);
        else {
          // remain the page has same enroll's size ( 8-row)
          changePage(query.page);
        }

        setMessages(
          "Enrollment has been deleted successfully with ID: " + enroll.id,
        );

        return true;
      }
      return false;
    } catch (err) {
      handleError(err);
      return false;
    } finally {
      await delay(600);

      setDeleting(false);
    }
  };

  // export :

  return {
    enrollmentList,
    academicYers,
    schoolClasses,
    query,
    loading,
    error,
    changePage,
    changeFilter,
    refresh,
    messages,
    deleting,
    handledeleteEnrollment,
    resetFilter,
  };
}

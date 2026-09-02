import { useEffect, useState } from "react";
import type { AcademicYearsType } from "../../academicYears/types";
import type { EnrollmentListType, EnrollQueryType } from "../types";
import { getEnrollments } from "../services/enrollmentService";
import { getAcademicYears } from "../../academicYears/services/academicYears";
import getSchoolClasses from "../../schoolClasses/services/schoolClass";
import type { SchoolClassType } from "../../schoolClasses/types";

export function useEnrollment() {
  const [enrollmentList, setEnrollmentList] =
    useState<EnrollmentListType>(null);

  const [academicYers, setAcademicYers] = useState<AcademicYearsType[]>([null]);
  const [schoolClasses, setSchoolClasses] = useState<SchoolClassType[]>([]);

  const [query, setQuery] = useState<EnrollQueryType>({
    page: 1,
    filter: {
      status: "all",
    },
  });

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
    const getData = async () => {
      const resEnroll = await getEnrollments(query);
      //  console.log('res: useeff:', res)
      setEnrollmentList(resEnroll);
    };
    getData();
  }, [query]);

  const handleQuery = (q: EnrollQueryType) => {
    setQuery(q);
  };

  const changePage = (page: number) => setQuery({ ...query, page: page });

  return {
    enrollmentList,
    academicYers,
    query,
    handleQuery,
    schoolClasses,
    changePage,
  };
}

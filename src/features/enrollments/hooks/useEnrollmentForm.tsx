import { useEffect, useState } from "react";
import useApiError from "../../../hooks/useApiError";
import type { StudentType } from "../../students/types";
import type { AcademicYearsType } from "../../academicYears/types";
import type { SchoolClassType } from "../../schoolClasses/types";
import { getAcademicYears } from "../../academicYears/services/academicYears";
import getSchoolClasses from "../../schoolClasses/services/schoolClass";
import { getStudents } from "../../students/services/studentService";
import {
  createEnrollment,
  delay,
  editEnrollment,
} from "../services/enrollmentService";
import type { EnrollmentFormType, EnrollmentType } from "../types";

type SelectedOptionsType = {
  student: StudentType | null;
  year: AcademicYearsType | null;
  class: SchoolClassType | null;
};

export default function useEnrollmentForm() {
  const [creating, setCreating] = useState<boolean>(false);
  const [editing, setEditing] = useState<boolean>(false);

  const { error, clearError, handleError } = useApiError();
  const [successMessage, setSuccessMessage] = useState("");
  const [students, setStudents] = useState<StudentType[]>([]);
  const [search, setSearch] = useState<string>("");

  const [academicYersList, setAcademicYersList] = useState<AcademicYearsType[]>(
    [],
  );
  const [classList, setClassList] = useState<SchoolClassType[]>([]);

  const [selectedOptions, setSelectedOptions] = useState<SelectedOptionsType>({
    student: null,
    year: null,
    class: null,
  });

  useEffect(() => {
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const resStudent = await getStudents(
          {
            fullname: search,
          },
          controller.signal,
        );

        console.log(resStudent);

        setStudents(resStudent.data);
      } catch (err) {
        console.log(err);
      } finally {
        console.log("getStudents: search ... Ok");
      }
    }, 500);

    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [search]);

  useEffect(() => {
    const getData = async () => {
      try {
        const [resAY, resSC] = await Promise.all([
          getAcademicYears(),
          getSchoolClasses(),
        ]);
        //   console.log(resAY);
        setAcademicYersList(resAY);
        setClassList(resSC);
      } catch (err) {
        console.log(err);
      } finally {
        console.log("ok");
      }
    };

    getData();
  }, []);

  const handleEnrollSubmit = async (data: EnrollmentFormType) => {
    if (creating) return false;
    try {
      setCreating(true);
      clearError();
      setSuccessMessage("");
      console.log("handleSubmit", data);
      const res = await createEnrollment(data);
      if (res.data.data.id > 0) {
        setSelectedOptions({ student: null, year: null, class: null });
        setSuccessMessage("The enrollment has created successfuly!");
        return true;
      }
      return false;

      // store Data
    } catch (err) {
      const r = handleError(err);
      console.log(r);
      return false;
    } finally {
      await delay(1000);

      console.log("end submit");
      setCreating(false);
    }
  };

  const handleEnrollEditSubmit = async (
    data: EnrollmentFormType,
    enroll: EnrollmentType,
  ) => {
    if (editing) return false;
    try {
      setEditing(true);
      clearError();
      setSuccessMessage("");
      console.log("handleEnrollEditSubmit", data);
      const res = await editEnrollment(data, enroll);
      if (res.data.data.id > 0) {
        setSuccessMessage("The enrollment has updated successfuly!");
        return true;
      }
      return false;
      // store Data
    } catch (err) {
      const r = handleError(err);
      console.log(r);
      return false;
    } finally {
      await delay(1000);

      console.log("end submit");
      setEditing(false);
    }
  };

  return {
    creating,
    editing,
    setSelectedOptions,
    error,
    clearError,
    successMessage,
    academicYersList,
    selectedOptions,
    students,
    classList,
    setSuccessMessage,
    setSearch,
    handleEnrollSubmit,
    handleEnrollEditSubmit,
  };
}

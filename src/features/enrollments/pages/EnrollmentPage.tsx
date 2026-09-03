import EnrollmentTable from "../components/EnrollmentTable";
import EnrollmentFilter from "../components/EnrollmentFilter";
import { useEnrollment } from "../hooks/useEnrollment";
import Alert from "@mui/material/Alert";

export default function EnrollmentPage() {
  const {
    enrollmentList,
    academicYers,
    schoolClasses,
    query,
    loading,
    errors,
    changePage,
    changeFilter,
  } = useEnrollment();

  return (
    <>
      <h2>Enrollments</h2>

      {loading && <p>loading...</p>}

      <EnrollmentFilter
        academicYers={academicYers}
        schoolClasses={schoolClasses}
        query={query}
        changeFilter={changeFilter}
      />

      {errors && <Alert severity="error">{errors}</Alert>}

      {enrollmentList?.data.length === 0 && (
        <Alert severity="info">There are no enrollments!</Alert>
      )}

      {enrollmentList?.data.length > 0 && (
        <EnrollmentTable enrollments={enrollmentList} changePage={changePage} />
      )}
    </>
  );
}

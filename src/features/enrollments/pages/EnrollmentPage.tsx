import EnrollmentTable from "../components/EnrollmentTable";
import EnrollmentFilter from "../components/EnrollmentFilter";
import { useEnrollment } from "../hooks/useEnrollment";

export default function EnrollmentPage() {
  const {
    enrollmentList,
    schoolClasses,
    academicYers,
    changePage,
    query,
    handleQuery,
  } = useEnrollment();

  return (
    <>
      <h2>EnrollmentPage</h2>

      <EnrollmentFilter
        academicYers={academicYers}
        schoolClasses={schoolClasses}
        setQuery={handleQuery}
        query={query}
      />

      <EnrollmentTable enrollments={enrollmentList} changePage={changePage} />
    </>
  );
}

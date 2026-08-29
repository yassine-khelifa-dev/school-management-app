import type { StudentQueryType } from "../types";
import StudentTable from "../components/StudentTable";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import StudentFilter from "../components/StudentFilter";
import { useStudentList } from "../hooks/useStudentList";

export default function StudentsPage() {
  const {
    students,

    query,
    setQuery,

    errors,

    loading,

    paginate,
  } = useStudentList();

  const handleQuery = (newQuery: StudentQueryType) => {
    setQuery(newQuery);
  };

  const handleDelete = (id: number) => {
    console.log("handle Delete ", id);
  };
  const handleEdit = (id: number) => {
    console.log("handle Edit ", id);
  };

  return (
    <>
      <h1>Student</h1>

      <StudentFilter onQueryChange={handleQuery} value={query} />

      {loading && (
        <div>
          <span> load students' list...</span>
          <Box sx={{ width: 300 }}>
            <Skeleton />
            <Skeleton animation="wave" />
            <Skeleton animation={false} />
          </Box>
        </div>
      )}

      {errors && <span style={{ color: "red" }}>{errors}</span>}

      {students.length > 0 && (
        <>
          <StudentTable
            students={students}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onQueryChange={handleQuery}
            query={query}
            paginate={paginate}
          />
        </>
      )}

      {students.length === 0 && !loading && !errors && (
        <span>There are no Students! </span>
      )}
    </>
  );
}

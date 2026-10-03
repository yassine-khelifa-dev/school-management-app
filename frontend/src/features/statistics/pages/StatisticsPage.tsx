import Alert from "@mui/material/Alert";
import { LoadingUI } from "../../../components/ui/LoadingUI";
import StatisticsTable from "../components/StatisticsTable";
import StatisticsFilter from "../components/StatisticsFilter";
import { useStatistics } from "../hooks/useStatistics";
import { useStatisticsFilterOption } from "../hooks/useStatisticsFilterOption";

export default function StatisticsPage() {
  const { error, loadingStatiPage, list, query, setQuery, overviewList } =
    useStatistics();

  const { filterOptions } = useStatisticsFilterOption();

  const academicYear = filterOptions?.academic_years?.find(
    (a) => String(a.id) === String(query.academic_year),
  );

  const messages = "";

  return (
    <main className="page-shell">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          gap: "32px",
          padding: "24px 32px",
          background: "#ffffff",
          borderBottom: "1px solid #e2e8f0",
          flexWrap: "wrap",
        }}
      >
        <div>
          <p
            style={{
              margin: 0,
              marginBottom: "6px",
              fontSize: "12px",
              fontWeight: 600,
              letterSpacing: "2px",
              textTransform: "uppercase",
              color: "#64748b",
            }}
          >
            Academic Year {academicYear?.name || ""}
          </p>

          <h1
            style={{
              margin: 0,
              fontSize: "34px",
              fontWeight: 800,
              color: "#0f172a",
            }}
          >
            Statistics
          </h1>
        </div>

        <div
          style={{
            display: "flex",
            gap: "14px",
            alignItems: "flex-end",
            flexWrap: "wrap",
          }}
        >
          <StatisticsFilter
            data={filterOptions}
            setQuery={setQuery}
            query={query}
          />
        </div>
      </div>
      <div className="page-notices">
        {error && <Alert severity="error">{error.message}</Alert>}
        {messages && <Alert severity="info">{messages}</Alert>}
      </div>

      {loadingStatiPage && <LoadingUI />}

      {list && (
        <>
          <StatisticsTable
            data={list}
            overviewList={overviewList}
            setQuery={setQuery}
            query={query}
          />
        </>
      )}
      {!list && !loadingStatiPage && !error && (
        <div className="empty-state">There are no data to display.</div>
      )}
    </main>
  );
}

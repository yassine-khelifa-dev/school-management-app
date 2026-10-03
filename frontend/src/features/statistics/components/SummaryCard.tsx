import type { SummaryOverViewType } from "../types";

type Props = {
  summary: SummaryOverViewType;
};

type StatItemProps = {
  label: string;
  value: string | number;
  subLabel?: string;
  color?: string;
};

const StatItem = ({
  label,
  value,
  subLabel,
  color = "#0f172a",
}: StatItemProps) => {
  return (
    <div
      style={{
        flex: 1,
        minWidth: "180px",
        padding: "28px 34px",
        borderRight: "1px solid #e2e8f0",
      }}
    >
      <p
        style={{
          margin: 0,
          marginBottom: "12px",
          fontSize: "12px",
          fontWeight: 600,
          letterSpacing: "2px",
          textTransform: "uppercase",
          color: "#64748b",
        }}
      >
        {label}
      </p>

      <div
        style={{
          fontSize: "30px",
          lineHeight: 1,
          fontWeight: 800,
          color,
          marginBottom: "8px",
        }}
      >
        {value}
      </div>

      {subLabel && (
        <div
          style={{
            fontSize: "14px",
            color: "#64748b",
            letterSpacing: "0.4px",
          }}
        >
          {subLabel}
        </div>
      )}
    </div>
  );
};

export function SummaryCard({ summary }: Props) {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        background: "#ffffff",
        border: "1px solid #e2e8f0",
        borderRadius: "10px",
        overflow: "hidden",
        margin: "20px 0",
        boxShadow: "0 2px 10px rgba(15, 23, 42, 0.04)",
      }}
    >
      <StatItem
        label="Students"
        value={summary.students_count}
        subLabel="total"
      />

      <StatItem
        label="Global Average"
        value={`${Number(summary.global_average).toFixed(2)}%`}
        color="#0f766e"
      />

      <StatItem
        label="Graded Records"
        value={summary.graded_records_count}
        subLabel="records"
      />

      <StatItem
        label="Subjects Passing"
        value={summary.subjects_passing}
        subLabel={`of ${summary.subjects_total} subjects`}
        color="#16a34a"
      />

      <StatItem
        label="Subjects Failing"
        value={summary.subjects_failing}
        subLabel={`of ${summary.subjects_total} subjects`}
        color="#dc2626"
      />

      
    </div>
  );
}
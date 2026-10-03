import type { TopStudentsType } from "../types";

type Props = {
  data: TopStudentsType | null;
};

export function TopStudents({ data }: Props) {
  return (
    <>
      {data?.top_students?.map((s, index) => (
        <div
          key={s.student_id}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "12px",
            margin: "10px 0",
            padding: "12px 14px",
            background: "#ffffff",
            border: "1px solid #e0f2fe",
            borderRadius: "12px",
            boxShadow: "0 2px 8px rgba(0,100,255,0.30)",
          }}
        >
          {/* Ranking */}
          <div
            style={{
              width: "32px",
              height: "32px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "50%",
              background:
                index === 0
                  ? "#facc15"
                  : index === 1
                    ? "#d1d5db"
                    : index === 2
                      ? "#d97706"
                      : "#e0f2fe",
              fontWeight: "700",
              fontSize: "14px",
            }}
          >
            {index + 1}
          </div>

          {/* Student */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              flex: 1,
            }}
          >
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                background: "#e0f2fe",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "18px",
              }}
            >
              👤
            </div>

            <span
              style={{
                fontWeight: "600",
                color: "#1f2937",
              }}
            >
              {s.full_name}
            </span>
          </div>

          {/* Average */}
          <span
            style={{
              minWidth: "64px",
              textAlign: "center",
              background: "#e0f2fe",
              color: "#0369a1",
              padding: "6px 10px",
              borderRadius: "999px",
              fontWeight: "700",
              fontSize: "14px",
            }}
          >
            {Number(s.average).toFixed(1)}%
          </span>
        </div>
      ))}

      {(!data?.top_students || data.top_students.length === 0) && (
        <div className="empty-state">There are no data to display.</div>
      )}
    </>
  );
}

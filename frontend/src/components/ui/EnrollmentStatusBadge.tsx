import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import TaskAltRoundedIcon from "@mui/icons-material/TaskAltRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import RemoveCircleOutlineRoundedIcon from "@mui/icons-material/RemoveCircleOutlineRounded";

type EnrollmentStatusBadgeProps = {
  status?: string | null;
};

export function EnrollmentStatusBadge({ status }: EnrollmentStatusBadgeProps) {
  const normalizedStatus = status?.toLowerCase();

  if (normalizedStatus === "active") {
    return (
      <span className="status-badge status-badge--active">
        <CheckCircleRoundedIcon />
        Active
      </span>
    );
  }

  if (normalizedStatus === "completed") {
    return (
      <span className="status-badge status-badge--completed">
        <TaskAltRoundedIcon />
        Completed
      </span>
    );
  }

  if (normalizedStatus === "cancelled") {
    return (
      <span className="status-badge status-badge--cancelled">
        <CancelRoundedIcon />
        Cancelled
      </span>
    );
  }

  return (
    <span className="status-badge status-badge--unavailable">
      <RemoveCircleOutlineRoundedIcon />
      Not enrolled
    </span>
  );
}

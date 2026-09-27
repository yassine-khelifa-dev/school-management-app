import { CircularProgress } from "@mui/material";

type LoadingUIProps = {
  fullscreen?: boolean;
};

export function LoadingUI({ fullscreen = false }: LoadingUIProps) {
  return (
    <div
      className={`page-loading${fullscreen ? " page-loading--fullscreen" : ""}`}
      role="status"
      aria-label="Loading"
      aria-live="polite"
    >
      <div className="page-loading__content">
        <CircularProgress size={34} thickness={4} />
      </div>
    </div>
  );
}

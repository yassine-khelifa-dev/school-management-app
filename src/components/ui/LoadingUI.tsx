import { CircularProgress } from "@mui/material";

export function LoadingUI() {
  return (
    <>
      <div
        style={{
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 300,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 10,
            background: "rgba(255,255,255,0.6)",
          }}
        >
          <CircularProgress />
        </div>
      </div>
    </>
  );
}

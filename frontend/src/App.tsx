import Navbar from "./components/Navbar";
import { AuthProvider } from "./contexts/AuthProvider";
import AppRoute from "./routes";

function App() {
  return (
    <>
      <AuthProvider>
        <Navbar />
        <AppRoute />
      </AuthProvider>
    </>
  );
}
export default App;

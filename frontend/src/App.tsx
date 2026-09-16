import Navbar from "./components/Navbar";
import { AuthProvider } from "./contexts/UserContext";
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

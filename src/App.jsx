import { useEffect } from "react";
import axiosInstance from "./api/axiosInstance";
import Router from "./routes/Router";

function App() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const init = async () => {
      try {
        await axiosInstance.post("/api/auth/refresh/");
        console.log("Token refreshed ✅");
      } catch {
        console.log("User not logged in ❌");
      }
    };

    init();
  }, []);

  return <Router />;
}

export default App;
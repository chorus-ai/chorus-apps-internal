import { useEffect, useState } from "react";
import { Provider } from "react-redux";
import { store } from "./store";
import { Navigate, Routes, Route } from "react-router-dom";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import NotFound from "./pages/Page404";
import Profile from "./pages/Profile";
import Features from "./pages/Features";
import ResetPassword from "./pages/ResetPassword";
import AuthLayout from "./layouts/Auth";
import LoginCallback from "./pages/LoginCallback";
import axios from "./utils/axios";

//Feature routes
import cadaRoutes from "./apps/cada/routes";
import iveRoutes from "./apps/ive/routes";

function SessionLoader({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    axios
      .get("/api/auth/me")
      .then((res) => {
        if (res.data?.user) {
          store.dispatch({ type: "LOGIN", user: res.data.user });
        }
      })
      .catch(() => {
        // No valid cookie — user will land on signin
      })
      .finally(() => setReady(true));
  }, []);

  if (!ready) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <div className="loader"></div>
      </div>
    );
  }

  return <>{children}</>;
}

function App() {
  return (
    <Provider store={store}>
        <SessionLoader>
          <Routes>
            <Route path="/" element={<AuthLayout />}>
              <Route path="" element={<Navigate to="/signin" />} />
              <Route path="signin" element={<Signin />} />
              <Route path="signup" element={<Signup />} />
              <Route path="404" element={<NotFound />} />
              <Route path="profile" element={<Profile />} />
              <Route path="features" element={<Features />} />
              <Route path="resetpassword" element={<ResetPassword />} />
            </Route>

            <Route path="/auth/callback" element={<LoginCallback />} />

            {cadaRoutes}
            {iveRoutes}

            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </SessionLoader>
    </Provider>
  );
}

export default App;

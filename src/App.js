import React from "react";
import { Provider } from "react-redux";
import store from "./redux";
import ThemeProvider from "./theme";
import { Navigate, Routes, Route } from "react-router-dom";
// layouts
import CadaLayout from "./apps/cada";
import IVeLayout from "./apps/ive";
import AuthLayout from "./layouts/Auth";
// pages
import OutOfOrder from "./pages/OutOfOrder";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import NotFound from "./pages/Page404";
import Profile from "./pages/Profile";
import Features from "./pages/Features";
import ResetPassword from "./pages/ResetPassword";
// CADA pages
import Dashboard from "./apps/cada/pages/Dashboard";
import Text from "./apps/cada/components/Text";
import NLP from "./apps/cada/components/NLP";
import Afib from "./apps/cada/components/Afib";
import SQi from "./apps/cada/components/SQi";
import LLM from "./apps/cada/components/LLM";
import COT from "./apps/cada/components/COT";
import ChartReview from "./apps/cada/components/ChartReview";
import CRCEval from "./apps/cada/components/CRC";
import User from "./apps/cada/pages/User";
import Project from "./apps/cada/pages/Project";
import Bucket from "./apps/cada/pages/Bucket";
// IVE pages
import IVeDashboard from "./apps/ive/pages/Dashboard";
import IVeSearch from "./apps/ive/pages/Search";
import Cohort from "./apps/ive/pages/Cohort";
import IViewer from "./apps/ive/pages/IViewer";
import IVeUser from "./apps/ive/pages/User";
import Person from "./apps/ive/pages/Data/Person";
import Measurement from "./apps/ive/pages/Data/Measurement";
import Observation from "./apps/ive/pages/Data/Observation";
import ObservationPeriod from "./apps/ive/pages/Data/ObservationPeriod";
import VisitDetail from "./apps/ive/pages/Data/VisitDetail";

import { useSelector } from "react-redux";

const ProtectedRoute = ({ children }) => {
  const user = useSelector((state) => state.main.user);
  return !user ? <Navigate to="/signin" replace /> : children;
};

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
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

          <Route
            path="/cada"
            element={
              <ProtectedRoute>
                <CadaLayout />
              </ProtectedRoute>
            }
          >
            <Route path="" element={<Dashboard />} />
            <Route path=":role/txt/:pid" element={<Text />} />
            <Route path=":role/nlp/:pid" element={<NLP />} />
            <Route path=":role/afib/:pid/" element={<Afib />} />
            <Route path=":role/sqi/:pid" element={<SQi />} />
            <Route path=":role/llm/:pid" element={<LLM />} />
            <Route path=":role/cot/:pid" element={<COT />} />
            <Route path=":role/crc/:pid" element={<CRCEval />} />
            <Route path=":role/chartreview/:pid" element={<ChartReview />} />
            <Route path="user" element={<User />} />
            <Route path="project" element={<Project />} />
            <Route path="bucket" element={<Bucket />} />
            <Route path="model" element={<OutOfOrder />} />
            <Route path="report" element={<OutOfOrder />} />
          </Route>

          <Route
            path="/ive"
            element={
              <ProtectedRoute>
                <IVeLayout />
              </ProtectedRoute>
            }
          >
            <Route path="" element={<IVeDashboard />} />
            <Route path="search" element={<IVeSearch />} />
            <Route path="cohort" element={<Cohort />} />
            <Route path="iviewer" element={<IViewer />} />
            <Route path="user" element={<IVeUser />} />
            <Route path="person" element={<Person />} />
            <Route path="measurement" element={<Measurement />} />
            <Route path="observation" element={<Observation/>} />
            <Route path="observation_period" element={<ObservationPeriod />} />
            <Route path="visit_detail" element={<VisitDetail />} />
          </Route>

          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </ThemeProvider>
    </Provider>
  );
}

export default App;

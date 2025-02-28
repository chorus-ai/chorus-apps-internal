import React from "react";
import { Route } from "react-router-dom";
import IVeLayout from "./index.js";
import Dashboard from "./pages/Dashboard";
import Search from "./pages/Search";
import Cohort from "./pages/Cohort";
import IViewer from "./pages/IViewer";
import User from "./pages/User";
import Person from "./pages/Data/Person";
import Measurement from "./pages/Data/Measurement";
import Observation from "./pages/Data/Observation";
import ObservationPeriod from "./pages/Data/ObservationPeriod";
import VisitDetail from "./pages/Data/VisitDetail";
import ProtectedRoute from "../../common/ProtectedRoute";
import Container from "./pages/Container";
import Waveform from "./pages/Data/Waveform";
import Image from "./pages/Data/Image";

const iveRoutes = [
  <Route
    key="ive"
    path="/ive"
    element={
      <ProtectedRoute>
        <IVeLayout />
      </ProtectedRoute>
    }
  >
    <Route path="" element={<Dashboard />} />
    <Route path="search" element={<Search />} />
    <Route path="cohort" element={<Cohort />} />
    <Route path="iviewer" element={<IViewer />} />
    <Route path="user" element={<User />} />
    <Route path="containers" element={<Container />} />
    <Route path="person" element={<Person />} />
    <Route path="measurement" element={<Measurement />} />
    <Route path="observation" element={<Observation />} />
    <Route path="observation_period" element={<ObservationPeriod />} />
    <Route path="visit_detail" element={<VisitDetail />} />
    <Route path="waveform" element={<Waveform />} />
    <Route path="image" element={<Image />} />
  </Route>,
];

export default iveRoutes;

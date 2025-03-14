import React from "react";
import { Route } from "react-router-dom";
import IVeLayout from "./index.js";
import Dashboard from "./pages/Dashboard";
import Search from "./pages/Search";
import Cohort from "./pages/Cohort";
import IViewer from "./pages/IViewer";
import User from "./pages/User";
import Person from "./pages/Data/Person";
import Container from "./pages/Container";
import Waveform from "./pages/Data/Waveform";
import Image from "./pages/Data/Image";
import ProtectedRoute from "../../common/ProtectedRoute";
import OutOfOrder from "../../pages/OutOfOrder";

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
    <Route path="cohort" element={<Cohort table={'cohort'}/>} />
    <Route path="iviewer" element={<IViewer />} />
    <Route path="user" element={<User />} />
    <Route path="containers" element={<Container />} />
    {[
      ['person', 18868], 
      ['death', 4024],
      ['observation', 151515697],
      ['observation_period', 18809],
      ['condition_occurrence', ],
      ['procedure_occurrence', 4818425],
      ['visit_occurrence', 1206239],
      ['visit_detail', 630744],
      ['drug_exposure', 16932691],
      ['measurement', 151910037],
      ['note', 698515]
    ].map((key, index) => (
      <Route key={index} path={key[0]} element={<Person table={key[0]} total={key[1]} />} />
    ))}
    <Route path="note_nlp" element={<OutOfOrder />} />
    <Route path="device_exposure" element={<OutOfOrder />} />
    <Route path="waveform" element={<Waveform />} />
    <Route path="image" element={<Image />} />
  </Route>,
];

export default iveRoutes;

import React from "react";
import { Route } from "react-router-dom";
import CadaLayout from "./index.js";
import Dashboard from "./pages/Dashboard";
import Text from "./components/Text";
import NLP from "./components/NLP";
import Afib from "./components/Afib";
import SQi from "./components/SQi";
import LLM from "./components/LLM";
import COT from "./components/COT";
// import ChartReview from "./components/ChartReview";
import CRCEval from "./components/CRC";
import User from "./pages/User";
import Project from "./pages/Project";
import Bucket from "./pages/Bucket";
import OutOfOrder from "../../pages/OutOfOrder";
import ProtectedRoute from "../../common/ProtectedRoute";
import Diet from "./components/Diet/index.js";
import Note from "./components/Note/index.js";

const cadaRoutes = [
  <Route
    key="cada"
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
    <Route path=":role/note/:pid" element={<Note />} />
    <Route path=":role/afib/:pid" element={<Afib />} />
    <Route path=":role/sqi/:pid" element={<SQi />} />
    <Route path=":role/llm/:pid" element={<LLM />} />
    <Route path=":role/cot/:pid" element={<COT />} />
    <Route path=":role/crc/:pid" element={<CRCEval />} />
    <Route path=":role/diet/:pid" element={<Diet />} />
    {/* <Route path=":role/chartreview/:pid" element={<ChartReview />} /> */}
    <Route path="user" element={<User />} />
    <Route path="project" element={<Project />} />
    <Route path="bucket" element={<Bucket />} />
    <Route path="model" element={<OutOfOrder />} />
    <Route path="report" element={<OutOfOrder />} />
  </Route>,
];

export default cadaRoutes;

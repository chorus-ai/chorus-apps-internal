import { Route } from "react-router-dom";
import CadaLayout from "./index";
import ProtectedRoute from "../../common/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import User from "./pages/User";
import Project from "./pages/Project";
import Bucket from "./pages/Bucket";
import Model from "./pages/Model";
import OutOfOrder from "../../pages/OutOfOrder";
import Text from "./components/Text/index";
import Afib from "./components/Afib/index";
import SQi from "./components/SQi/index";
import COT from "./components/COT/index";
import CRCEval from "./components/CRC/index";
import Diet from "./components/Diet/index";
import Dicom from "./components/Dicom/index";
import PubReview from "./components/PubReview/index";
import Note from "./components/Note/index";
// import NLP from "./components/NLP/index";
// import LLM from "./components/LLM/index";
// import ChartReview from "./components/ChartReview";
import Panel from "./components/Panel/index";

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
    <Route path="user" element={<User />} />
    <Route path="project" element={<Project />} />
    <Route path="bucket" element={<Bucket />} />
    <Route path="model" element={<Model />} />
    <Route path="report" element={<OutOfOrder />} />  
    <Route path=":role/txt/:pid" element={<Text />} />  
    <Route path=":role/afib/:pid" element={<Afib />} />
    <Route path=":role/sqi/:pid" element={<SQi />} /> 
    <Route path=":role/note/:pid" element={<Note />} /> 
    {/* <Route path=":role/nlp/:pid" element={<NLP />} /> */}
    {/* <Route path=":role/llm/:pid" element={<LLM />} />  */}
    <Route path=":role/cot/:pid" element={<COT />} />
    <Route path=":role/crc/:pid" element={<CRCEval />} />
    <Route path=":role/diet/:pid" element={<Diet />} />
    <Route path=":role/dcm/:pid" element={<Dicom />} />
    <Route path=":role/pub/:pid" element={<PubReview />} />
    <Route path=":role/:type/:pid" element={<Panel />} />
    {/* <Route path=":role/chartreview/:pid" element={<ChartReview />} /> */}
  </Route>,
];

export default cadaRoutes;

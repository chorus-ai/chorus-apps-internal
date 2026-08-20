import { useParams } from "react-router-dom";
import Annotation from "./Annotation";

function PubReview() {
  const params = useParams();
  const pid = parseInt(params.pid as string, 10);
  return (
    <>
      {params.role === "adjudicator" ? (
        <></>
      ) : (
        <Annotation pid={pid} />
      )}
    </>
  );
}

export default PubReview;

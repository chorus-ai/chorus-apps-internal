import { useParams } from 'react-router-dom'
import Adjudication from './Adjudication';
import Annotation from './Annotation';
import { useAppSelector } from "../../../../hooks/redux";
import { useUserProjects } from '../../hooks';

export default function Note() {
  const { pid, role } = useParams();
  const project = useAppSelector((state) => state.cada.userProjects[pid]);
  const user = useAppSelector((state) => state.main.user);

  useUserProjects(user.id);

  return (
    <>
      {role === "adjudicator" ? (
        <Adjudication pid={parseInt(pid, 10)} />
      ) : (
        <Annotation
          pid={parseInt(pid, 10)} />
      )}
    </>
  )
}

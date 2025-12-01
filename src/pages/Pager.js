import { useParams } from "react-router-dom";

const Pager = () => {
  const { id, username } = useParams();
  return <div>{`Pager Page ${id} for user ${username}`}</div>;
};

export default Pager;

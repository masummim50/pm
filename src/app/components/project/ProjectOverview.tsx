import { useParams } from "react-router-dom";
import { useGetPersonalProjectByIdQuery } from "../../redux/features/project/project.api";
import PersonalOverview from "./overview/PersonalOverview";
import GroupOverview from "./overview/GroupOverview";

const ProjectOverview = () => {
  const { id } = useParams();
  const { data } = useGetPersonalProjectByIdQuery(id);

  return data?.data?.type === "personal" ? (
    <PersonalOverview data={data.data} />
  ) : (
    <GroupOverview data={data.data} />
  );
};

export default ProjectOverview;

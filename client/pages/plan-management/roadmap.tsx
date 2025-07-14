import { withAuth } from '../../context/AuthContext';
import { ProjectPage } from '../../components';

function RoadmapPage() {
  return <ProjectPage />;
}

export default withAuth(RoadmapPage);

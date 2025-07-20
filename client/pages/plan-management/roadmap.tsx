import { withAuth } from '../../context/AuthContext';
import { ProjectPage } from '../../components';
import { useRouter } from 'next/router';

function RoadmapPage() {
  const router = useRouter();
  const { project } = router.query;
  const projectId = Array.isArray(project) ? project[0] : project;
  return <ProjectPage projectId={projectId as string | undefined} />;
}

export default withAuth(RoadmapPage);

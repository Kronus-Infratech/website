import { Suspense } from "react";
import ProjectsContent from "./components/ProjectsContent";
import ProjectsFeed from "./components/ProjectsFeed";
import ProjectsGridSkeleton from "./components/ProjectsGridSkeleton";

export const revalidate = 60;

export default function ProjectsPage() {
    return (
        <ProjectsContent>
            <Suspense fallback={<ProjectsGridSkeleton />}>
                <ProjectsFeed />
            </Suspense>
        </ProjectsContent>
    );
}

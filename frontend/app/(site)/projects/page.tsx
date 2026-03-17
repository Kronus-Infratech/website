import { fetchProjects } from "@/lib/fetchers";
import { JsonLd, projectListLd } from "@/lib/schemas";
import ProjectsContent from "./components/ProjectsContent";

export const revalidate = 60;

export default async function ProjectsPage() {
    const projects = await fetchProjects();

    return (
        <>
            <JsonLd data={projectListLd(projects)} />
            <ProjectsContent initialProjects={projects} />
        </>
    );
}

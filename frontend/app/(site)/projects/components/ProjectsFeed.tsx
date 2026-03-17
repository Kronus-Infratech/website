import { fetchProjects } from "@/lib/fetchers";
import { JsonLd, projectListLd } from "@/lib/schemas";
import { ProjectsGrid } from "./ProjectsContent";

export default async function ProjectsFeed() {
    const projects = await fetchProjects();
    return (
        <>
            <JsonLd data={projectListLd(projects)} />
            <ProjectsGrid projects={projects} />
        </>
    );
}

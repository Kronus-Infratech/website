"use client";

import ProjectForm from "../components/ProjectForm";

export default function NewProjectPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 font-heading">
        New Project
      </h1>
      <ProjectForm />
    </div>
  );
}

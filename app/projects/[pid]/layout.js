"use client"

import ProjectContext from "@/contexts/project/projectContext";
import ProjectsContext from "@/contexts/project/projectsContext"
import { useContext, useState } from "react"

export default function projectLayout({children, params}){

    const {projects, updateProjects} = useContext(ProjectsContext);

    const [project, setProject] = useState(projects[params.pid]);

    const updateProject = async (newProject) => {
        setProject(newProject)
        updateProjects({
            ...projects,
            [params.pid]: newProject
        })
        const data = {id: params.pid, other: newProject};
        const res = await fetch("/api/setData", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(data)
          });
    }

    return(
        <div>
            <ProjectContext.Provider value={{project, updateProject}}>
                {children}
            </ProjectContext.Provider>
        </div>
    )
}
"use client"

import ProjectContext from "@/contexts/project/projectContext";
import ProjectsContext from "@/contexts/project/projectsContext"
import { useContext, useState } from "react"

export default function projectLayout({children, params}){

    const {projects, updateProjects} = useContext(ProjectsContext);

    const [project, setProject] = useState(projects[params.pid]);

    const updateProject = (newProject) => {
        setProject(newProject)
        updateProjects({
            ...projects,
            [params.pid]: newProject
        })
    }

    return(
        <div>
            <ProjectContext.Provider value={{project, updateProject}}>
                {children}
            </ProjectContext.Provider>
        </div>
    )
}
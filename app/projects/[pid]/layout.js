"use client"

import ProjectContext from "@/contexts/project/projectContext";
import ProjectsContext from "@/contexts/project/projectsContext"
import { useContext, useEffect, useState } from "react"

export default function projectLayout({children, params}){

    const {projects, updateProjects} = useContext(ProjectsContext);

    const [project, setProject] = useState(
        projects[params.pid] ? projects[params.pid] : async () => {
            const res = await fetch(`/api/getData?pid=${params.pid}`, {method: "GET"});
            const data = await res.json();
            console.log(data);  
            return data;
        }
    );

    const updateProject = async (newProject) => {
        setProject(newProject)
        updateProjects({
            ...projects,
            [params.pid]: newProject
        })
        console.log(newProject);
        const data = {id: params.pid, other: newProject};
        const res = await fetch("/api/setData", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(data)
          });
            const res2 = await fetch(`/api/getData?pid=${params.pid}`, {method: "GET"});
            const data2 = await res2.json();
            console.log(data2);  
    }
    
    return(
        <div>
            <ProjectContext.Provider value={{project, updateProject}}>
                {children}
            </ProjectContext.Provider>
        </div>
    )
}
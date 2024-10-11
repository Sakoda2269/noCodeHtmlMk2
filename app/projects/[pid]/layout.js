"use client"

import ProjectContext from "@/contexts/project/projectContext";
import ProjectsContext from "@/contexts/project/projectsContext"
import { useContext, useEffect, useState } from "react"

export default function projectLayout({children, params}){

    const {projects, updateProjects} = useContext(ProjectsContext);

    const [project, setProject] = useState(projects[params.pid]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if(!project) {
            const get = async() => {
                try{
                    const res = await fetch(`/api/getData?pid=${params.pid}`, {method:"GET"});
                    const data = await res.json();
                    if(data){
                        setProject(data);
                    }
                } catch (error){
                    console.log(error);
                } finally {
                    setIsLoading(false);
                }
            }
            get();
        } else {
            setIsLoading(false);
        }
    }, [])

    const updateProject = async (newProject) => {
        console.log("project update")
        setProject(newProject)
        updateProjects({
            ...projects,
            [params.pid]: newProject
        })
        // const data = {id: params.pid, other: newProject};
        // const res = await fetch("/api/setData", {
        //     method: "POST",
        //     headers: {"Content-Type": "application/json"},
        //     body: JSON.stringify(data)
        //   });
    }
    
    return(
        <div>
        {isLoading ? (
            <div>
                Loading...
            </div>
        ) : (
            <ProjectContext.Provider value={{project, updateProject}}>
                {children}
            </ProjectContext.Provider>
        )}
            
        </div>
    )
}
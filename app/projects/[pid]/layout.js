"use client"

import ProjectContext from "@/contexts/project/projectContext";
import { useEffect, useState } from "react"

export default function projectLayout({ children, params }) {

    const [project, setProject] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const get = async () => {
            try {
                const res = await fetch(`/api/getData?pid=${params.pid}`, { method: "GET" });
                const data = await res.json();
                if (data) {
                    setProject(data);
                }
            } catch (error) {
                console.log(error);
            } finally {
                setIsLoading(false);
            }
        }
        get();
    }, [])

    const updateProject = async (newProject) => {
        setProject(newProject)
    }

    return (
        <div>
            {isLoading ? (
                <div>
                    Loading...
                </div>
            ) : (
                <ProjectContext.Provider value={{ project, updateProject }}>
                    {children}
                </ProjectContext.Provider>
            )}

        </div>
    )
}
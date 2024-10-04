"use client"
import ProjectContext from "@/contexts/project/projectContext";
import ProjectsContext from "@/contexts/project/projectsContext";
import Link from "next/link";
import { useContext, useState } from "react"


export default function Project({params}){

    const {projects, updateProjects} = useContext(ProjectsContext);

    return(
        <div>
            <div className="menu-bar">
                <Link href={`/projects/${params.pid}/design`}>
                    <button>design</button>
                </Link>
                <Link href={`/projects/${params.pid}/events`}>
                    <button>events</button>
                </Link>
            </div>
        </div>
    )
}
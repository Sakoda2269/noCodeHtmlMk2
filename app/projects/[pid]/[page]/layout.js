"use client"

import DesignContext from "@/contexts/design/designContext";
import EventsContext from "@/contexts/event/eventsContext";
import ProjectContext from "@/contexts/project/projectContext";
import ProjectsContext from "@/contexts/project/projectsContext"
import { useContext, useState } from "react"

export default function ProjectLayout({children, params}) {


    const {project, updateProject} = useContext(ProjectContext);
    const [design, setDesign] = useState(project.pages[params.page].design);
    const [events, setEvents] = useState(project.pages[params.page].events);

    const updateDesign = (newDesing) => {
        setDesign(newDesing);
        let newProject = project;
        newProject.pages[params.page].design = newDesing;
        updateProject(newProject);
    } 

    const updateEvents = (newEvents) => {
        setEvents(newEvents);
        let newProject = project;
        newProject.pages[params.page].events = newEvents;
        updateProject(newProject)
    }

    return(
        <div>
            <DesignContext.Provider value={{design, updateDesign}}>
                <EventsContext.Provider value={{events, updateEvents}}>
                    {children}
                </EventsContext.Provider>
            </DesignContext.Provider>
        </div>
    )
}
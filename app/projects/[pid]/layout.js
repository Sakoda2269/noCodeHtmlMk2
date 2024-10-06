"use client"

import DesignContext from "@/contexts/design/designContext";
import EventsContext from "@/contexts/event/eventsContext";
import ProjectsContext from "@/contexts/project/projectsContext"
import { useContext, useState } from "react"

export default function ProjectLayout({children, params}) {

    const {projects, updateProjects} = useContext(ProjectsContext);
    const [design, setDesign] = useState(projects[params.pid].design);
    const [events, setEvents] = useState(projects[params.pid].events);

    const updateDesign = (newDesing) => {
        setDesign(newDesing);
        let newProjects = projects;
        newProjects[params.pid].design = newDesing;
        updateProjects(newProjects);
    } 

    const updateEvents = (newEvents) => {
        setEvents(newEvents);
        let newProjects = projects;
        newProjects[params.pid].events = newEvents;
        updateProjects(newProjects)
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
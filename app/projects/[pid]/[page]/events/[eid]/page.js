"use client"
import EventDropArea from "@/components/event/eventDropArea";
import EventList from "@/components/event/eventList";
import EventPropertyArea from "@/components/event/eventPropertyArea";
import EventContext from "@/contexts/event/eventContext";
import EventDraggingContext from "@/contexts/event/eventDraggingContext";
import EventsContext from "@/contexts/event/eventsContext";
import EventSelectingContext from "@/contexts/event/eventSelectingContext";
import ProjectContext from "@/contexts/project/projectContext";
import Link from "next/link";
import { useContext, useState } from "react";


export default function Event({params}) {

    const {project, updateProject} = useContext(ProjectContext);

    const [event, setEvent] = useState(project.pages[params.page].events.event[params.eid]);
    const [dragging, setDragging] = useState({});
    const [selecting, setSelecting] = useState("");

    const updateEvent = (newEvent) => {
        console.log("update event")
        setEvent(newEvent);
    }

    const saveEvent = async () => {
        let newProject = project;
        newProject.pages[params.page].events.event[params.eid] = event;
        updateProject(newProject);

        const res = await fetch(`/api/saveProjects/${params.pid}/pages/${params.page}/events/event/${params.eid}`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(event)
        });

    }

    return (
        <div>
            <div className="menu-bar">
                <Link href={`/projects/${params.pid}/${params.page}`}>
                    <button>top</button>
                </Link>
                <Link href={`/projects/${params.pid}/${params.page}/events`}>
                    <button>events</button>
                </Link>
                <button onClick={saveEvent}>save</button>
            </div>
            <EventContext.Provider value={{event, updateEvent}}>
                <EventDraggingContext.Provider value={{dragging, setDragging}}>
                    <EventSelectingContext.Provider value={{selecting, setSelecting}}>
                        <div className="row" style={{ height: "100vh" }}>
                            <div className="col-2" style={{border:"1px solid black", padding: "10px"}}>
                                <EventList eid={params.eid}/>
                            </div>
                            <div className="col-7" style={{border:"1px solid black", padding: "10px"}}>
                                <EventDropArea eid={params.eid}/>
                            </div>
                            <div className="col-3" style={{border:"1px solid black", padding: "10px"}}>
                                <EventPropertyArea eid={params.eid} page={params.page}/>
                            </div>
                        </div>
                    </EventSelectingContext.Provider>
                </EventDraggingContext.Provider>
            </EventContext.Provider>
        </div>
    )
}
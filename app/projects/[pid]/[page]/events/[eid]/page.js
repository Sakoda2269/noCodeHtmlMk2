"use client"
import EventDropArea from "@/components/event/eventDropArea";
import EventList from "@/components/event/eventList";
import EventPropertyArea from "@/components/event/eventPropertyArea";
import Popup from "@/components/popup";
import EventContext from "@/contexts/event/eventContext";
import EventDraggingContext from "@/contexts/event/eventDraggingContext";
import EventSelectingContext from "@/contexts/event/eventSelectingContext";
import ProjectContext from "@/contexts/project/projectContext";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";


export default function Event({ params }) {

    const { project, updateProject } = useContext(ProjectContext);

    const [event, setEvent] = useState(project.pages[params.page].events.event[params.eid]);
    const [dragging, setDragging] = useState({});
    const [selecting, setSelecting] = useState("");

    const [isOpen, setIsOpen] = useState(false);
    const [nextPage, setNextPage] = useState("");

    useEffect(() => {
        const beforeReload = (e) => {
            e.preventDefault();
            const message = "変更が保存されていません。ページを離れますか？";
            e.returnValue = message;
            return message;
        };
        window.addEventListener("beforeunload", beforeReload);
        return () => {
            window.removeEventListener("beforeunload", beforeReload);
        }
    }, []);

    const updateEvent = (newEvent) => {
        setEvent(newEvent);
    }

    const saveEvent = async () => {
        let newProject = project;
        newProject.pages[params.page].events.event[params.eid] = event;
        updateProject(newProject);

        const res = await fetch(`/api/saveProjects/${params.pid}/pages/${params.page}/events/event/${params.eid}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(event)
        });
    }

    return (
        <div>
            <div className="menu-bar">
                <button onClick={() => {setIsOpen(true); setNextPage(`/projects/${params.pid}/${params.page}`)}}>top</button>
                <button onClick={() => {setIsOpen(true); setNextPage(`/projects/${params.pid}/${params.page}/events`)}}>events</button>
                <button onClick={saveEvent}>save</button>
            </div>
            <EventContext.Provider value={{ event, updateEvent }}>
                <EventDraggingContext.Provider value={{ dragging, setDragging }}>
                    <EventSelectingContext.Provider value={{ selecting, setSelecting }}>
                        <div className="row" style={{ height: "100vh" }}>
                            <div className="col-2" style={{ border: "1px solid black", padding: "10px" }}>
                                <EventList eid={params.eid} />
                            </div>
                            <div className="col-7" style={{ border: "1px solid black", padding: "10px" }}>
                                <EventDropArea eid={params.eid} />
                            </div>
                            <div className="col-3" style={{ border: "1px solid black", padding: "10px" }}>
                                <EventPropertyArea eid={params.eid} page={params.page} />
                            </div>
                        </div>
                    </EventSelectingContext.Provider>
                </EventDraggingContext.Provider>
            </EventContext.Provider>

            <Popup isOpen={isOpen}>
                <div>
                    <h4>保存前にページを離れると変更が失われます。</h4>
                    <br />
                    <div className="row justify-content-between">
                        <div className="col">
                            <Link href={nextPage}>
                                <button className="btn btn-primary" onClick={()=>{saveEvent()}}>保存して終了</button>
                            </Link>
                        </div>
                        <div className="col">
                            <Link href={nextPage}>
                                <button className="btn btn-warning">保存せずに終了</button>
                            </Link>
                        </div>
                        <div className="col">
                            <button className="btn btn-secondary" onClick={() => {setIsOpen(false)}}>キャンセル</button>
                        </div>
                    </div>
                </div>
            </Popup>

        </div>
    )
}
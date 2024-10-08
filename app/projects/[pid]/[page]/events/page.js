"use client"

import Popup from "@/components/popup";
import EventsContext from "@/contexts/event/eventsContext";
import ProjectsContext from "@/contexts/project/projectsContext";
import Link from "next/link";
import { useContext, useState } from "react"

export default function Events({params}) {

    const {projects, updateProjects} = useContext(ProjectsContext);
    const {events, updateEvents} = useContext(EventsContext);

    const [isOpen, setIsOpen] = useState(false);
    const [title, setTitle] = useState("");

    const onTitleChange = (e) => {
        setTitle(e.target.value);
    }

    const createEvent = (e) => {
        setIsOpen(false);
        let newEvents = {...events};
        let id = self.crypto.randomUUID();
        newEvents.event[id] = {
            title: title,
            actions: {}
        };
        updateEvents(newEvents);
    }

    const cancel = (e) => {
        setIsOpen(false);
        setTitle("");
    }

    return (
        <div>
            <div className="menu-bar">
                <Link href={`/projects/${params.pid}/${params.page}`}>
                    <button>top</button>
                </Link>
                <Link href={`/projects/${params.pid}/${params.page}/design`}>
                    <button>design</button>
                </Link>
            </div>
            <div className="grid">
                <button className="btn btn-secondary" onClick={() => {setIsOpen(true)}}>
                    <p></p>
                    新規作成
                    <p></p>
                </button>
                {Object.entries(events.event).map(([eid, event]) => (
                    <Link href={`/projects/${params.pid}/${params.page}/events/${eid}`} key={eid}>
                        <button className="btn" style={{border: "1px solid black", width: "100%", height:"100%"}}>
                            {event.title}
                        </button>
                    </Link>
                ))}
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>

            <Popup isOpen={isOpen}>
                <div>
                    <label className="form-label">イベント名</label>
                    <input type="text" onChange={onTitleChange} className="form-control border-secondary" /> 
                    {title=="" && <label className="form-label" style={{color:"red"}}>1文字以上入力してください</label>}
                </div>
                <p></p>
                <div style={{display: "flex", justifyContent: "flex-end"}}>
                    <button className="btn btn-secondary" onClick={cancel}>キャンセル</button>
                    {title!= "" ? (
                        <button className="btn btn-primary" style={{marginLeft: "10px"}} onClick={createEvent}>決定</button>
                    ) : (
                        <button className="btn btn-primary" style={{marginLeft: "10px"}} disabled>決定</button>
                    )}
                </div>
            </Popup>
        </div>
    )
}
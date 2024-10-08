"use client"
import EventDropArea from "@/components/event/eventDropArea";
import EventList from "@/components/event/eventList";
import EventPropertyArea from "@/components/event/eventPropertyArea";
import EventContext from "@/contexts/event/eventContext";
import EventDraggingContext from "@/contexts/event/eventDraggingContext";
import EventsContext from "@/contexts/event/eventsContext";
import EventSelectingContext from "@/contexts/event/eventSelectingContext";
import Link from "next/link";
import { useContext, useState } from "react";


export default function Event({params}) {

    const {events, updateEvents} = useContext(EventsContext);

    const [event, setEvent] = useState(events.event[params.eid]);
    const [dragging, setDragging] = useState({});
    const [selecting, setSelecting] = useState("");

    const updateEvent = (newEvent) => {
        setEvent(newEvent);
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
                                <EventPropertyArea eid={params.eid}/>
                            </div>
                        </div>
                    </EventSelectingContext.Provider>
                </EventDraggingContext.Provider>
            </EventContext.Provider>
        </div>
    )
}
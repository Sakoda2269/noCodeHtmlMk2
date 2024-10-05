"use client"

import EventContext from "@/contexts/event/eventContext";
import EventDraggingContext from "@/contexts/event/eventDraggingContext";
import { useContext, useEffect, useRef, useState } from "react"
import { eventMap } from "./eventList";
import EventSelectingContext from "@/contexts/event/eventSelectingContext";

export default function EventDropArea() {

    const {event, updateEvent} = useContext(EventContext);
    const {dragging, setDragging} = useContext(EventDraggingContext);
    const {selecting, setSelecting} = useContext(EventSelectingContext);

    const [bounds, setBounds] = useState({x: 0, y: 0, w: 0, h: 0})
    const ref = useRef(null);

    useEffect(() => {
        if(ref.current) {
            const rect = ref.current.getBoundingClientRect();
            setBounds({
                x: rect.left,
                y: rect.top,
                w: rect.width,
                h: rect.height
            })
        }
    }, [])

    const dropEvent = (e) => {
        if(Object.keys(dragging).length !== 0){
            let offsetX = dragging.mouseX;
            let offsetY = dragging.mouseY;
            let newEvent = {...event};
            let eBounds = dragging.bounds;
            eBounds.x = e.pageX - offsetX - bounds.x;
            eBounds.y = e.pageY - offsetY - bounds.y;
            newEvent.actions[self.crypto.randomUUID()] = {
                type: dragging.type,
                bounds: eBounds,
                parents: dragging.parent,
                children: dragging.child,
                selector: dragging.selector,
                lacalVariables: dragging.localVariables
            }

            updateEvent(newEvent);
            setDragging({});
        }
    }

    const areaStyle = { 
        width: '100%', 
        height: '100%', 
        backgroundColor: 'lightblue', 
        position: "relative",
        overflow: "hidden"
    }

    return (
        <div style={areaStyle} onDrop={dropEvent} onDragOver={(e) => {e.preventDefault()}} ref={ref} onClick={() => {setSelecting("")}}>
            {Object.entries(event.actions).map(([aid, action]) => {
                const Component = eventMap[action.type];
                return (
                    <span style={{position: "absolute", left: action.bounds.x + "px", top: action.bounds.y + "px"}} key={aid}>
                        <Component action={action} id={aid}/>
                    </span>)
            })}
        </div>
    )
}
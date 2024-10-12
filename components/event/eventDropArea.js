"use client"

import { useEffect, useRef, useState } from "react"
import { actionMap } from "./eventList";

export default function EventDropArea({event, selecting,  updateEvent, dragging, setDragging, setSelecting}) {

    const [bounds, setBounds] = useState({x: 0, y: 0, w: 0, h: 0})
    const [mouseOver, setMouseOver] = useState("");

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
            let eBounds = dragging.bounds;
            eBounds.x = e.pageX - offsetX - bounds.x;
            eBounds.y = e.pageY - offsetY - bounds.y;
            updateEvent({
                ...event,
                ["actions"]: {
                    ...event.actions,
                    [self.crypto.randomUUID().replace(/-/g, "")] : {
                        type: dragging.type,
                        bounds: eBounds,
                        parents: dragging.parent,
                        children: dragging.child,
                        selector: dragging.selector,
                        lacalVariables: dragging.localVariables
                    }
                }
            });
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
                    const Component = actionMap[action.type];
                    return (
                        <span style={{position: "absolute", left: action.bounds.x + "px", top: action.bounds.y + "px"}} key={aid}>
                            <Component action={action} id={aid} selecting={selecting} setSelecting={setSelecting}
                                event={event} updateEvent={updateEvent} mouseOver={mouseOver} setMouseOver={setMouseOver}
                            />
                        </span>)
                })}
        </div>
    )
}
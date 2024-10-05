import EventDraggingContext from "@/contexts/event/eventDraggingContext"
import EventSelectingContext from "@/contexts/event/eventSelectingContext"
import { useContext, useEffect, useReducer, useRef, useState } from "react"

import EventContext from "@/contexts/event/eventContext"
import Arrow from "./arrow"


export default function EventList({ params }) {
    return (
        <div style={{ display: "flex", "justifyContent": "center" }}>
            <div className="row" style={{ width: '80%', margin: '0 auto' }}>
                <ListGetEvent />
            </div>
        </div>
    )
}

export const eventMap = {
    "GET": GetEvent
}

function EventBase({ children, id, action, color }) {

    const { selecting, setSelecting } = useContext(EventSelectingContext);
    const {event, updateEvent} = useContext(EventContext);

    const [mousePos, setMousePos] = useState({x: 0, y: 0});
    const [arrowEndPos, setArrowEndPos] = useState({x: 0, y: 0});

    const select = (e) => {
        e.stopPropagation();
        setSelecting(id);
    }

    const moveStart = (e) => {
        setMousePos({x: e.pageX, y: e.pageY});
    }

    const moveEnd = (e) => {
        let dx = e.pageX - mousePos.x;
        let dy = e.pageY - mousePos.y;
        let newEvent = {...event};
        newEvent.actions[id].bounds.x += dx;
        newEvent.actions[id].bounds.y += dy;
        updateEvent(newEvent);
    }

    const arrowStart = (e) => {
        setMousePos({x: e.pageX, y: e.pageY});
    }

    const arrowEnd = (e) => {
        let dx = e.pageX - mousePos.x;
        let dy = e.pageY - mousePos.y;
        setArrowEndPos({x: dx, y: dy});
    }

    return (
        <div>
            <div style={{position: "relative", left: (event.actions[id].bounds.w / 2) + "px", top: event.actions[id].bounds.h + "px"}}>
                {selecting == id && (
                    <div style={{zIndex: "9", width:"14px", height: "14px", borderRadius: "50%", backgroundColor: "blue", position: "absolute", left: "-7px", top: "-7px"}}
                    onDragStart={arrowStart} onDragEnd={arrowEnd} draggable>
                    </div>
                )}
                <Arrow start={{x: 0, y: 0}} end={{x: arrowEndPos.x, y: arrowEndPos.y}} />
            </div>
            <div onClick={select} onDragStart={moveStart} onDragEnd={moveEnd} draggable
                style={{ width: action.bounds.w + "px", height: action.bounds.h + "px", backgroundColor: color, zIndex: "5"}}>
                {children}
            </div>
        </div>
    )
}

function ListEventBase({ children, type, color }) {

    const { dragging, setDragging } = useContext(EventDraggingContext);

    const [bounds, setBounds] = useState({ x: 0, y: 0, w: 0, h: 0 });
    const ref = useRef(null);

    useEffect(() => {
        if (ref.current) {
            const rect = ref.current.getBoundingClientRect();
            setBounds({
                x: rect.left,
                y: rect.top,
                w: rect.width,
                h: rect.height
            })
        }
    }, [])

    const onDragStrat = (e) => {

        let mouseX = e.pageX - bounds.x;
        let mouseY = e.pageY - bounds.y;

        setDragging({
            type: type,
            bounds: { x: 0, y: 0, w: bounds.w, h: bounds.h },
            parent: "",
            child: "",
            selector: [],
            lacalVariables: {},
            mouseX: mouseX,
            mouseY: mouseY
        });
    }

    return (
        <div style={{ border: "1px solid black", backgroundColor: color }} onDragStart={onDragStrat} draggable ref={ref}>
            {children}
        </div>
    )
}

function ListGetEvent() {
    return (
        <ListEventBase type="GET" color="yellow">
            <h4>GET</h4>
        </ListEventBase>
    )
}

function GetEvent({ action, id }) {
    return (
        <EventBase action={action} id={id} color="yellow">
            <h4>GET</h4>
        </EventBase>
    )
}
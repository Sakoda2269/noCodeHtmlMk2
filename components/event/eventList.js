"use client"
import { useEffect, useRef, useState } from "react"
import Arrow from "./arrow"


export default function EventList({ setDragging}) {
    return (
        <div style={{ display: "flex", "justifyContent": "center" }}>
            <div className="row" style={{ width: '80%', margin: '0 auto' }}>
                <ListStartAction setDragging={setDragging}/>
                <p></p>
                <ListGetAction setDragging={setDragging}/>
            </div>
        </div>
    )
}

export const actionMap = {
    "START": StartAction,
    "GET": GetAction,
}

function ActionBase({ children, id, action, color, selecting, setSelecting, event, updateEvent, mouseOver, setMouseOver }) {

    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [arrowEndPos, setArrowEndPos] = useState({ x: 0, y: 0 });

    useEffect(() => {
        replaceArrow(event);
    }, [event])

    const select = (e) => {
        e.stopPropagation();
        setSelecting(id);
    }

    const moveStart = (e) => {
        setMousePos({ x: e.pageX, y: e.pageY });
    }

    const moveEnd = (e) => {
        let dx = e.pageX - mousePos.x;
        let dy = e.pageY - mousePos.y;
        if (event.actions[id].bounds.x + dx < 0 || event.actions[id].bounds.y + dy < 0) {
            return
        }
        let newEvent = { ...event };
        newEvent.actions[id].bounds.x += dx;
        newEvent.actions[id].bounds.y += dy;
        updateEvent(newEvent);
    }

    const arrowStart = (e) => {
        setMousePos({ x: e.pageX, y: e.pageY });
    }

    const arrowDragging = (e) => {
        let dx = e.pageX - mousePos.x;
        let dy = e.pageY - mousePos.y;
        setArrowEndPos({ x: dx, y: dy });
    }

    const replaceArrow = (event) => {
        if (event.actions[id].children != "") {
            let ix = event.actions[id].bounds.x;
            let iy = event.actions[id].bounds.y;
            let iw = event.actions[id].bounds.w;
            const child = event.actions[id].children;
            let cx = event.actions[child].bounds.x;
            let cy = event.actions[child].bounds.y;
            let cw = event.actions[child].bounds.w;
            let ch = event.actions[child].bounds.h;
            setArrowEndPos({
                x: (cx + cw / 2) - (ix + iw / 2),
                y: (cy - iy - ch)
            })
        } else {
            setArrowEndPos({ x: 0, y: 0 })
        }

    }

    const arrowEnd = (e) => {
        if (mouseOver != "" && mouseOver != id) {
            const parent = id;
            const child = mouseOver;
            let newEvent = { ...event };

            newEvent.actions[parent].children = child;
            let oldParent = newEvent.actions[child].parents;
            if (oldParent != "" && oldParent != parent) {
                newEvent.actions[oldParent].children = "";
            }
            newEvent.actions[child].parents = parent;


            updateEvent(newEvent);
            replaceArrow(newEvent);
        }
        else {
            const parent = id;
            const child = event.actions[parent].children;
            let newEvent = { ...event };
            if (child != "") {
                newEvent.actions[parent].children = "";
                newEvent.actions[child].parents = "";
            }
            updateEvent(newEvent);
            replaceArrow(newEvent);
        }

    }

    const onMouseEnter = (e) => {
        e.preventDefault();
        setMouseOver(id);
    }

    const onMouseLeave = (e) => {
        setMouseOver("");
    }

    const mouseOverStyle = {
        true: { border: "solid 2px green" }
    }

    const selectStyle = {
        true: { border: "solid 3px black" },
        false: { border: "solid 1px black" }
    }

    return (
        <div style={selectStyle[selecting == id]}>
            <div style={{ position: "relative", left: (event.actions[id].bounds.w / 2) + "px", top: event.actions[id].bounds.h + "px", width: "0px", height: "0px" }}>
                {selecting == id && (
                    <div style={{
                        zIndex: "9", width: "14px", height: "14px", borderRadius: "50%", backgroundColor: "blue", position: "absolute", left: "-7px", top: "-7px"
                        ,
                    }}
                        onDragStart={arrowStart} onDragEnd={arrowEnd} onDrag={arrowDragging} draggable>
                    </div>
                )}
                <Arrow start={{ x: 0, y: 0 }} end={{ x: arrowEndPos.x, y: arrowEndPos.y }} />
            </div>
            <div onClick={select} onDragStart={moveStart} onDragEnd={moveEnd} onDragLeave={onMouseLeave} onDragOver={onMouseEnter}
                onMouseLeave={onMouseLeave} draggable
                style={{ width: action.bounds.w + "px", height: action.bounds.h + "px", backgroundColor: color, zIndex: "5", ...mouseOverStyle[id == mouseOver] }}
            >
                {children}
            </div>
        </div>
    )
}

function ListActionBase({ children, type, color, selector, setDragging }) {

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
            selector: selector,
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

function ListStartAction({setDragging}) {

    const selector = {
        inTypes: [],
        outTypes: [],
        in: [],
        out: []
    }

    return (
        <ListActionBase type="START" color="yellow" selector={selector} setDragging={setDragging}>
            <h4>START</h4>
        </ListActionBase>
    )
}

function StartAction({ action, id, selecting, setSelecting, event, updateEvent, mouseOver, setMouseOver }) {
    return (
        <ActionBase action={action} id={id} color="yellow" selecting={selecting} setSelecting={setSelecting} event={event} 
            updateEvent={updateEvent} mouseOver={mouseOver} setMouseOver={setMouseOver}>
            <h4>START</h4>
        </ActionBase>
    )
}

function ListGetAction({setDragging}) {
    const selector = {
        inTypes: ["id", "variable", "constant"],
        outTypes: ["id", "variable"],
        in: [{ type: "id", value: "" }],
        out: [{ type: "id", value: "" }]
    }
    return (
        <ListActionBase type="GET" color="yellow" selector={selector} setDragging={setDragging}>
            <h4>GET</h4>
        </ListActionBase>
    )
}

function GetAction({ action, id, selecting, setSelecting, event, updateEvent, mouseOver, setMouseOver }) {
    return (
        <ActionBase action={action} id={id} color="yellow" selecting={selecting} setSelecting={setSelecting} event={event} 
            updateEvent={updateEvent} mouseOver={mouseOver} setMouseOver={setMouseOver}>
            <h4>GET</h4>
        </ActionBase>
    )
}
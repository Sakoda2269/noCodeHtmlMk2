"use client"

import DesignContext from "@/contexts/design/designContext";
import ElementDraggingContext from "@/contexts/design/elementDraggingContext"
import { useContext, useEffect, useRef, useState } from "react"
import { elementsMap } from "./elementsList";
import ElementSelectingContext from "@/contexts/design/elementSelectingContext";
import UndoContext from "@/contexts/undoContext";

export default function ElementsDropArea({ pid }) {

    const { dragging, setDragging } = useContext(ElementDraggingContext);
    const { design, updateDesign } = useContext(DesignContext);
    const { selecting, setSelecting } = useContext(ElementSelectingContext);
    const { undoStack, pushUndo } = useContext(UndoContext);

    const [pos, setPos] = useState({ x: 0, y: 0 });
    const ref = useRef(null);

    useEffect(() => {
        if (ref.current) {
            const rect = ref.current.getBoundingClientRect();
            setPos({ x: rect.left, y: rect.top });
        }
        setDragging({})
    }, [])

    const areaStyle = {
        width: '100%',
        height: '100%',
        backgroundColor: 'lightblue',
        position: "relative",
        overflow: "hidden"
    }

    const dropElements = (e) => {
        e.stopPropagation();
        e.preventDefault();
        if (Object.keys(dragging).length !== 0) {
            const id = dragging.id;
            const offsetX = dragging.mouseX;
            const offsetY = dragging.mouseY;
            const x = e.pageX - offsetX - pos.x;
            const y = e.pageY - offsetY - pos.y;
            let props = dragging.props;
            props.bounds.x = { type: "number", value: x };
            props.bounds.y = { type: "number", value: y };
            props.bounds.w = { type: "number", value: props.bounds.w.value };
            props.bounds.h = { type: "number", value: props.bounds.h.value };
            updateDesign({
                ...design,
                ["elements"]: {
                    ...design.elements,
                    [id]: {
                        type: dragging.type,
                        props: props,
                        events: dragging.events
                    }
                }
            });
            pushUndo({
                action: "createElement",
                id: id, 
                value: {
                    type: dragging.type,
                    props: props,
                    events: dragging.events
                }
            })
            setDragging({});
        }

    }

    return (
        <div style={areaStyle} onDrop={dropElements} onClick={(e) => { setSelecting("") }} onDragOver={(e) => { e.preventDefault() }} ref={ref}>
            {Object.entries(design.elements).map(([id, value]) => {
                const Component = elementsMap[value.type];
                return (
                    <span key={id} style={{ position: "absolute", left: `${value.props.bounds.x.value}px`, top: `${value.props.bounds.y.value}px` }}>
                        <Component id={id} element={value} />
                    </span>
                )
            })}
        </div>
    )
}
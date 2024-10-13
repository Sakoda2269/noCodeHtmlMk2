"use client"

import { useEffect, useRef, useState } from "react"
import { AllComponent } from "./elementsList";

export default function ElementsDropArea({ dragging, setDragging, selecting, design, updateDesign, setSelecting, pushUndo }) {

    const ref = useRef(null);

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
        if(!ref.current) {
            return;
        }
        if (Object.keys(dragging).length !== 0) {
            const rect = ref.current.getBoundingClientRect();
            const id = dragging.id;
            const offsetX = dragging.mouseX;
            const offsetY = dragging.mouseY;
            const x = e.pageX - offsetX - rect.left;
            const y = e.pageY - offsetY - rect.top;
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
                return (
                    <span key={id} style={{ position: "absolute", left: `${value.props.bounds.x.value}px`, top: `${value.props.bounds.y.value}px` }}>
                        <AllComponent type={value.type} id={id} element={value} selecting={selecting} setSelecting={setSelecting}
                design={design} updateDesign={updateDesign} pushUndo={pushUndo}/>
                    </span>
                )
            })}
        </div>
    )
}
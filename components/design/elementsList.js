"use client"

import DesignContext from "@/contexts/design/designContext";
import ElementDraggingContext from "@/contexts/design/elementDraggingContext";
import ElementSelectingContext from "@/contexts/design/elementSelectingContext";
import UndoContext from "@/contexts/undoContext";
import { useContext, useEffect, useRef, useState } from "react";

export default function ElementsList({ pid }) {
    return (
        <div style={{ display: "flex", "justifyContent": "center" }}>
            <div className="row" style={{ width: '80%', margin: '0 auto' }}>
                <ListButtonElement />
                <p></p>
                <ListTextInputElement />
                <p></p>
                <ListLabelElement />
            </div>
        </div>
    );
}

export const elementsMap = {
    "button": ButtonElement,
    "textInput": TextInputElement,
    "label": LabelElement
}

function ElementsBase({ children, id, element }) {

    const { selecting, setSelecting } = useContext(ElementSelectingContext);
    const { design, updateDesign } = useContext(DesignContext);
    const { undoStack, pushUndo } = useContext(UndoContext);

    const [isSelecting, setIsSelecting] = useState(false);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [sizeSqPos, setSizeSqPos] = useState(
        [
            { x: -5, y: -5 },
            { x: element.props.bounds.w.value - 5, y: -5 },
            { x: element.props.bounds.w.value - 5, y: element.props.bounds.h.value - 5 },
            { x: -5, y: element.props.bounds.h.value - 5 }
        ]
    );

    useEffect(() => {
        setIsSelecting(selecting == id);
        resetSizeSqPos();
    }, [selecting, design])

    const resetSizeSqPos = () => {
        setSizeSqPos(
            [
                { x: -5, y: -5 },
                { x: element.props.bounds.w.value - 5, y: -5 },
                { x: element.props.bounds.w.value - 5, y: element.props.bounds.h.value - 5 },
                { x: -5, y: element.props.bounds.h.value - 5 }
            ]
        );
    }

    const select = (e) => {
        e.stopPropagation();
        setSelecting(id);
    }

    const onMoveStart = (e) => {
        setMousePos({ x: e.pageX, y: e.pageY });
    }

    const onMoveEnd = (e) => {
        let dx = e.pageX - mousePos.x;
        let dy = e.pageY - mousePos.y;
        pushUndo({
            action: "moveElement",
            id: id,
            from: {x: element.props.bounds.x.value, y: element.props.bounds.y.value},
            to: {x: element.props.bounds.x.value + dx, y: element.props.bounds.y.value + dy}
        })
        element.props.bounds.x.value += dx;
        element.props.bounds.y.value += dy;
        let newDesign = { ...design };
        newDesign.elements[id] = element;
        updateDesign(newDesign);
    }

    const sizeChangeStart = (e) => {
        setMousePos({ x: e.pageX, y: e.pageY });
    }

    const sizeChanging = (e, num) => {
        let dx = e.pageX - mousePos.x;
        let dy = e.pageY - mousePos.y;
        setMousePos({ x: e.pageX, y: e.pageY });
        let newSizeSqPos = [...sizeSqPos];
        newSizeSqPos[num].x += dx;
        newSizeSqPos[num].y += dy;
        const xy = [(num + 3) % 4, (num + 1) % 4]
        const xChange = xy[num % 2];
        const yChange = xy[(num + 1) % 2];
        newSizeSqPos[xChange].x += dx;
        newSizeSqPos[yChange].y += dy;

        setSizeSqPos(newSizeSqPos);
    }

    const sizeChangeEnd = (e) => {
        let dx = sizeSqPos[0].x + 5;
        let dy = sizeSqPos[0].y + 5;
        let dw = sizeSqPos[2].x - sizeSqPos[0].x;
        let dh = sizeSqPos[2].y - sizeSqPos[0].y;
        element.props.bounds.x.value += dx;
        element.props.bounds.y.value += dy;
        element.props.bounds.w.value = dw;
        element.props.bounds.h.value = dh;
        let newDesign = { ...design };
        newDesign.elements[id] = element;
        updateDesign(newDesign);
        resetSizeSqPos();
    }

    const sizeSq = (num) => {
        const style = {
            width: "10px",
            height: "10px",
            backgroundColor: "blue",
            position: "absolute",
            left: sizeSqPos[num].x + "px",
            top: sizeSqPos[num].y + "px"
        }
        return (<div style={style} onDragStart={sizeChangeStart} onDrag={(e) => sizeChanging(e, num)} onDragEnd={sizeChangeEnd} draggable="true"></div>)
    }

    const line = (num) => {

        let num1 = [0, 1, 3, 0][num];
        let num2 = [1, 2, 2, 3][num];

        const style = {
            position: "absolute",
            backgroundColor: "black",
            left: (sizeSqPos[num1].x + 4) + "px",
            top: (sizeSqPos[num1].y + 4) + "px",
            width: Math.max((sizeSqPos[num2].x - sizeSqPos[num1].x), 2) + "px",
            height: Math.max((sizeSqPos[num2].y - sizeSqPos[num1].y), 2) + "px",
        }
        return (<div style={style}></div>)
    }

    return (
        <div>
            <div style={{ width: element.props.bounds.w.value + "px", height: element.props.bounds.h.value + "px" }} onClick={select} draggable="true" onDragStart={onMoveStart} onDragEnd={onMoveEnd}>
                {children}
            </div>
            {isSelecting ? (
                <div>
                    {line(0)}
                    {line(1)}
                    {line(2)}
                    {line(3)}
                    {sizeSq(0)}
                    {sizeSq(1)}
                    {sizeSq(2)}
                    {sizeSq(3)}
                </div>
            ) : (
                <></>
            )}
        </div>
    )
}

function ListElementBase({ children, type, general, style, additionalProps, events }) {

    const { dragging, setDragging } = useContext(ElementDraggingContext);
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
            });
        }
    }, [])

    const onDragStart = (e) => {
        const props = {
            bounds: {
                x: { type: "number", value: 0 },
                y: { type: "number", value: 0 },
                w: { type: "number", value: bounds.w },
                h: { type: "number", value: bounds.h }
            },
            style: style ? style : {},
            general: general ? general : {},
            ...additionalProps
        }
        let id = self.crypto.randomUUID().replace(/-/g, "");
        let mouseX = e.pageX - bounds.x;
        let mouseY = e.pageY - bounds.y;
        setDragging({
            id: id,
            type: type,
            props: props,
            events: events,
            mouseX: mouseX,
            mouseY: mouseY
        });
    }

    return (
        <div draggable="true" onDragStart={onDragStart} ref={ref}>
            {children}
        </div>
    )
}

function ListButtonElement() {

    return (
        <ListElementBase type="button" general={{ text: { type: "string", value: "ボタン" }, className: { type: "string", value: "btn btn-primary" } }} events={{ onClick: "" }}>
            <button className="btn btn-primary">ボタン</button>
        </ListElementBase>
    )
}

function ButtonElement({ id, element }) {

    const style = {
        width: "100%",
        height: "100%"
    };

    Object.entries(element.props.style).map(([key, value]) => {
        style[key] = value.value;
    });

    return (
        <ElementsBase id={id} element={element}>
            <button className={element.props.general.className.value} style={style}>
                {element.props.general.text.value}
            </button>
        </ElementsBase>
    )
}

function ListTextInputElement() {
    return (
        <ListElementBase type="textInput" general={{ value: { type: "string", value: "入力欄" }, className: { type: "string", value: "form-control border-secondary" } }} events={{ onChange: "" }}>
            <input type="text" className="form-control border-secondary" value="入力欄" readOnly="readOnly" />
        </ListElementBase>
    )
}

function TextInputElement({ id, element }) {
    const style = {
        width: "100%",
        height: "100%",
    };

    Object.entries(element.props.style).map(([key, value]) => {
        style[key] = value.value;
    });

    return (
        <ElementsBase id={id} element={element}>
            <input type="text" className={element.props.general.className.value} style={style} value={element.props.general.value.value} readOnly="readOnly" />
        </ElementsBase>
    )

}

function ListLabelElement() {
    return (
        <ListElementBase type="label" general={{ text: { type: "string", value: "テキストラベル" }, className: { type: "string", value: "form-label" } }} style={{ border: "1px solid black" }} events={{}}>
            <label className="form-label" style={{ border: "1px solid black" }}>テキストラベル</label>
        </ListElementBase>
    )
}

function LabelElement({ id, element }) {
    const style = {
        width: "100%",
        height: "100%",
    };

    Object.entries(element.props.style).map(([key, value]) => {
        style[key] = value.value;
    });

    return (
        <ElementsBase id={id} element={element}>
            <label className={element.props.general.className.value} style={style}>
                {element.props.general.text.value}
            </label>
        </ElementsBase>
    )
}

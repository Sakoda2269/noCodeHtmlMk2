"use client"

import ElementPropertyArea from "@/components/design/elementPropertyArea";
import ElementsDropArea from "@/components/design/elementsDropArea";
import ElementsList from "@/components/design/elementsList";
import Popup from "@/components/popup";
import ProjectContext from "@/contexts/project/projectContext"
import Link from "next/link";
import { useContext, useEffect, useState } from "react"

export default function Design({ params }) {

    const { project, updateProject } = useContext(ProjectContext);

    const [design, setDesign] = useState(project.pages[params.page].design);
    const [isOpen, setIsOpen] = useState(false); 
    const [selecting, setSelecting] = useState("");
    const [dragging, setDragging] = useState({
        id: "",
        type: "",
        props: {},
        events: {},
        mouseX: 0,
        mouseY: 0
    });

    const [undoStack, setUndoStack] = useState([]);
    const [redoAction, setRedo] = useState({});

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

    const pushUndo = (action) => {
        let newUndo = [...undoStack, action];
        setRedo({});
        setUndoStack(newUndo);
    }

    const undo = (e) => {
        if(undoStack.length == 0) {
            return;
        }
        console.log(undoStack)
        const lastAction = undoStack[undoStack.length - 1];
        setUndoStack(undoStack.slice(0, -1));
        const id = lastAction.id;
        let nextDesign = null;
        setRedo(lastAction);
        switch(lastAction.action) {
            case "createElement":
                setSelecting("");
                const {[id]: tmp, ...nextelements} = design.elements;
                console.log(nextelements)
                updateDesign({...design, ["elements"]: nextelements});
                break;
            case "moveElement":
                const prev = lastAction.from;
                nextDesign = {...design};
                nextDesign.elements[id].props.bounds.x.value = prev.x;
                nextDesign.elements[id].props.bounds.y.value = prev.y;
                updateDesign(nextDesign);
                break;
            case "deleteElement":
                const elem = lastAction.data;
                nextDesign = {...design};
                nextDesign.elements[id] = elem;
                updateDesign(nextDesign);
                break;
            case "changeSize":
                const prev1 = lastAction.prev;
                nextDesign = {...design};
                nextDesign.elements[id].props.bounds.x.value = prev1.x;
                nextDesign.elements[id].props.bounds.w.value = prev1.w;
                nextDesign.elements[id].props.bounds.h.value = prev1.h;
                nextDesign.elements[id].props.bounds.y.value = prev1.y;
                updateDesign(nextDesign);
                break;
        }
    }

    const redo = (e) => {
        if(Object.keys(redoAction).length == 0) {
            return;
        }
        setRedo({});
        pushUndo(redoAction);
        const id = redoAction.id;
        let nextDesign = null;
        switch(redoAction.action) {
            case "createElement":
                nextDesign = {...design};
                nextDesign.elements[id] = redoAction.value;
                updateDesign(nextDesign);
                break;
            case "moveElement":
                const next = redoAction.to;
                nextDesign = {...design};
                nextDesign.elements[id].props.bounds.x.value = next.x;
                nextDesign.elements[id].props.bounds.y.value = next.y;
                updateDesign(nextDesign);
                break;
            case "deleteElement":
                const {[id]: tmp, ...other} = design.elements;
                setSelecting("");
                updateDesign({
                    ...design,
                    ["elements"]: other
                })
                break;
            case "changeSize":
                const next1 = redoAction.next;
                nextDesign = {...design};
                nextDesign.elements[id].props.bounds.x.value = next1.x;
                nextDesign.elements[id].props.bounds.w.value = next1.w;
                nextDesign.elements[id].props.bounds.h.value = next1.h;
                nextDesign.elements[id].props.bounds.y.value = next1.y;
                updateDesign(nextDesign);
                break;
    }
    }

    const updateDesign = (newDesign) => {
        setDesign(newDesign);
    }

    const saveDesign = async (e) => {
        let newProject = { ...project };
        newProject.pages[params.page].design = design;
        updateProject(newProject);
        setUndoStack([]);
        setRedo({});
        const res = await fetch(`/api/saveProjects/${params.pid}/pages/${params.page}/design`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(design)
        });
    }

    return (
        <div>
            <div className="menu-bar">
                {undoStack.length != 0 ? <button onClick={() => {setIsOpen(true)}}>top</button> : <Link href={`/projects/${params.pid}/${params.page}`}>
                    <button>top</button>
                </Link>}
                {undoStack.length != 0 ? <button onClick={saveDesign}>save</button> : <button disabled>save</button>}
                {undoStack.length != 0 ? <button onClick={undo}>undo</button> : <button disabled>undo</button>}
                {Object.keys(redoAction).length != 0 ? <button onClick={redo}>redo</button> : <button disabled>redo</button>}
            </div>

            <div className="row" style={{ height: "100vh" }}>
                <div className="col-2" style={{ border: "1px solid black", padding: "10px" }}>
                    <ElementsList setDragging={setDragging} />
                </div>
                <div className="col-7" style={{ border: "1px solid black", padding: "10px" }}>
                    <ElementsDropArea dragging={dragging} selecting={selecting} setDragging={setDragging} design={design} 
                        updateDesign={updateDesign} setSelecting={setSelecting} pushUndo={pushUndo}
                        />
                </div>
                <div className="col-3" style={{ border: "1px solid black", padding: "10px" }}>
                    <ElementPropertyArea page={params.page} design={design} updateDesign={updateDesign} selecting={selecting} 
                        setSelecting={setSelecting} pushUndo={pushUndo}
                    />
                </div>
            </div>

            <Popup isOpen={isOpen}>
                <div>
                    <h4>保存前にページを離れると変更が失われます。</h4>
                    <br />
                    <div className="row justify-content-between">
                        <div className="col">
                            <Link href={`/projects/${params.pid}/${params.page}`}>
                                <button className="btn btn-primary" onClick={()=>{saveDesign()}}>保存して終了</button>
                            </Link>
                        </div>
                        <div className="col">
                            <Link href={`/projects/${params.pid}/${params.page}`}>
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
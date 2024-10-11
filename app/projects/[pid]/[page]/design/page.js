"use client"

import ElementPropertyArea from "@/components/design/elementPropertyArea";
import ElementsDropArea from "@/components/design/elementsDropArea";
import ElementsList from "@/components/design/elementsList";
import Popup from "@/components/popup";
import DesignContext from "@/contexts/design/designContext";
import ElementDraggingContext from "@/contexts/design/elementDraggingContext";
import ElementSelectingContext from "@/contexts/design/elementSelectingContext";
import ProjectContext from "@/contexts/project/projectContext"
import Link from "next/link";
import { useContext, useEffect, useState } from "react"

export default function Design({ params }) {


    const { project, updateProject } = useContext(ProjectContext);
    const [design, setDesign] = useState(project.pages[params.page].design);

    const [isOpen, setIsOpen] = useState(false); 

    const [dragging, setDragging] = useState({
        id: "",
        type: "",
        props: {},
        events: {},
        mouseX: 0,
        mouseY: 0
    });
    const [selecting, setSelecting] = useState("");

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


    const updateDesign = (newDesign) => {
        setDesign(newDesign);
    }

    const saveDesign = async (e) => {
        let newProject = { ...project };
        newProject.pages[params.page].design = design;
        updateProject(newProject);

        const res = await fetch(`/api/saveProjects/${params.pid}/pages/${params.page}/design`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(design)
        });
    }

    return (
        <div>
            <div className="menu-bar">
                <button onClick={() => {setIsOpen(true)}}>top</button>
                <button onClick={saveDesign}>save</button>
            </div>
            <DesignContext.Provider value={{ design, updateDesign }}>
                <ElementSelectingContext.Provider value={{ selecting, setSelecting }}>
                    <ElementDraggingContext.Provider value={{ dragging, setDragging }}>
                        <div className="row" style={{ height: "100vh" }}>
                            <div className="col-2" style={{ border: "1px solid black", padding: "10px" }}>
                                <ElementsList pid={params.pid} />
                            </div>
                            <div className="col-7" style={{ border: "1px solid black", padding: "10px" }}>
                                <ElementsDropArea pid={params.pid} />
                            </div>
                            <div className="col-3" style={{ border: "1px solid black", padding: "10px" }}>
                                <ElementPropertyArea pid={params.pid} page={params.page} />
                            </div>
                        </div>
                    </ElementDraggingContext.Provider>
                </ElementSelectingContext.Provider>
            </DesignContext.Provider>

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
"use client"

import ElementPropertyArea from "@/components/design/elementPropertyArea";
import ElementsDropArea from "@/components/design/elementsDropArea";
import ElementsList from "@/components/design/elementsList";
import DesignContext from "@/contexts/design/designContext";
import ElementDraggingContext from "@/contexts/design/elementDraggingContext";
import ElementSelectingContext from "@/contexts/design/elementSelectingContext";
import ProjectContext from "@/contexts/project/projectContext"
import ProjectsContext from "@/contexts/project/projectsContext";
import Link from "next/link";
import { useContext, useState } from "react"

export default function Design({params}){

    const [dragging, setDragging] = useState({
        id: "",
        type: "",
        props: {},
        events: {},
        mouseX: 0,
        mouseY: 0
    });
    const [selecting, setSelecting] = useState("");


    return (
        <div>
            <div className="menu-bar">
                <Link href={`/projects/${params.pid}/${params.page}`}>
                    <button>top</button>
                </Link>
                <Link href={`/projects/${params.pid}/${params.page}/events`}>
                    <button>events</button>
                </Link>
            </div>
                <ElementSelectingContext.Provider value={{selecting, setSelecting}}>
                    <ElementDraggingContext.Provider value={{dragging, setDragging}}>
                        <div className="row" style={{ height: "100vh" }}>
                            <div className="col-2" style={{border:"1px solid black", padding: "10px"}}>
                                <ElementsList pid={params.pid}/>
                            </div>
                            <div className="col-7" style={{border:"1px solid black", padding: "10px"}}>
                                <ElementsDropArea pid={params.pid}/>
                            </div>
                            <div className="col-3" style={{border:"1px solid black", padding: "10px"}}>
                                <ElementPropertyArea pid={params.pid}/>
                            </div>
                        </div>
                    </ElementDraggingContext.Provider>
                </ElementSelectingContext.Provider>

        </div>
    )
}
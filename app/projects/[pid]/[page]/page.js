"use client"
import ProjectContext from "@/contexts/project/projectContext";
import ProjectsContext from "@/contexts/project/projectsContext";
import Link from "next/link";
import { useContext, useState } from "react"


export default function Project({params}){

    const {project, updateProject} = useContext(ProjectContext);

    const exportModel = (e) => {
        let widgets = {};
        const design = project.pages[params.page].design;
        Object.entries(design.elements).map(([eid, element]) => {
            let text = "";
            if(element.props.general.text) {
                text = element.props.general.text.value;
            }else if(element.props.general.value) {
                text = element.props.general.value.value;
            }
            widgets[eid] = {
                type: element.type,
                text: text,
                state: 0,
                x: element.props.bounds.x.value,
                y: element.props.bounds.y.value,
                width: element.props.bounds.w.value,
                height: element.props.bounds.h.value,
            }
        })
        const blob = new Blob([constructModel(widgets)], {type: "text/plain"})
        const downloadLink = document.createElement("a");

        downloadLink.href = URL.createObjectURL(blob);

        downloadLink.download = project.pages[params.page].title + ".model";

        downloadLink.click();

        // メモリリークを防ぐためにBlob URLを解放
        URL.revokeObjectURL(downloadLink.href);
    }

    return(
        <div>
            <div className="menu-bar">
                <Link href={`/projects/${params.pid}`}>
                    <button>project</button>
                </Link>
                <Link href={`/projects/${params.pid}/${params.page}/design`}>
                    <button>design</button>
                </Link>
                <Link href={`/projects/${params.pid}/${params.page}/events`}>
                    <button>events</button>
                </Link>
            </div>
            <div className="container" >
                <div style={{marginTop: "20px"}}>
                    <h3>{project.pages[params.page].title}</h3>
                </div>
                <div style={{marginTop: "20px"}}>
                    <h3>ページ設定</h3>
                </div>
                <div>
                    <button className="btn btn-primary" style={{marginTop: "20px"}} onClick={exportModel}>エクスポートする</button>
                </div>
            </div>
        </div>
    )
}

function constructModel(widgets) {
return `
init {
screen := {
        "widgets": ${JSON.stringify(widgets)}, 
        "layout": true
    }
}

native channel ScreenUpdate {
	in screen(curSc: Json, update(curSc, nextSc)) = nextSc
}

native channel SetLayout {
	in screen.layout(curLayout: Bool, setLayout(nextLayout)) = nextLayout
}

native channel SetVisible(wid: Str) {
	in screen.widgets.{wid}.visible(curVisible: Bool, setVisible(nextVisible)) = nextVisible
}

native channel SetText(wid: Str) {
	in screen.widgets.{wid}.text(curText: Str, setText(nextText)) = nextText
}

native channel MouseEvent(wid: Str) {
	out screen.widgets.{wid}.state(curState: Int, mouseEvent(nextState)) = nextState
}

native channel TextEvent(wid: Str) {
	out screen.widgets.{wid}.text(curText: Str, textEvent(nextText)) = nextText
}

channel AddTextInput {
	out screen.widgets(widgets: Map, addTextInput(wid: Str)) = insert(widgets, wid, {"type": "textInput", "text": "", "state": 0})
}
`
}
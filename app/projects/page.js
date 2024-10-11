"use client"

import Popup from "@/components/popup";
import ProjectsContext from "@/contexts/project/projectsContext"
import Link from "next/link";
import { useContext, useState } from "react"

export default function ProjectHub() {

    const {projects, updateProjects} = useContext(ProjectsContext);

    const [isOpen, setIsOpen] = useState(false);
    const [title, setTitle] = useState("");

    const onTitleChange = (e) => {
        setTitle(e.target.value);
    }

    const createProject = async () => {
        let newPid = self.crypto.randomUUID();
        setIsOpen(false);
        const tmp = {
            title: title,
            pages:{}
        }
        updateProjects({
            ...projects,
            [newPid]: tmp
        })

        const res = await fetch(`/api/saveProjects/${newPid}`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(tmp)
        });
    }

    const cancel = (e) => {
        setIsOpen(false);
        setTitle("");
    }

    return (
        <div>
            <div className="grid">
                <button className="btn btn-secondary" onClick={() => {setIsOpen(true)}}>
                    <p></p>
                    新規作成
                    <p></p>
                </button>
                {Object.keys(projects).map((pid) => (
                    <Link href={`/projects/${pid}`} key={pid}>
                        <button className="btn" style={{border: "1px solid black", width: "100%", height:"100%"}}>
                            {projects[pid].title}
                        </button>
                    </Link>
                ))}
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>

            <Popup isOpen={isOpen}>
                <div>
                    <label className="form-label">プロジェクト名</label>
                    <input type="text" onChange={onTitleChange} className="form-control border-secondary" /> 
                    {title=="" && <label className="form-label" style={{color:"red"}}>1文字以上入力してください</label>}
                </div>
                <p></p>
                <div style={{display: "flex", justifyContent: "flex-end"}}>
                    <button className="btn btn-secondary" onClick={cancel}>キャンセル</button>
                    {title!= "" ? (
                        <button className="btn btn-primary" style={{marginLeft: "10px"}} onClick={createProject}>決定</button>
                    ) : (
                        <button className="btn btn-primary" style={{marginLeft: "10px"}} disabled>決定</button>
                    )}
                </div>
            </Popup>

        </div>
    )
} 
"use client"

import Popup from "@/components/popup";
import ProjectsContext from "@/contexts/project/projectsContext"
import Link from "next/link";
import { useContext, useEffect, useState } from "react"

export default function ProjectHub() {

    const [projects, setProjects] = useState({})

    const [isOpen, setIsOpen] = useState(false);
    const [title, setTitle] = useState("");

    useEffect(() => {
        const getProjects = async () => {
            const res = await fetch("/api/getProjects", {method: "GET"});
            const datas  = await res.json();
            let tmp = {}
            Object.entries(datas).map(([key, value]) => {
                const id = value._id;
                const title = value.title;
                tmp[id] = title;
            })
            setProjects(tmp);
        };
        getProjects();
    }, [])

    const onTitleChange = (e) => {
        setTitle(e.target.value);
    }

    const createProject = async () => {
        let newPid = self.crypto.randomUUID();
        setProjects({
            ...projects,
            [newPid]: title
        })
        const res = await fetch(`/api/saveProjects/${newPid}`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                title: title,
                pages:{}
            })
        });
        setIsOpen(false);
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
                            {projects[pid]}
                        </button>
                    </Link>
                ))}
                <div></div><div></div><div></div><div></div>
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
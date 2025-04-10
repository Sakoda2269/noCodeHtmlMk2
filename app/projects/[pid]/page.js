"use client"

import Popup from "@/components/popup"
import ProjectContext from "@/contexts/project/projectContext";
import Link from "next/link";
import { useContext, useState } from "react";
import { Tab, Tabs } from "react-bootstrap";

export default function Pages({ params }) {

    const { project, updateProject } = useContext(ProjectContext);

    const [isOpen, setIsOpen] = useState(0);
    const [title, setTitle] = useState("");
    const [tabKey, setTabKey] = useState("pages");

    const onTitleChange = (e) => {
        setTitle(e.target.value);
    }

    const createPage = async (e) => {
        let newProject = { ...project };
        let page = self.crypto.randomUUID();
        const tmp = {
            title: title,
            design: {
                elements: {}
            },
            events: {
                globalVarialbes: [],
                event: {}
            }
        };
        newProject.pages[page] = tmp;
        updateProject(newProject);
        const res = await fetch(`/api/saveProjects/${params.pid}/pages/${page}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(tmp)
        });
        setIsOpen(0);
    }

    const cancel = (e) => {
        setTitle("");
        setIsOpen(0);
    }

    const deleteProject = (e) => {
        setIsOpen(0);
        fetch(`/api/deleteProjects/${params.pid}`, {method: "DELETE"});
    }

    return (
        <div>
            <div className="menu-bar">
                <Link href={`/projects`}>
                    <button>top page</button>
                </Link>
            </div>
            <div className="container" style={{ paddingTop: "10px" }}>
                <div>
                    <h3>{project.title}</h3>
                </div>
                <hr />
                <div>
                    <Tabs id="project-tab" activeKey={tabKey} onSelect={(k) => { setTabKey(k) }}>
                        <Tab eventKey="pages" title="pages">
                            <div className="grid">
                                <button className="btn btn-secondary" onClick={() => { setIsOpen(1) }}>
                                    <p></p>
                                    ページを作成
                                    <p></p>
                                </button>
                                {Object.keys(project.pages).map((page) => (
                                    <Link href={`/projects/${params.pid}/${page}`} key={page}>
                                        <button className="btn" style={{ border: "1px solid black", width: "100%", height: "100%" }}>
                                            {project.pages[page].title}
                                        </button>
                                    </Link>
                                ))}
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                            </div>
                        </Tab>
                        <Tab eventKey="setting" title="project setting">
                            <div className="container">
                                <button className="btn btn-danger" style={{margin: "20px"}} onClick={() => {setIsOpen(2)}}>プロジェクトを削除</button>
                            </div>
                        </Tab>
                    </Tabs>
                </div>
                <Popup isOpen={isOpen == 1}>
                    <div>
                        <label className="form-label">ページのタイトル</label>
                        <input type="text" onChange={onTitleChange} className="form-control border-secondary" />
                        {title == "" && <label className="form-label" style={{ color: "red" }}>1文字以上入力してください</label>}
                    </div>
                    <p></p>
                    <div style={{ display: "flex", justifyContent: "flex-end" }}>
                        <button className="btn btn-secondary" onClick={cancel}>キャンセル</button>
                        {title != "" ? (
                            <button className="btn btn-primary" style={{ marginLeft: "10px" }} onClick={createPage}>決定</button>
                        ) : (
                            <button className="btn btn-primary" style={{ marginLeft: "10px" }} disabled>決定</button>
                        )}
                    </div>
                </Popup>

                <Popup isOpen={isOpen == 2}>
                    <div>
                        <h4>本当に削除してもよろしいですか？</h4>
                        <p></p>
                        <p></p>
                        <div style={{ display: "flex", justifyContent: "flex-end" }}>
                            <button className="btn btn-secondary" style={{marginRight: "30px"}}
                                onClick={() => setIsOpen(0)}>キャンセル</button>
                                <Link href="/projects">
                                    <button className="btn btn-danger" onClick={deleteProject}>削除する</button>
                                </Link>
                        </div>
                    </div>
                </Popup>

            </div>
        </div>
    )
}
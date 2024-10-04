"use client"

import DesignContext from "@/contexts/design/designContext";
import ElementSelectingContext from "@/contexts/design/elementSelectingContext";
import { useContext, useEffect, useState } from "react";
import {Tab, Tabs} from "react-bootstrap";
import Popup from "../popup";

export default function ElementPropertyArea({pid}) {

    const {design, updateDesign} = useContext(DesignContext);
    const {selecting, setSelecting} = useContext(ElementSelectingContext);

    const [isOpen, setIsOpen] = useState(false);
    const [tabKey, setTabKey] = useState("general");
    const [newStyleName, setNewStyleName] = useState("");
    const [newStyleValue, setNewStyleValue] = useState("");
    const [newId, setNewId] = useState(selecting);

    useEffect(() => {
        setNewId(selecting);
    }, [selecting])

    const styleCancel = (e) => {
        setIsOpen(false);
        setNewStyleName("");
        setNewStyleValue("");
    }

    const addStyle = (e) => {
        setIsOpen(false);
        let newDesign = {...design};
        newDesign.elements[selecting].props.style[newStyleName] = {
            type: "string",
            value: newStyleValue
        }
        updateDesign(newDesign);
    }

    const deleteElement = (e) => {
        const newDesign = {...design};
        const {[selecting]: value, ...others} = newDesign.elements;
        newDesign.elements = {...others};
        updateDesign(newDesign);
        setSelecting("");
    }

    const changeId = (e) => {
        let newDesign = design;
        let {[selecting]: value, ...others} = newDesign.elements;
        newDesign.elements = others;
        newDesign.elements[newId] = value;
        updateDesign(newDesign);
        setSelecting(newId);
    }

    return(
        <div>
            {selecting != "" ? (
                <Tabs id="property-select-tab" activeKey={tabKey} onSelect={(k) => {setTabKey(k)}}>
                    {Object.entries(design.elements[selecting].props).map(([propName, props]) => (
                        <Tab eventKey={propName} title={propName} key={propName}>
                            {propName == "general" && (
                                <div style={{paddingBottom: "10px"}}>
                                    <label className="form-label">id</label>
                                    <input type="text" className="form-control border-secondary" value={newId} onBlur={changeId} onChange={(e) => {setNewId(e.target.value)}} />
                                </div>
                            )}
                            {Object.entries(props).map(([prop, value]) => (
                                <PropertyEditForm selecting={selecting} propGroupName={propName} propName={prop} data={value} key={prop}/>
                            ))}
                            {propName == "style" && (
                                <div style={{display: "flex", "justifyContent": "center"}}>
                                    <button className="btn btn-primary" style={{width:"80%", marginTop:"20px"}} onClick={() => {setIsOpen(true)}}>add style</button>
                                </div>
                            )}
                            {propName == "general" && (
                                <div style={{display: "flex", "justifyContent": "center"}}>
                                    <button className="btn btn-danger" style={{width: "80%", marginTop: "20px"}} onClick={deleteElement}>delete</button>
                                </div>
                            )}
                        </Tab>
                    ))}
                    <Tab eventKey="event" title="event">
                    </Tab>
                </Tabs>
            ) : (
                <div></div>
            )}
            <Popup isOpen={isOpen}>
                <div>
                    <div>
                        <label className="form-label">style name</label>
                        <input className="form-control border-secondary" type="text" onChange={(e) => {setNewStyleName(e.target.value)}}/>
                        {newStyleName=="" && <label classname="form-label" style={{color: "red"}}>1文字以上入力してください</label>}
                    </div>
                    <div>
                        <label className="form-label">value</label>
                        <input className="form-control border-secondary" type="text" onChange={(e) => {setNewStyleValue(e.target.value)}}/>
                        {newStyleValue=="" && <label classname="form-label" style={{color: "red"}}>1文字以上入力してください</label>}
                    </div>
                    <div style={{display: "flex", justifyContent: "flex-end", marginTop: "10px"}}>
                        <button className="btn btn-secondary" style={{marginRight: "10px"}} onClick={styleCancel}>cancel</button>
                        {newStyleName != ""  && newStyleValue != "" ? (
                            <button className="btn btn-primary" onClick={addStyle}>OK</button>
                        ) : (
                            <button className="btn btn-primary" disabled>OK</button>
                        )}
                    </div>
                </div>
            </Popup>
        </div>
    )
}

function PropertyEditForm({selecting, propGroupName, propName, data}) {

    const {design, updateDesign} = useContext(DesignContext);
    const [value, setValue] = useState(data.value);

    useEffect(() => {
        setValue(data.value);
    }, [data.value])

    const type = data.type;

    const confirm = (e) => {
        let newDesign = {...design};
        if(type == "number") {
            design.elements[selecting].props[propGroupName][propName].value = Number(value);
        }else {
            design.elements[selecting].props[propGroupName][propName].value = value;
        }
        updateDesign(newDesign);
    }

    if(type == "number") {
        return (
            <div style={{paddingBottom: "10px"}}>
                <label className="form-label">{propName}</label>
                <input type="number" className="form-control border-secondary" value={value} onBlur={confirm} onChange={(e) => {setValue(e.target.value)}} />
            </div>
        )
    }else if(type == "string") {
        return (
            <div style={{paddingBottom: "10px"}}>
                <label className="form-label">{propName}</label>
                <input type="text" className="form-control border-secondary" value={value} onBlur={confirm} onChange={(e) => {setValue(e.target.value)}} />
            </div>
        )
    }
    
    return null;
}
import DesignContext from "@/contexts/design/designContext";
import EventContext from "@/contexts/event/eventContext";
import EventSelectingContext from "@/contexts/event/eventSelectingContext";
import ProjectContext from "@/contexts/project/projectContext";
import { useContext, useEffect, useState } from "react";
import { Accordion, AccordionBody, AccordionButton, AccordionCollapse, AccordionHeader, AccordionItem, Card, CardBody } from "react-bootstrap";


export default function EventPropertyArea({page}) {

    const {selecting, setSelecting} = useContext(EventSelectingContext);
    const {event, updateEvent} = useContext(EventContext);

    const deleteAction = (e) => {
        const parent = event.actions[selecting].parents;
        const child = event.actions[selecting].children;
        let newEvent = {...event};
        const {[selecting]: value, ...otehrs} = newEvent.actions;
        console.log(otehrs)
        newEvent.actions = {...otehrs};
        if(parent != "") {
            newEvent.actions[parent].children = "";
        }
        if(child != "") {
            newEvent.actions[child].parents = "";
        }
        updateEvent(newEvent);
        setSelecting("");
    }

    return (
        <div style={{marginTop: "20px"}}>
            <Accordion defaultActiveKey={[]} alwaysOpen>
                {selecting != "" && event.actions[selecting].selector.in.map((item, index) => (
                    <div style={{marginTop: "20px"}} key={"in" + index}>
                        <AccordionItem eventKey={"in" + index}>
                            <AccordionHeader>入力{index}</AccordionHeader>
                            <AccordionBody>
                                <Property aid={selecting} types={event.actions[selecting].selector.inTypes} 
                                        index={index} ioType="in" type={item.type} value={item.value} page={page}/>
                            </AccordionBody>
                        </AccordionItem>
                    </div>
                ))}
                {selecting != "" && event.actions[selecting].selector.out.map((item, index) => (
                    <div style={{marginTop: "20px"}} key={"out" + index}>
                        <AccordionItem eventKey={"out" + index}>
                            <AccordionHeader>出力{index}</AccordionHeader>
                            <AccordionBody>
                                <Property aid={selecting} types={event.actions[selecting].selector.outTypes} 
                                        index={index} type={item.type} value={item.value} ioType="out" page={page}/>
                            </AccordionBody>
                        </AccordionItem>
                    </div>
                ))}
            </Accordion>
            {selecting != "" && 
                <div style={{textAlign: "center"}}>
                    <button className="btn btn-danger" style={{width: "80%", marginTop: "10px"}} onClick={deleteAction}>削除</button>
                </div>
            }
        </div>
    )
}

function Property({aid, types, index, type, value, ioType, page}) {

    const {project, updateProject} = useContext(ProjectContext);
    const {event, updateEvent} = useContext(EventContext);

    const design = project.pages[page].design;

    const [typeSelect, setTypeSelect] = useState(type);
    const [newValue, setNewValue] = useState(() => {
        if(type != "id") {
            return value;
        }else{
            let values = value.split(",");
            if(values.length != 3) {
                return ""
            } else {
                return values[0];
            }
        }
    });
    const [designPropGroup, setDesignPropGroup] = useState(() => {
        if(type != "id") {
            return value;
        }else{
            let values = value.split(",");
            if(values.length != 3) {
                return ""
            } else {
                return values[1];
            }
        }
    });
    const [designPropName, setDesignPropName] = useState(() => {
        if(type != "id") {
            return value;
        }else{
            let values = value.split(",");
            if(values.length != 3) {
                return ""
            } else {
                return values[2];
            }
        }
    });


    useEffect(() => {
        setNewValue(() => {
            if(type != "id") {
                return value;
            }else{
                let values = value.split(",");
                if(values.length != 3) {
                    return ""
                } else {
                    return values[0];
                }
            }
        });
        setDesignPropGroup(() => {
            if(type != "id") {
                return value;
            }else{
                let values = value.split(",");
                if(values.length != 3) {
                    return ""
                } else {
                    return values[1];
                }
            }
        });
        setDesignPropName(() => {
            if(type != "id") {
                return value;
            }else{
                let values = value.split(",");
                if(values.length != 3) {
                    return ""
                } else {
                    return values[2];
                }
            }
        });

    }, [aid])

    const valueChange = (e) => {
        setNewValue(e.target.value);
    }

    const onTypeChange = (e) => {
        setTypeSelect(e.target.value);
        setNewValue("");
    }

    const selectProp = (e) => {
        setDesignPropName(e.target.value);
        let values = "";
        values += newValue;
        values += ",";
        values += designPropGroup;
        values += ",";
        values += e.target.value;
        let newEvent = {...event};
        newEvent.actions[aid].selector[ioType][index].value = values;
        updateEvent(newEvent);
    }


    return(
        <div>
            <div>
                <label className="form-label">タイプ</label>
                <select className="form-select" value={typeSelect} onChange={onTypeChange}>
                    <option value="" disabled>Select...</option>
                    {types.map((item, index) => (
                        <option key={index} value={item}>{item}</option>
                    ))}
                </select>
            </div>
            <p></p>
            <div>
                <label className="form-label">値</label>
                {typeSelect=="id" && (
                    <div>
                        <div>
                            <select value={newValue} onChange={valueChange} className="form-select">
                                <option value="" disabled>Select...</option>
                                {Object.keys(design.elements).map((key) => (
                                    <option key={key} value={key}>{key}</option>
                                ))}
                            </select>
                        </div>
                        <p></p>
                        <div>
                            {newValue != "" && (
                                <div>
                                    <div>
                                        <label className="form-label">PropertyGroup</label>
                                        <select value={designPropGroup} onChange={(e) => {setDesignPropGroup(e.target.value)}} className="form-select">
                                            <option value="" disabled>Select...</option>
                                            {Object.keys(design.elements[newValue].props).map((key) => (
                                                <option key={key} value={key}>{key}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <p></p>
                                    {designPropGroup != "" && (
                                        <div>
                                            <label className="form-label">PropertyName</label>
                                            <select value={designPropName} onChange={selectProp} className="form-select">
                                                <option value="" disabled>Select...</option>
                                                {Object.keys(design.elements[newValue].props[designPropGroup]).map((key) => (
                                                    <option key={key} value={key}>{key}</option>
                                                ))}
                                            </select>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                )}
                {typeSelect=="variable" && (
                    <select className="form-select" value={newValue} onCanPlay={valueChange}>

                    </select>
                )}
                {typeSelect=="constant" && (
                    <input className="form-control" type="text" value={newValue} onChange={(e) => {setNewValue(e.target.value)}}/>
                )}
            </div>
        </div>
    )
}
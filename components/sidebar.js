"use client"
import { useState } from "react";
import styles from "./sidebar.module.css";

export default function Sidebar({leftIcons, left, center, right}) {

    const [leftClass, setLeftClass] = useState(`${styles.panel} ${styles.leftClosed}`);
    const [isOpen, setIsOpen] = useState(-1);

    const leftHandler = (index) => {
        if(isOpen != -1) {
            setIsOpen(-1);
            setLeftClass(`${styles.panel} ${styles.leftClosed}`);
        }
        else {
            setIsOpen(index);
            setLeftClass(`${styles.panel} ${styles.left}`);
        }
    }

    return (
        <div>
            <div className={styles.sideContainer}>
                <div className={styles.sideIcons}>
                    {leftIcons.map((value, index) => (
                        <button onClick={() => {leftHandler(index)}} style={{marginBottom: "10px"}} key={index}
                            className="btn btn-primary">{value}</button>
                        ))}
                </div>
                <div className={leftClass}>
                    {isOpen != -1 && <div>
                        {left[isOpen]}
                    </div>}
                </div>

                <div className={`${styles.panel} ${styles.center}`}>
                    <div className="row" style={{height: "100%"}}>
                        <div className="col-9">
                            {center}
                        </div>
                        <div className="col-3">
                            {right}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
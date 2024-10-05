"use client"

import EventsContext from "@/contexts/event/eventsContext";
import { useContext, useState } from "react"

export default function EventsLayout({children}) {

    const [events, setEvents] = useState({
        globalVarialbes: [],
        event:{}
    });

    const updateEvents = (newEvents) => {
        setEvents(newEvents);
    }

    return(
        <div>
            <EventsContext.Provider value={{events, updateEvents}}>
                {children}
            </EventsContext.Provider>
        </div>
    )

}
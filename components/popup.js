

export default function Popup({isOpen, children}) {
    return (
        <div>
            {isOpen && (
                <div className="popup">
                    <div className="popupContent">
                        {children}
                    </div>
                </div>
            )}
        </div>
    )
}

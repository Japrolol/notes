import { useState, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import ContextMenu from "./contextMenu.tsx";
import Notes from "./notes.tsx";

type Note = {
    id: string;
    title: string;
    date_created: Date;
    date_updated: Date;
};

const SidebarNotes = () => {
    const [activeNote, setActiveNote] = useState<string | null>(null);
    const [notes, setNotes] = useState<Note[]>([]);
    const [contextMenu, setContextMenu] = useState<{ x: number, y: number, visible: boolean }>({ x: 0, y: 0, visible: false });
    const inputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

    const handleAddNote = () => {
        const newNote = { id: uuidv4(), title: 'New Note', date_created: new Date(), date_updated: new Date() };
        setNotes([...notes, newNote]);
        setTimeout(() => {
            inputRefs.current[newNote.id]?.focus();
            setActiveNote(newNote.id);
        }, 0);
    };

    const handleDeleteNote = (id: string) => {
        setNotes(notes.filter(note => note.id !== id));
    };

    const handleNoteClick = (id: string | null) => {
        setActiveNote(id);
    };

    const handleInputDoubleClick = (id: string) => {
        inputRefs.current[id]?.focus();
    };

    const preventFocus = (event: React.MouseEvent<HTMLInputElement>) => {
        event.preventDefault();
    };

    const handleRightClick = (event: React.MouseEvent, id: string) => {
        event.preventDefault();
        setActiveNote(id);
        setContextMenu({ x: event.clientX - 300, y: event.clientY - 40, visible: true });
    };

    const handleCloseContextMenu = () => {
        setContextMenu({ ...contextMenu, visible: false });
    };

    const contextMenuOptions = [
        { label: 'Delete', onClick: () => handleDeleteNote(activeNote!) },
        { label: 'Cancel', onClick: handleCloseContextMenu },
    ];

    return (
        <div className="sidebar_notes">
            <div className="controls">
                <button onClick={handleAddNote}><i className="bx bx-plus"></i>New note</button>
                <input type="search" placeholder="Search..." />
            </div>

            <div className="notebook-grid">
                {notes.map((note) => (
                    <div
                        key={note.id}
                        onClick={() => handleNoteClick(note.id)}
                        onContextMenu={(event) => handleRightClick(event, note.id)}
                        className={`grid-item notebook ${activeNote === note.id ? "active" : ""}`}>
                        <form className="main_body">
                            <input
                                className="main_text"
                                type="text"
                                defaultValue={note.title}
                                ref={el => inputRefs.current[note.id] = el}
                                onMouseDown={preventFocus}
                                onDoubleClick={() => handleInputDoubleClick(note.id)}
                            />
                        </form>
                    </div>
                ))}
            </div>

            {contextMenu.visible && (
                <ContextMenu
                    x={contextMenu.x}
                    y={contextMenu.y}
                    options={contextMenuOptions}
                    onClose={handleCloseContextMenu}
                    title="Delete note?"
                />
            )}
            {activeNote && <Notes id={activeNote} title={notes.find(note => note.id === activeNote)?.title} date_updated={notes.find(note => note.id === activeNote)?.date_updated} />}
        </div>
    );
};

export default SidebarNotes;
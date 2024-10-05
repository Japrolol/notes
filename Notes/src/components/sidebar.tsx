import { useState, useRef } from 'react';
import ContextMenu from './contextMenu';
import { v4 as uuidv4 } from 'uuid';
import SidebarNotes from "./sidebar_notes.tsx";

interface Notebook {
    id: string;
    title: string;
}

const Sidebar = () => {
    const [activeNotebook, setActiveNotebook] = useState<string | null>(null);
    const [notebooks, setNotebooks] = useState<Notebook[]>([]);
    const [contextMenu, setContextMenu] = useState<{ x: number, y: number, visible: boolean }>({ x: 0, y: 0, visible: false });
    const inputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

    const handleAddNotebook = () => {
        const newNotebook = { id: uuidv4(), title: 'New Notebook' };
        setNotebooks([...notebooks, newNotebook]);
        setTimeout(() => {
            inputRefs.current[newNotebook.id]?.focus();
            setActiveNotebook(newNotebook.id);
        }, 0);
    };

    const handleDeleteNotebook = (id: string) => {
        setNotebooks(notebooks.filter(notebook => notebook.id !== id));
        setActiveNotebook(null);
    };

    const handleNotebookClick = (id: string | null) => {
        setActiveNotebook(id);
    };

    const handleInputDoubleClick = (id: string) => {
        inputRefs.current[id]?.focus();
    };

    const preventFocus = (event: React.MouseEvent<HTMLInputElement>) => {
        event.preventDefault();
    };

    const handleRightClick = (event: React.MouseEvent, id: string) => {
        event.preventDefault();
        setActiveNotebook(id);
        setContextMenu({ x: event.clientX, y: event.clientY, visible: true });
    };

    const handleCloseContextMenu = () => {
        setContextMenu({ ...contextMenu, visible: false });
    };

    const contextMenuOptions = [
        { label: 'Delete', onClick: () => handleDeleteNotebook(activeNotebook!) },
        { label: 'Cancel', onClick: handleCloseContextMenu },
    ];

    return (
        <div>
            <nav className="sidebar">
                <div className="notebooks" onClick={() => handleNotebookClick(null)}>
                    <i className='bx bx-notepad'></i>
                    <h3>NOTEBOOKS</h3>
                    <i className='bx bx-plus add' onClick={handleAddNotebook}></i>
                </div>

                <div className="notebook-grid">
                    {notebooks.map((notebook) => (
                        <div
                            key={notebook.id}
                            onClick={() => handleNotebookClick(notebook.id)}
                            onContextMenu={(event) => handleRightClick(event, notebook.id)}
                            className={`grid-item notebook ${activeNotebook === notebook.id ? "active" : ""}`}>
                            <form className="main_body">
                                <input
                                    className="main_text"
                                    type="text"
                                    defaultValue={notebook.title}
                                    ref={el => inputRefs.current[notebook.id] = el}
                                    onMouseDown={preventFocus}
                                    onDoubleClick={() => handleInputDoubleClick(notebook.id)}
                                />
                            </form>
                            <span className="note_count">9</span>
                        </div>
                    ))}
                </div>
            </nav>
            {/* <nav className="sidebar-placeholder"></nav>
            <nav className="sidebar-placeholder-notes"></nav>
            */}
            {contextMenu.visible && (
                <ContextMenu
                    x={contextMenu.x}
                    y={contextMenu.y}
                    options={contextMenuOptions}
                    onClose={handleCloseContextMenu}
                    title="Delete notebook?"
                />
            )}
            {activeNotebook && <SidebarNotes/>}
        </div>
    );
};

export default Sidebar;
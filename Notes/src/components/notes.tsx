import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

type Note = {
    title: string;
    date_updated: Date;
    content: string;
};

interface PassedData {
    id: string;
    onSave: () => void;
}

const Notes = ({ id, onSave }: PassedData) => {
    const [note, setNote] = useState<Note | null>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (id) {
            axios.get(`${import.meta.env.VITE_API_URL}/get_note`, {
                headers: {
                    'Content-Type': 'application/json',
                },
                params: { id },
                withCredentials: true
            })
            .then(response => {
                const fetchedNote = response.data;
                setNote({
                    title: fetchedNote.title || "New Note",
                    date_updated: fetchedNote.date_updated ? new Date(fetchedNote.date_updated) : new Date(),
                    content: fetchedNote.content || ""
                });
                console.log("Fetched note:", fetchedNote);
            })
            .catch(error => {
                console.error('Error fetching note:', error);
            });
        }
    }, [id]);

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            textareaRef.current?.focus();
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (note) {
            axios.post(`${import.meta.env.VITE_API_URL}/update_note`, {
                id,
                title: note.title,
                date_updated: new Date(),
                content: note.content
            }, { withCredentials: true })
            .then(response => {
                if (response.status === 200) {
                    console.log("Note updated");
                    setNote({
                        ...note,
                        date_updated: new Date()
                    });
                    onSave(); // Call the callback to update the sidebar notes
                }
            })
            .catch(error => {
                console.error(error);
            });
        }
    };

    const submit = () => {
        handleSubmit(new Event('submit', { bubbles: true, cancelable: true }) as unknown as React.FormEvent);
    };

    return (
        <div className="note">
            <div className="header">
                <span className="title">{note?.title === "" || note?.title == null ? "New Note" : note?.title}</span>
            </div>
            <div className="toolbar">
                <span className="date">{note?.date_updated?.toLocaleString([], {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit'
                })}</span>
                <button onClick={submit} className="save">Save</button>
            </div>

            <div className="content">
                <form>
                    <input
                        className="main_title note_title"
                        name="title"
                        value={note?.title === "" || note?.title == null ? "New Note" : note?.title}
                        onChange={(e) => setNote({ ...note, title: e.target.value } as Note)}
                        onKeyDown={handleKeyDown}
                    />
                    <textarea
                        className="main_text"
                        name="content"
                        ref={textareaRef}
                        value={note?.content || ""}
                        onChange={(e) => setNote({ ...note, content: e.target.value } as Note)}
                    />
                </form>
            </div>
        </div>
    );
};

export default Notes;
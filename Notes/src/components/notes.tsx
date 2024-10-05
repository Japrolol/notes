import { useState, useRef } from "react";

type Note = {
    title: string;
    date_updated: Date;
    content: string;
};

interface PassedData {
    id: string;
    title: string | undefined;
    date_updated: Date | undefined;
}

const Notes = ({ id, title, date_updated }: PassedData) => {
    const [note, setNote] = useState<Note[]>([]);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            textareaRef.current?.focus();
        }
    };

    return (
        <div className="note">
            <div className="header">
                <span className="title">{title}</span>
                <span className="date">{date_updated?.toLocaleString([], {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit'
                })}</span>
            </div>
            <div className="toolbar">
                <button className="save">Save</button>
            </div>

            <div className="content">
                <form>
                    <input
                        className="main_title"
                        defaultValue={title}
                        name="title"
                        value={note[0]?.title}
                        onChange={(e) => setNote([{ ...note[0], title: e.target.value }])}
                        onKeyDown={handleKeyDown}
                    />
                    <textarea
                        className="main_text"
                        name="content"
                        ref={textareaRef}
                        value={note[0]?.content}
                        onChange={(e) => setNote([{ ...note[0], content: e.target.value }])}
                    />
                </form>
            </div>
        </div>
    );
};

export default Notes;
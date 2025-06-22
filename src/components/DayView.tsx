'use client';

import React, { useMemo, useState } from 'react';
import { Note } from '@prisma/client';
import { Button } from './ui/button';

interface DayViewProps {
    date: Date;
    notes: Note[];
    onCreateNote: (content: string,day:string,month:string,year:string) => void;
    onCompleteNote: (id: string, iscomplete: boolean) => void;
    setEditingNote: (note: Note | null) => void;
    editingNote: Note | null;
}


const DayView = ({ date, notes, onCreateNote , onCompleteNote, setEditingNote, editingNote }: DayViewProps) => {
    const [isCreating, setIsCreating] = useState(false);
    const [newNoteContent, setNewNoteContent] = useState('');


    const day = date.getDate();
    const month = date.toLocaleString('en-US', { month: 'short' });
    const dayOfWeek = date.toLocaleString('en-US', { weekday: 'short' });

    const emptySlotsCount = useMemo(() => {
        return 10 - notes.length < 0 ? 0 : 10 - notes.length;
    }, [notes]);

    const handleEmptySlotClick = () => {
        if (!isCreating) {
            setIsCreating(true);
        }
    };

    const handleCreate = () => {
 
        if (newNoteContent.trim() !== '') {
          
            onCreateNote(newNoteContent.trim(),date.getDate().toString(),date.getMonth().toString(),date.getFullYear().toString());
        }
        setIsCreating(false);
        setNewNoteContent('');
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
        
            handleCreate();
        } else if (e.key === 'Escape') {
            setIsCreating(false);
            setNewNoteContent('');
        }
    };
    const handleComplete = (id: string, iscomplete: boolean) => {
        if(iscomplete){
            onCompleteNote(id, false);
        }else{
            onCompleteNote(id, true);
        }
    }
    const handleEdit = (note: Note) => {
        setEditingNote(note);
    }


    return (
        <div className="w-[300px] font-sans">
            <div className="flex justify-between items-baseline border-b-[1.5px] border-black pb-1 mb-1">
            <span className="text-xl font-medium text-black">{dayOfWeek}</span>
                <span className="text-xl font-bold text-black/60">{day} {month}</span>
          
            </div>
            <ul className="divide-y divide-gray-300">
                {notes.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime()).map((note, index) => (
                    <li key={`note-${index}`} className="text-sm  text-black h-[52px] flex items-center justify-between group">
                       <p className={`${note.iscomplete? 'line-through' : editingNote?.id === note.id ? 'underline cursor-pointer' : 'hover:underline cursor-pointer'}`} onClick={() => handleEdit(note)}>{note.content}</p>
                       <div>
               
                       <Button variant="ghost" size="icon" className="ml-2 hover:opacity-100 opacity-0 hover:opacity group-hover:opacity-100 cursor-pointer" onClick={() => handleComplete(note.id, note.iscomplete)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-circle-check-icon lucide-circle-check"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
                       </Button>
                       </div>
                    </li>
                ))}
                
                {isCreating && (
                     <li className=" h-[52px] flex items-center">
                        <input
                            type="text"
                            value={newNoteContent}
                            onChange={(e) => setNewNoteContent(e.target.value)}
                            onKeyDown={handleKeyDown}
                            onBlur={handleCreate}
                            placeholder="Type and press Enter to save"
                            className="w-full text-sm  border-none outline-none"
                            autoFocus
                        />
                    </li>
                )}

                {Array.from({ length: isCreating ? emptySlotsCount - 1 : emptySlotsCount }).map((_, index) => (
                    <li key={`empty-${index}`} className="py-3 h-[52px]" onClick={handleEmptySlotClick}>
                        &nbsp;
                    </li>
                ))}
                
            </ul>
        </div>
    );
};

export default DayView; 
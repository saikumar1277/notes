'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Calendar as CalendarIcon, Menu, Circle } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Note } from '@prisma/client';
interface FloatingNoteCreatorProps {
  onCreateNote: (content: string, date: Date) => void;
  isLoading: boolean;
  editingNote: Note | null;
  handleDeleteNote: (id: string) => void;
  handleEditNote: (id: string, content: string, day: string, month: string, year: string) => void;
}

export const FloatingNoteCreator = ({ onCreateNote, isLoading, editingNote, handleDeleteNote, handleEditNote }: FloatingNoteCreatorProps) => {
  const [isCreating, setIsCreating] = useState(false);
  const [content, setContent] = useState('');
  const [date, setDate] = useState<Date | undefined>(new Date());

  const handleCreate = () => {
    if (content.trim() && date) {
      onCreateNote(content, date);
      setContent('');
      setIsCreating(false);
    }
  };
  const handleDelete = () => {
    if (editingNote) {
      handleDeleteNote(editingNote.id);
      setContent('');
      setIsCreating(false);
    }
  
  };
  const handleEdit = () => {
    if (editingNote && date) {
      handleEditNote(editingNote.id, content, date?.getDate().toString(), date?.getMonth().toString(), date?.getFullYear().toString());
      setContent('');
      setIsCreating(false);
    }
  }

const handleCancel = () => {
  setContent('');
  setIsCreating(false);
}

  useEffect(() => {
    if (editingNote) {
      setContent(editingNote.content);
      setIsCreating(true);
      if (editingNote.day && editingNote.month && editingNote.year) {
        setDate(new Date(parseInt(editingNote.year), parseInt(editingNote.month), parseInt(editingNote.day)));
      }
    }
  }, [editingNote]);
  if (!isCreating) {
    return (
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
        <div className="flex items-center gap-2 p-3 bg-white rounded-full shadow-lg border">
    
          <Button
            className="rounded-full w-xs h-12 pl-6 pr-8 py-4 text-md bg-black text-white hover:bg-black/80 cursor-pointer flex items-center"
            onClick={() => setIsCreating(true)}
          >
            <Circle className="mr-2 h-5 w-5" fill="red" color="red" />
            Create a note
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-[90vw] max-w-2xl">
      <div className="bg-white p-4 rounded-2xl shadow-lg border flex flex-col gap-4">
        <Textarea
          placeholder="Write your note here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="min-h-[240px] text-base"
        />
        <div className="flex justify-between items-center">
          <div>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-[280px] justify-start text-left font-normal cursor-pointer",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                  disabled={(date) => {
                    const day = date.getDay();
                    return day === 0 || day === 6; // 0 = Sunday, 6 = Saturday
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex gap-2">
            <Button className="cursor-pointer" variant="ghost" onClick={editingNote ? handleDelete : handleCancel}>
              {editingNote ? 'Delete' : 'Cancel'}
            </Button>
            <Button className="cursor-pointer" onClick={editingNote ? handleEdit : handleCreate} disabled={isLoading || !content.trim()}>
              {editingNote ? 'Edit' : 'Create'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FloatingNoteCreator; 
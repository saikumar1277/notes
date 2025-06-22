'use client';

import { useState } from 'react';
import { trpc } from '@/lib/trpc/client';
import { Button } from '@/components/ui/button';
import DayView from '@/components/DayView';
import FloatingNoteCreator from '@/components/FloatingNoteCreator';
import { Note } from '@prisma/client';

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [weekOffset, setWeekOffset] = useState(0); // Track which week we're viewing
  const [editingNote, setEditingNote] = useState<Note | null>(null);

  // tRPC queries and mutations
  const { data: rawNotes = [], refetch } = trpc.notes.getAll.useQuery();
  
  // Transform the notes to convert string dates back to Date objects
  const notes = rawNotes.map(note => ({
    ...note,
    createdAt: new Date(note.createdAt),
    updatedAt: new Date(note.updatedAt)
  }));

  const createNote = trpc.notes.create.useMutation({
    onSuccess: () => {
      refetch();
    },
  });
  const updateNote = trpc.notes.update.useMutation({
    onSuccess: () => {
      refetch();
    },
  });
  const deleteNote = trpc.notes.delete.useMutation({
    onSuccess: () => {
      refetch();
    },
  });
  



  // Function to get the current week's dates (Monday to Friday)
  const getCurrentWeekDates = () => {
    const dates = [];
    const currentDate = new Date();
    
    // Apply week offset
    currentDate.setDate(currentDate.getDate() + (weekOffset * 7));
    
    // Get Monday of current week
    const dayOfWeek = currentDate.getDay();
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Sunday is 0, so we go back 6 days
    const monday = new Date(currentDate);
    monday.setDate(currentDate.getDate() + mondayOffset);
    
    // Generate 5 days starting from Monday
    for (let i = 0; i < 5; i++) {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      dates.push(date);
    }
    
    return dates;
  };

  const weekDates = getCurrentWeekDates();

  // Navigation handlers
  const handlePreviousWeek = () => {
    setWeekOffset(prev => prev - 1);
  };

  const handleNextWeek = () => {
    setWeekOffset(prev => prev + 1);
  };

  const handleCreateNote = async (title: string, content: string, day?: string, month?: string, year?: string) => {
    setIsLoading(true);
    try {
      await createNote.mutateAsync({ title, content, day, month, year });
    } catch (error) {
      console.error('Failed to create note:', error);
    } finally {
      setIsLoading(false);
      setEditingNote(null);
    }
  };

  const handleFloatingCreateNote = (content: string, date: Date) => {
    handleCreateNote("", content, date.getDate().toString(), date.getMonth().toString(), date.getFullYear().toString());
  }

  const handleDayViewCreateNote = (content: string, day: string, month: string, year: string) => {
    handleCreateNote("", content, day, month, year);
  }

  const handleEditNote = async (id: string, content: string, day: string, month: string, year: string) => {
    setIsLoading(true);
    try {
      await updateNote.mutateAsync({ id, content, day, month, year });
      console.log(content, day, month, year);
    } catch (error) {
      console.error('Failed to update note:', error);
    } finally {
      setIsLoading(false);
      setEditingNote(null);
    }
  };

  const handleDeleteNote = async (id: string) => {
    setIsLoading(true);
    try {
      await deleteNote.mutateAsync({ id });
    } catch (error) {
      console.error('Failed to delete note:', error);
    } finally {
      setIsLoading(false);
      setEditingNote(null);
    }
  };
  const handleCompleteNote = async (id: string, iscomplete: boolean) => {
    setIsLoading(true);
    try {
      await updateNote.mutateAsync({ id, iscomplete: iscomplete });
    } catch (error) {
      console.error('Failed to complete note:', error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="max-h-screen bg-white">
      <div className=" p-6">
        {/* Header */}
        <div className="flex flex-row justify-between">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Notes
          </h1>
    
          <div className="flex flex-row gap-2">
          <Button 
            className="rounded-full cursor-pointer" 
            onClick={handlePreviousWeek}
            variant="outline"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-left-icon lucide-chevron-left"><path d="m15 18-6-6 6-6"/></svg>            </Button>
          <Button 
            className="rounded-full cursor-pointer" 
            onClick={handleNextWeek}
            variant="outline"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-right-icon lucide-chevron-right"><path d="m9 18 6-6-6-6"/></svg>
            </Button>
          </div>
        </div>

        {/* Week View */}
        <div className="mt-8">
          <div className="flex gap-4 overflow-x-auto pb-4">
            {weekDates.map((date, index) => (
              <DayView 
                key={index} 
                date={date} 
                notes={notes.filter(note => note.day === date.getDate().toString() && note.month === date.getMonth().toString() && note.year === date.getFullYear().toString())} 
                onCreateNote={handleDayViewCreateNote} 
                onCompleteNote={handleCompleteNote}
                setEditingNote={setEditingNote}
                editingNote={editingNote}
              />
            ))}
          </div>
        </div>
        
        <FloatingNoteCreator onCreateNote={handleFloatingCreateNote} handleDeleteNote={handleDeleteNote} handleEditNote={handleEditNote} isLoading={isLoading} editingNote={editingNote}/>


      </div>
    </div>
  );
}

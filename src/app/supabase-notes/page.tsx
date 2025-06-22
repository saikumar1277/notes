'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Button } from '@/components/ui/button';

interface Note {
  id: string;
  title: string;
  content: string;
  day?: string;
  month?: string;
  year?: string;
  iscomplete?: boolean;
  created_at: string;
  updated_at: string;
}

export default function SupabaseNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [weekOffset, setWeekOffset] = useState(0);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [newNoteContent, setNewNoteContent] = useState('');
  const [newNoteTitle, setNewNoteTitle] = useState('');

  const supabase = createClient();

  // Function to get the current week's dates (Monday to Friday)
  const getCurrentWeekDates = () => {
    const dates = [];
    const currentDate = new Date();
    
    // Apply week offset
    currentDate.setDate(currentDate.getDate() + (weekOffset * 7));
    
    // Get Monday of current week
    const dayOfWeek = currentDate.getDay();
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
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

  // Fetch notes from Supabase
  const fetchNotes = async () => {
    try {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching notes:', error);
        return;
      }

      setNotes(data || []);
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };

  // Create a new note
  const createNote = async (title: string, content: string, day?: string, month?: string, year?: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('notes')
        .insert([
          {
            title,
            content,
            day,
            month,
            year,
            iscomplete: false
          }
        ])
        .select();

      if (error) {
        console.error('Error creating note:', error);
        return;
      }

      await fetchNotes();
      setNewNoteContent('');
      setNewNoteTitle('');
    } catch (error) {
      console.error('Error creating note:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Update a note
  const updateNote = async (id: string, content: string, day?: string, month?: string, year?: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('notes')
        .update({
          content,
          day,
          month,
          year,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) {
        console.error('Error updating note:', error);
        return;
      }

      await fetchNotes();
      setEditingNote(null);
    } catch (error) {
      console.error('Error updating note:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Delete a note
  const deleteNote = async (id: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting note:', error);
        return;
      }

      await fetchNotes();
    } catch (error) {
      console.error('Error deleting note:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle note completion
  const toggleNoteCompletion = async (id: string, iscomplete: boolean) => {
    try {
      const { error } = await supabase
        .from('notes')
        .update({ iscomplete: !iscomplete })
        .eq('id', id);

      if (error) {
        console.error('Error updating note:', error);
        return;
      }

      await fetchNotes();
    } catch (error) {
      console.error('Error updating note:', error);
    }
  };

  // Navigation handlers
  const handlePreviousWeek = () => {
    setWeekOffset(prev => prev - 1);
  };

  const handleNextWeek = () => {
    setWeekOffset(prev => prev + 1);
  };

  const handleCreateNote = () => {
    if (newNoteContent.trim()) {
      createNote(newNoteTitle, newNoteContent);
    }
  };

  const handleDayViewCreateNote = (content: string, day: string, month: string, year: string) => {
    createNote("", content, day, month, year);
  };

  // Filter notes for a specific day
  const getNotesForDay = (date: Date) => {
    return notes.filter(note => 
      note.day === date.getDate().toString() && 
      note.month === date.getMonth().toString() && 
      note.year === date.getFullYear().toString()
    );
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <div className="max-h-screen bg-white">
      <div className="p-6">
        {/* Header */}
        <div className="flex flex-row justify-between items-center mb-6">
          <h1 className="text-4xl font-bold text-gray-900">
            Supabase Notes
          </h1>
    
          <div className="flex flex-row gap-2">
            <Button 
              className="rounded-full cursor-pointer" 
              onClick={handlePreviousWeek}
              variant="outline"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            </Button>
            <Button 
              className="rounded-full cursor-pointer" 
              onClick={handleNextWeek}
              variant="outline"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </Button>
          </div>
        </div>

        {/* Quick Note Creator */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h2 className="text-lg font-semibold mb-3">Quick Note</h2>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Title (optional)"
              value={newNoteTitle}
              onChange={(e) => setNewNoteTitle(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Note content"
              value={newNoteContent}
              onChange={(e) => setNewNoteContent(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Button 
              onClick={handleCreateNote}
              disabled={isLoading || !newNoteContent.trim()}
            >
              {isLoading ? 'Creating...' : 'Create'}
            </Button>
          </div>
        </div>

        {/* Week View */}
        <div className="mt-8">
          <div className="flex gap-4 overflow-x-auto pb-4">
            {weekDates.map((date, index) => (
              <div key={index} className="min-w-[200px] bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-3">
                  {date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                </h3>
                
                {/* Notes for this day */}
                <div className="space-y-2">
                  {getNotesForDay(date).map((note) => (
                    <div key={note.id} className="bg-white p-3 rounded border">
                      {note.title && (
                        <h4 className="font-medium text-sm text-gray-800 mb-1">{note.title}</h4>
                      )}
                      <p className="text-sm text-gray-600 mb-2">{note.content}</p>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => toggleNoteCompletion(note.id, note.iscomplete || false)}
                          className={note.iscomplete ? 'bg-green-100 text-green-800' : ''}
                        >
                          {note.iscomplete ? '✓' : '○'}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingNote(note)}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => deleteNote(note.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Quick add note for this day */}
                <div className="mt-3">
                  <input
                    type="text"
                    placeholder="Add note for this day..."
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                        handleDayViewCreateNote(
                          e.currentTarget.value,
                          date.getDate().toString(),
                          date.getMonth().toString(),
                          date.getFullYear().toString()
                        );
                        e.currentTarget.value = '';
                      }
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Edit Note Modal */}
        {editingNote && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold mb-4">Edit Note</h3>
              <textarea
                value={editingNote.content}
                onChange={(e) => setEditingNote({ ...editingNote, content: e.target.value })}
                className="w-full h-32 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                placeholder="Note content..."
              />
              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  onClick={() => setEditingNote(null)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => updateNote(
                    editingNote.id,
                    editingNote.content,
                    editingNote.day,
                    editingNote.month,
                    editingNote.year
                  )}
                  disabled={isLoading}
                >
                  {isLoading ? 'Saving...' : 'Save'}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 
"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Navigation } from "@/components/ui/navigation";
import { Footer } from "@/components/ui/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  BookOpen,
  Plus,
  Edit,
  Trash2,
  Tag,
  ArrowLeft,
  Search
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { fadeInUp, staggerChildren } from "@/lib/motion";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Helmet } from "react-helmet-async";

interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  created_at: string;
  updated_at: string;
}

const PlanningNotes = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(true);
  const [currentUser, setCurrentUser] = React.useState<any>(null);
  const [notes, setNotes] = React.useState<Note[]>([]);
  const [isCreating, setIsCreating] = React.useState(false);
  const [editingNote, setEditingNote] = React.useState<Note | null>(null);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [noteForm, setNoteForm] = React.useState({
    title: '',
    content: '',
    tags: ''
  });

  React.useEffect(() => {
    checkAuthAndLoadData();
  }, []);

  const checkAuthAndLoadData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/auth/login');
        return;
      }
      
      setCurrentUser(user);
      await loadNotes(user.id);
    } catch (error) {
      console.error('Error checking auth:', error);
      toast({
        title: "Authentication Error",
        description: "Please sign in to continue.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadNotes = async (userId: string) => {
    try {
      // Using localStorage for notes storage since notes table doesn't exist yet
      const localNotes = localStorage.getItem(`notes_${userId}`);
      setNotes(localNotes ? JSON.parse(localNotes) : []);
    } catch (error) {
      console.error('Error loading notes:', error);
      setNotes([]);
    }
  };

  const saveNote = async (note: { title: string; content: string; tags: string[] }) => {
    if (!currentUser) return;

    try {
      const newNote: Note = {
        id: Date.now().toString(),
        title: note.title,
        content: note.content,
        tags: note.tags,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Notes are stored in localStorage since no notes table exists yet

      // Update local state and localStorage
      const updatedNotes = [newNote, ...notes];
      setNotes(updatedNotes);
      localStorage.setItem(`notes_${currentUser.id}`, JSON.stringify(updatedNotes));

      toast({
        title: "Note Saved!",
        description: "Your note has been saved successfully.",
      });

      return newNote;
    } catch (error: any) {
      toast({
        title: "Error Saving Note",
        description: error.message || "Please try again.",
        variant: "destructive"
      });
      throw error;
    }
  };

  const updateNote = async (id: string, updates: Partial<Note>) => {
    if (!currentUser) return;

    try {
      const updatedNote = {
        ...notes.find(n => n.id === id),
        ...updates,
        updated_at: new Date().toISOString()
      } as Note;

      // Notes are stored in localStorage since no notes table exists yet

      // Update local state and localStorage
      const updatedNotes = notes.map(note => 
        note.id === id ? updatedNote : note
      );
      setNotes(updatedNotes);
      localStorage.setItem(`notes_${currentUser.id}`, JSON.stringify(updatedNotes));

      toast({
        title: "Note Updated!",
        description: "Your note has been updated successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error Updating Note",
        description: error.message || "Please try again.",
        variant: "destructive"
      });
    }
  };

  const deleteNote = async (id: string) => {
    if (!currentUser) return;

    try {
      // Notes are stored in localStorage since no notes table exists yet

      // Update local state and localStorage
      const updatedNotes = notes.filter(note => note.id !== id);
      setNotes(updatedNotes);
      localStorage.setItem(`notes_${currentUser.id}`, JSON.stringify(updatedNotes));

      toast({
        title: "Note Deleted",
        description: "Your note has been deleted successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error Deleting Note",
        description: error.message || "Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!noteForm.title.trim()) {
      toast({
        title: "Title Required",
        description: "Please enter a title for your note.",
        variant: "destructive"
      });
      return;
    }

    try {
      if (editingNote) {
        await updateNote(editingNote.id, {
          title: noteForm.title,
          content: noteForm.content,
          tags: noteForm.tags.split(',').map(tag => tag.trim()).filter(Boolean)
        });
        setEditingNote(null);
      } else {
        await saveNote({
          title: noteForm.title,
          content: noteForm.content,
          tags: noteForm.tags.split(',').map(tag => tag.trim()).filter(Boolean)
        });
      }
      
      setNoteForm({ title: '', content: '', tags: '' });
      setIsCreating(false);
    } catch (error) {
      // Error already handled in save/update functions
    }
  };

  const startEdit = (note: Note) => {
    setEditingNote(note);
    setNoteForm({
      title: note.title,
      content: note.content,
      tags: note.tags.join(', ')
    });
    setIsCreating(true);
  };

  const cancelEdit = () => {
    setEditingNote(null);
    setNoteForm({ title: '', content: '', tags: '' });
    setIsCreating(false);
  };

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading your notes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Planning Notes - Mēl Milaap</title>
        <meta name="description" content="Save ideas, inspiration, and notes for your wedding planning" />
      </Helmet>

      <Navigation />
      
      <div className="container mx-auto px-4 lg:px-8 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            className="flex items-center justify-between mb-8"
            variants={fadeInUp}
            initial="initial"
            animate="animate"
          >
            <div className="flex items-center space-x-3">
              <Link to="/planning">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Planning
                </Button>
              </Link>
              <div className="p-2 bg-primary/10 rounded-lg">
                <BookOpen className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-heading font-bold text-foreground">
                  Planning Notes
                </h1>
                <p className="text-muted-foreground">
                  Save ideas, inspiration, and thoughts for your wedding
                </p>
              </div>
            </div>
            
            <Dialog open={isCreating} onOpenChange={setIsCreating}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  New Note
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>
                    {editingNote ? 'Edit Note' : 'Create New Note'}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      placeholder="Note title..."
                      value={noteForm.title}
                      onChange={(e) => setNoteForm(prev => ({ ...prev, title: e.target.value }))}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="content">Content</Label>
                    <Textarea
                      id="content"
                      placeholder="Write your notes here..."
                      rows={8}
                      value={noteForm.content}
                      onChange={(e) => setNoteForm(prev => ({ ...prev, content: e.target.value }))}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="tags">Tags (comma-separated)</Label>
                    <Input
                      id="tags"
                      placeholder="venue, flowers, ideas..."
                      value={noteForm.tags}
                      onChange={(e) => setNoteForm(prev => ({ ...prev, tags: e.target.value }))}
                    />
                  </div>
                  
                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={cancelEdit}>
                      Cancel
                    </Button>
                    <Button type="submit">
                      {editingNote ? 'Update Note' : 'Save Note'}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </motion.div>

          {/* Search */}
          <motion.div
            className="mb-6"
            variants={fadeInUp}
            initial="initial"
            animate="animate"
          >
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search notes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </motion.div>

          {/* Notes Grid */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={staggerChildren}
            initial="initial"
            animate="animate"
          >
            {filteredNotes.length === 0 ? (
              <motion.div
                className="col-span-full text-center py-12"
                variants={fadeInUp}
              >
                <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">
                  {searchTerm ? 'No notes found' : 'No notes yet'}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm 
                    ? 'Try adjusting your search terms'
                    : 'Start capturing your wedding ideas and inspirations'
                  }
                </p>
                {!searchTerm && (
                  <Button onClick={() => setIsCreating(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Your First Note
                  </Button>
                )}
              </motion.div>
            ) : (
              filteredNotes.map((note) => (
                <motion.div key={note.id} variants={fadeInUp}>
                  <Card className="h-full hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg line-clamp-2">{note.title}</CardTitle>
                        <div className="flex space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => startEdit(note)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteNote(note.id)}
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {note.content && (
                          <p className="text-muted-foreground text-sm line-clamp-4">
                            {note.content}
                          </p>
                        )}
                        
                        {note.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {note.tags.map((tag, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                <Tag className="w-3 h-3 mr-1" />
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                        
                        <div className="text-xs text-muted-foreground">
                          Created {new Date(note.created_at).toLocaleDateString()}
                          {note.updated_at !== note.created_at && (
                            <span> • Updated {new Date(note.updated_at).toLocaleDateString()}</span>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PlanningNotes;
import { useState } from 'react';
import { Note } from '../types/note';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { ScrollArea } from './ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  StickyNote, 
  Plus, 
  Search, 
  Pin, 
  Tag,
  Edit,
  Trash2,
  Filter,
  X,
  Calendar,
  User
} from 'lucide-react';
import { toast } from 'sonner';

interface NotesSystemProps {
  notes: Note[];
  onAddNote?: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onUpdateNote?: (note: Note) => void;
  onDeleteNote?: (noteId: string) => void;
  currentUserId?: string;
  currentUserName?: string;
}

export function NotesSystem({ 
  notes, 
  onAddNote, 
  onUpdateNote, 
  onDeleteNote,
  currentUserId = 'u1',
  currentUserName = 'Current User'
}: NotesSystemProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [tagFilter, setTagFilter] = useState<string>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'general' as Note['category'],
    tags: [] as string[],
    isPinned: false,
    relatedId: '',
  });
  const [tagInput, setTagInput] = useState('');

  const allTags = Array.from(new Set(notes.flatMap(n => n.tags)));

  const filteredNotes = notes
    .filter(note => {
      const matchesSearch = !searchQuery || 
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategory = categoryFilter === 'all' || note.category === categoryFilter;
      const matchesTag = tagFilter === 'all' || note.tags.includes(tagFilter);

      return matchesSearch && matchesCategory && matchesTag;
    })
    .sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return b.updatedAt.getTime() - a.updatedAt.getTime();
    });

  const handleOpenDialog = (note?: Note) => {
    if (note) {
      setEditingNote(note);
      setFormData({
        title: note.title,
        content: note.content,
        category: note.category,
        tags: note.tags,
        isPinned: note.isPinned,
        relatedId: note.relatedId || '',
      });
    } else {
      setEditingNote(null);
      setFormData({
        title: '',
        content: '',
        category: 'general',
        tags: [],
        isPinned: false,
        relatedId: '',
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingNote(null);
    setFormData({
      title: '',
      content: '',
      category: 'general',
      tags: [],
      isPinned: false,
      relatedId: '',
    });
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()],
      });
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(t => t !== tag),
    });
  };

  const handleSaveNote = () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (editingNote) {
      const updatedNote: Note = {
        ...editingNote,
        title: formData.title,
        content: formData.content,
        category: formData.category,
        tags: formData.tags,
        isPinned: formData.isPinned,
        relatedId: formData.relatedId || undefined,
        updatedAt: new Date(),
      };
      onUpdateNote?.(updatedNote);
      toast.success('Note updated successfully');
    } else {
      const newNote: Omit<Note, 'id' | 'createdAt' | 'updatedAt'> = {
        title: formData.title,
        content: formData.content,
        category: formData.category,
        tags: formData.tags,
        author: currentUserId,
        authorName: currentUserName,
        isPinned: formData.isPinned,
        isPremium: false,
        relatedId: formData.relatedId || undefined,
      };
      onAddNote?.(newNote);
      toast.success('Note created successfully');
    }

    handleCloseDialog();
  };

  const handleDeleteNote = (noteId: string) => {
    if (confirm('Are you sure you want to delete this note?')) {
      onDeleteNote?.(noteId);
      toast.success('Note deleted successfully');
    }
  };

  const categoryColors = {
    vehicle: 'bg-blue-500/20 text-blue-400',
    rental: 'bg-green-500/20 text-green-400',
    maintenance: 'bg-orange-500/20 text-orange-400',
    partner: 'bg-purple-500/20 text-purple-400',
    general: 'bg-gray-500/20 text-gray-400',
  };

  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div className="space-y-6">
      {/* Header and Filters */}
      <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <StickyNote className="w-6 h-6 text-blue-400" />
            <h2 className="text-white text-xl">Notes</h2>
            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
              {filteredNotes.length}
            </Badge>
          </div>
          <Button
            onClick={() => handleOpenDialog()}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Note
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-gray-800 border-gray-700 text-white"
            />
          </div>

          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="vehicle">Vehicle</SelectItem>
              <SelectItem value="rental">Rental</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
              <SelectItem value="partner">Partner</SelectItem>
              <SelectItem value="general">General</SelectItem>
            </SelectContent>
          </Select>

          <Select value={tagFilter} onValueChange={setTagFilter}>
            <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
              <SelectValue placeholder="Tag" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              <SelectItem value="all">All Tags</SelectItem>
              {allTags.map(tag => (
                <SelectItem key={tag} value={tag}>{tag}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Notes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredNotes.map((note) => (
          <Card
            key={note.id}
            className={`cursor-pointer transition-all hover:scale-105 ${
              note.isPinned
                ? 'bg-gradient-to-br from-yellow-600 to-orange-600 border-yellow-500'
                : 'bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700'
            }`}
            onClick={() => handleOpenDialog(note)}
          >
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {note.isPinned && (
                      <Pin className="w-4 h-4 text-yellow-200 fill-yellow-200" />
                    )}
                    <h3 className={`font-semibold truncate ${note.isPinned ? 'text-white' : 'text-white'}`}>
                      {note.title}
                    </h3>
                  </div>
                  <Badge className={`${categoryColors[note.category]} border-0 text-xs`}>
                    {note.category}
                  </Badge>
                </div>
                <div className="flex items-center gap-1 ml-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-gray-400 hover:text-white"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenDialog(note);
                    }}
                  >
                    <Edit className="w-3 h-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-gray-400 hover:text-red-400"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteNote(note.id);
                    }}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>

              <p className={`text-sm mb-3 line-clamp-3 ${note.isPinned ? 'text-yellow-100' : 'text-gray-300'}`}>
                {note.content}
              </p>

              <div className="flex flex-wrap gap-1 mb-3">
                {note.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag} className="bg-gray-800 text-gray-300 border-gray-700 text-xs">
                    <Tag className="w-2 h-2 mr-1" />
                    {tag}
                  </Badge>
                ))}
                {note.tags.length > 3 && (
                  <Badge className="bg-gray-800 text-gray-300 border-gray-700 text-xs">
                    +{note.tags.length - 3}
                  </Badge>
                )}
              </div>

              <div className="flex items-center justify-between text-xs pt-2 border-t border-white/20">
                <div className="flex items-center gap-1 text-gray-400">
                  <User className="w-3 h-3" />
                  <span>{note.authorName}</span>
                </div>
                <div className="flex items-center gap-1 text-gray-400">
                  <Calendar className="w-3 h-3" />
                  <span>{formatDate(note.updatedAt)}</span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredNotes.length === 0 && (
        <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700 p-12 text-center">
          <StickyNote className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-white text-xl mb-2">No Notes Found</h3>
          <p className="text-gray-400 mb-4">Try adjusting your filters or create a new note</p>
          <Button onClick={() => handleOpenDialog()} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Create Note
          </Button>
        </Card>
      )}

      {/* Note Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-gradient-to-br from-gray-950 to-gray-900 border-gray-700 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingNote ? 'Edit Note' : 'Create New Note'}</DialogTitle>
            <DialogDescription className="text-gray-400">
              {editingNote ? 'Update your note details' : 'Add a new note to keep track of important information'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm text-gray-300">Title *</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Note title"
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-300">Content *</label>
              <Textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Note content..."
                className="bg-gray-800 border-gray-700 text-white min-h-[200px]"
                rows={8}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm text-gray-300">Category</label>
                <Select
                  value={formData.category}
                  onValueChange={(value: Note['category']) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="vehicle">Vehicle</SelectItem>
                    <SelectItem value="rental">Rental</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="partner">Partner</SelectItem>
                    <SelectItem value="general">General</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-gray-300">Related ID (optional)</label>
                <Input
                  value={formData.relatedId}
                  onChange={(e) => setFormData({ ...formData, relatedId: e.target.value })}
                  placeholder="Vehicle/Rental ID"
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-300">Tags</label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                  placeholder="Add tag and press Enter"
                  className="bg-gray-800 border-gray-700 text-white"
                />
                <Button onClick={handleAddTag} variant="outline" className="border-gray-600 text-gray-300">
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag) => (
                  <Badge key={tag} className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                    {tag}
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-2 hover:text-red-400"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="pin"
                checked={formData.isPinned}
                onChange={(e) => setFormData({ ...formData, isPinned: e.target.checked })}
                className="w-4 h-4 rounded"
              />
              <label htmlFor="pin" className="text-sm text-gray-300">Pin this note</label>
            </div>

            <div className="flex gap-3 justify-end pt-4 border-t border-gray-700">
              <Button
                variant="outline"
                onClick={handleCloseDialog}
                className="border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                Cancel
              </Button>
              <Button onClick={handleSaveNote} className="bg-blue-600 hover:bg-blue-700">
                {editingNote ? 'Update' : 'Create'} Note
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

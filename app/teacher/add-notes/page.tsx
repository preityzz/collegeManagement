"use client";

import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import {  Trash, Plus } from "lucide-react";

interface Note {
  _id: string;
  paperId: string;
  title: string;
  content: string;
  attachments: string[];
  createdAt: string;
}

export default function AddNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    paperId: "",
    title: "",
    content: "",
    attachments: [] as string[],
  });

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const response = await fetch("/api/teacher/notes");
      const data = await response.json();
      if (response.ok) {
        setNotes(data.notes);
      } else {
        toast.error(data.error || "Failed to fetch notes");
      }
    } catch  {
      toast.error("Error fetching notes");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/teacher/add-notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Notes added successfully");
        fetchNotes();
        resetForm();
      } else {
        toast.error(data.error || "Failed to add notes");
      }
    } catch  {
      toast.error("Error adding notes");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete these notes?")) return;

    try {
      const response = await fetch(`/api/teacher/notes/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Notes deleted successfully");
        fetchNotes();
      } else {
        const data = await response.json();
        toast.error(data.error || "Failed to delete notes");
      }
    } catch {
      toast.error("Error deleting notes");
    }
  };

  const resetForm = () => {
    setFormData({
      paperId: "",
      title: "",
      content: "",
      attachments: [],
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-500" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Add Notes</h1>
        <p className="mt-2 text-gray-600">Share course materials and notes</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Add Notes Form */}
        <div>
          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded-lg shadow"
          >
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Select Paper
                </label>
                <select
                  value={formData.paperId}
                  onChange={(e) =>
                    setFormData({ ...formData, paperId: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  required
                >
                  <option value="">Select Paper</option>
                  <option value="CSE101">Computer Science Fundamentals</option>
                  <option value="CSE102">Programming Basics</option>
                  <option value="MAT201">Mathematics</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Content
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                  rows={4}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  required
                />
              </div>

              <button
                type="submit"
                className="flex items-center space-x-2 w-full justify-center bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                <Plus className="w-4 h-4" />
                <span>Add Notes</span>
              </button>
            </div>
          </form>
        </div>

        {/* Notes List */}
        <div>
          <div className="space-y-4">
            {notes.map((note) => (
              <div
                key={note._id}
                className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium">{note.title}</h3>
                  <button
                    onClick={() => handleDelete(note._id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-gray-600 text-sm mb-2">{note.content}</p>
                <div className="text-xs text-gray-500">
                  Added on {new Date(note.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";

import {
  FileText,
  Download,
  Search,
  ChevronDown,
  Filter,
  Eye,
  Clock,
  Calendar,
  Loader2,
  AlertCircle,
  X,
  Bookmark,
  BookmarkPlus,
} from "lucide-react";

interface Note {
  _id: string;
  title: string;
  subject: string;
  description: string;
  fileUrl: string;
  fileType: string;
  fileSize: string;
  uploadedBy: string;
  uploadDate: string;
  semester: number;
  unit: number;
  topic: string;
}

export default function StudentNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSemester, setSelectedSemester] = useState<number | "all">(
    "all"
  );
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [selectedUnit, setSelectedUnit] = useState<number | "all">("all");
  const [bookmarkedNotes, setBookmarkedNotes] = useState<string[]>([]);
  const [previewNote, setPreviewNote] = useState<Note | null>(null);

  useEffect(() => {
    fetchNotes();
    // Load bookmarks from local storage
    const savedBookmarks = localStorage.getItem("bookmarkedNotes");
    if (savedBookmarks) {
      setBookmarkedNotes(JSON.parse(savedBookmarks));
    }
  }, []);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/student/notes");

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      setNotes(data);
    } catch (error) {
      console.error("Error fetching notes:", error);
      toast.error("Failed to load notes");
    } finally {
      setLoading(false);
    }
  };

  // Extract unique semesters from notes data
  const semesters =
    notes.length > 0
      ? [
          "all",
          ...Array.from(new Set(notes.map((note) => note.semester))).sort(
            (a, b) => a - b
          ),
        ]
      : ["all"];

  // Extract unique subjects from notes data
  const subjects =
    notes.length > 0
      ? ["all", ...Array.from(new Set(notes.map((note) => note.subject)))]
      : ["all"];

  // Extract unique units from notes data
  const units =
    notes.length > 0
      ? [
          "all",
          ...Array.from(new Set(notes.map((note) => note.unit))).sort(
            (a, b) => a - b
          ),
        ]
      : ["all"];

  // Filter notes based on selected filters
  const filteredNotes = notes.filter((note) => {
    const matchesSemester =
      selectedSemester === "all" || note.semester === selectedSemester;
    const matchesSubject =
      selectedSubject === "all" || note.subject === selectedSubject;
    const matchesUnit = selectedUnit === "all" || note.unit === selectedUnit;
    const matchesSearch =
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.topic.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSemester && matchesSubject && matchesUnit && matchesSearch;
  });

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Toggle bookmark
  const toggleBookmark = (noteId: string) => {
    let updatedBookmarks;
    if (bookmarkedNotes.includes(noteId)) {
      updatedBookmarks = bookmarkedNotes.filter((id) => id !== noteId);
      toast.success("Note removed from bookmarks");
    } else {
      updatedBookmarks = [...bookmarkedNotes, noteId];
      toast.success("Note added to bookmarks");
    }
    setBookmarkedNotes(updatedBookmarks);
    localStorage.setItem("bookmarkedNotes", JSON.stringify(updatedBookmarks));
  };

  // Get file icon based on file type
  const getFileIcon = (fileType: string) => {
    if (fileType.includes("pdf")) {
      return <FileText className="h-6 w-6 text-red-500" />;
    } else if (fileType.includes("ppt") || fileType.includes("powerpoint")) {
      return <FileText className="h-6 w-6 text-orange-500" />;
    } else if (fileType.includes("doc") || fileType.includes("word")) {
      return <FileText className="h-6 w-6 text-blue-500" />;
    } else if (fileType.includes("xls") || fileType.includes("excel")) {
      return <FileText className="h-6 w-6 text-green-500" />;
    } else {
      return <FileText className="h-6 w-6 text-gray-500" />;
    }
  };

  // Handle note preview
  const openPreview = (note: Note) => {
    setPreviewNote(note);
  };

  // Close note preview
  const closePreview = () => {
    setPreviewNote(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center">
          <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />
          <p className="mt-4 text-indigo-600 font-medium">Loading notes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold">Course Notes</h1>
          <p className="mt-2 text-indigo-100">
            Access lecture notes, study materials, and academic resources
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col space-y-4">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">
              Find Study Materials
            </h2>

            <div className="flex flex-wrap items-center gap-4">
              <div className="relative flex-grow max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search notes by title, subject, or topic..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border rounded-md text-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="relative">
                  <select
                    value={String(selectedSemester)}
                    onChange={(e) =>
                      setSelectedSemester(
                        e.target.value === "all"
                          ? "all"
                          : Number(e.target.value)
                      )
                    }
                    className="appearance-none pl-3 pr-10 py-2 border rounded-md bg-white text-sm focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    {semesters.map((semester) => (
                      <option key={semester} value={semester}>
                        {semester === "all"
                          ? "All Semesters"
                          : `Semester ${semester}`}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  </div>
                </div>

                <div className="relative">
                  <select
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    className="appearance-none pl-3 pr-10 py-2 border rounded-md bg-white text-sm focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    {subjects.map((subject) => (
                      <option key={subject} value={subject}>
                        {subject === "all" ? "All Subjects" : subject}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  </div>
                </div>

                <div className="relative">
                  <select
                    value={String(selectedUnit)}
                    onChange={(e) =>
                      setSelectedUnit(
                        e.target.value === "all"
                          ? "all"
                          : Number(e.target.value)
                      )
                    }
                    className="appearance-none pl-3 pr-10 py-2 border rounded-md bg-white text-sm focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    {units.map((unit) => (
                      <option key={unit} value={unit}>
                        {unit === "all" ? "All Units" : `Unit ${unit}`}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSelectedSemester("all");
                    setSelectedSubject("all");
                    setSelectedUnit("all");
                    setSearchTerm("");
                  }}
                  className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <Filter className="h-3 w-3 mr-1" />
                  Clear
                </button>
              </div>
            </div>

            {notes.length > 0 && (
              <div className="text-sm text-gray-500">
                Showing {filteredNotes.length} of {notes.length} notes
              </div>
            )}
          </div>
        </div>

        {/* Bookmarked Notes Section */}
        {bookmarkedNotes.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
              <Bookmark className="h-5 w-5 text-indigo-500 mr-2" />
              Bookmarked Notes
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {notes
                .filter((note) => bookmarkedNotes.includes(note._id))
                .map((note) => (
                  <div
                    key={note._id}
                    className="bg-white rounded-lg shadow-sm overflow-hidden border border-yellow-200 hover:shadow-md transition-shadow"
                  >
                    <div className="p-5">
                      <div className="flex justify-between items-start">
                        <div className="flex items-start space-x-3">
                          {getFileIcon(note.fileType)}
                          <div>
                            <h3 className="font-medium text-gray-900 line-clamp-1">
                              {note.title}
                            </h3>
                            <p className="text-sm text-gray-500 mt-1">
                              {note.subject}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => toggleBookmark(note._id)}
                          className="text-yellow-500 hover:text-yellow-600"
                          title="Remove bookmark"
                        >
                          <Bookmark className="h-5 w-5 fill-current" />
                        </button>
                      </div>
                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center space-x-2 text-xs text-gray-500">
                          <span className="inline-flex items-center px-2 py-0.5 rounded bg-blue-50 text-blue-700">
                            Semester {note.semester}
                          </span>
                          <span className="inline-flex items-center px-2 py-0.5 rounded bg-purple-50 text-purple-700">
                            Unit {note.unit}
                          </span>
                        </div>
                      </div>
                      <div className="mt-4 flex items-center justify-between">
                        <div>
                          <button
                            onClick={() => openPreview(note)}
                            className="inline-flex items-center px-3 py-1 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            Preview
                          </button>
                          <a
                            href={note.fileUrl}
                            download
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-2 inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          >
                            <Download className="h-3 w-3 mr-1" />
                            Download
                          </a>
                        </div>
                        <span className="text-xs text-gray-500 flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {formatDate(note.uploadDate)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Notes Grid */}
        {filteredNotes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNotes.map((note) => (
              <div
                key={note._id}
                className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="p-5">
                  <div className="flex justify-between items-start">
                    <div className="flex items-start space-x-3">
                      {getFileIcon(note.fileType)}
                      <div>
                        <h3 className="font-medium text-gray-900 line-clamp-1">
                          {note.title}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {note.subject}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleBookmark(note._id)}
                      className={`text-gray-400 hover:text-yellow-500 ${
                        bookmarkedNotes.includes(note._id) && "text-yellow-500"
                      }`}
                      title={
                        bookmarkedNotes.includes(note._id)
                          ? "Remove bookmark"
                          : "Bookmark this note"
                      }
                    >
                      {bookmarkedNotes.includes(note._id) ? (
                        <Bookmark className="h-5 w-5 fill-current" />
                      ) : (
                        <BookmarkPlus className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                    {note.description || `Study material for ${note.topic}`}
                  </p>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      <span className="inline-flex items-center px-2 py-0.5 rounded bg-blue-50 text-blue-700">
                        Semester {note.semester}
                      </span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded bg-purple-50 text-purple-700">
                        Unit {note.unit}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {note.fileSize}
                    </span>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <div>
                      <button
                        onClick={() => openPreview(note)}
                        className="inline-flex items-center px-3 py-1 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        Preview
                      </button>
                      <a
                        href={note.fileUrl}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-2 inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        <Download className="h-3 w-3 mr-1" />
                        Download
                      </a>
                    </div>
                    <span className="text-xs text-gray-500 flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {formatDate(note.uploadDate)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="flex flex-col items-center">
              <AlertCircle className="h-12 w-12 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No notes found
              </h3>
              <p className="text-sm text-gray-500 max-w-md mx-auto">
                We couldn&apos;t find any notes matching your criteria. Try
                adjusting your filters or search term.
              </p>
              <button
                onClick={() => {
                  setSelectedSemester("all");
                  setSelectedSubject("all");
                  setSelectedUnit("all");
                  setSearchTerm("");
                }}
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <Filter className="h-4 w-4 mr-2" />
                Clear all filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Note Preview Modal */}
      {previewNote && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] flex flex-col">
            <div className="p-4 border-b flex items-center justify-between">
              <div className="flex items-center">
                {getFileIcon(previewNote.fileType)}
                <h3 className="text-lg font-medium text-gray-900 ml-2">
                  {previewNote.title}
                </h3>
              </div>
              <button
                onClick={closePreview}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-4 border-b">
              <div className="flex flex-col space-y-2">
                <div className="flex justify-between">
                  <div>
                    <span className="text-sm font-medium text-gray-700">
                      Subject:
                    </span>
                    <span className="ml-2 text-sm text-gray-600">
                      {previewNote.subject}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">
                      Uploaded:
                    </span>
                    <span className="ml-2 text-sm text-gray-600">
                      {formatDate(previewNote.uploadDate)}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <div>
                    <span className="text-sm font-medium text-gray-700">
                      Semester:
                    </span>
                    <span className="ml-2 text-sm text-gray-600">
                      {previewNote.semester}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">
                      Unit:
                    </span>
                    <span className="ml-2 text-sm text-gray-600">
                      {previewNote.unit}
                    </span>
                  </div>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700">
                    Topic:
                  </span>
                  <span className="ml-2 text-sm text-gray-600">
                    {previewNote.topic}
                  </span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700">
                    Description:
                  </span>
                  <p className="text-sm text-gray-600 mt-1">
                    {previewNote.description || "No description provided."}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex-grow overflow-hidden">
              <iframe
                src={`${previewNote.fileUrl}#toolbar=0`}
                className="w-full h-full"
                title={previewNote.title}
              ></iframe>
            </div>
            <div className="p-4 border-t flex justify-between">
              <div>
                <button
                  onClick={() => toggleBookmark(previewNote._id)}
                  className={`inline-flex items-center px-4 py-2 border rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                    bookmarkedNotes.includes(previewNote._id)
                      ? "bg-yellow-50 text-yellow-700 border-yellow-300 hover:bg-yellow-100"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {bookmarkedNotes.includes(previewNote._id) ? (
                    <>
                      <Bookmark className="h-4 w-4 mr-2 fill-current" />
                      Bookmarked
                    </>
                  ) : (
                    <>
                      <BookmarkPlus className="h-4 w-4 mr-2" />
                      Bookmark
                    </>
                  )}
                </button>
              </div>
              <div>
                <button
                  onClick={closePreview}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mr-2"
                >
                  Close
                </button>
                <a
                  href={previewNote.fileUrl}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

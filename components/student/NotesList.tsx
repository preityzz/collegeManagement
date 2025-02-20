import { useEffect, useState } from "react";
import axios from "axios";

interface Note {
  _id: string;
  content: string;
  createdAt: string;
}

export default function NotesList({ studentId }: { studentId: string }) {
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    const fetchNotes = async () => {
      const res = await axios.get(`/api/student/notes?studentId=${studentId}`);
      setNotes(res.data);
    };
    fetchNotes();
  }, [studentId]);

  return (
    <div className="bg-white shadow rounded-lg p-4">
      <h3 className="text-lg font-semibold mb-4">Notes</h3>
      <ul>
        {notes.map((note) => (
          <li key={note._id} className="mb-2 p-2 bg-gray-50 rounded">
            <p>{note.content}</p>
            <p className="text-sm text-gray-500">
              {new Date(note.createdAt).toLocaleString()}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

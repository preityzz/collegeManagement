import { useState } from "react";
import axios from "axios";

export default function AddNotesForm() {
  const [paperId, setPaperId] = useState("");
  const [content, setContent] = useState("");

interface AddNotesData {
    paperId: string;
    content: string;
}

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await axios.post<AddNotesData>("/api/teacher/add-notes", { paperId, content });
    alert("Notes added successfully");
};

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-4">
      <h3 className="text-lg font-semibold mb-4">Add Notes</h3>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Paper ID</label>
        <input
          type="text"
          value={paperId}
          onChange={(e) => setPaperId(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Content</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <button type="submit" className="bg-blue-500 text-white p-2 rounded">
        Add Notes
      </button>
    </form>
  );
}

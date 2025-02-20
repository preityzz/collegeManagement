import { useState } from "react";
import axios from "axios";

export default function AddMarksForm() {
  const [studentId, setStudentId] = useState("");
  const [paperId, setPaperId] = useState("");
  const [marks, setMarks] = useState("");

interface MarkSubmission {
    studentId: string;
    paperId: string;
    marks: string;
}

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    await axios.post<void>("/api/teacher/add-marks", { 
        studentId, 
        paperId, 
        marks 
    } as MarkSubmission);
    alert("Marks added successfully");
};

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-4">
      <h3 className="text-lg font-semibold mb-4">Add Marks</h3>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Student ID</label>
        <input
          type="text"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
      </div>
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
        <label className="block text-sm font-medium mb-1">Marks</label>
        <input
          type="number"
          value={marks}
          onChange={(e) => setMarks(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <button type="submit" className="bg-blue-500 text-white p-2 rounded">
        Add Marks
      </button>
    </form>
  );
}

import { useState } from "react";
import axios from "axios";

export default function ApproveTeacherForm() {
  const [teacherId, setTeacherId] = useState("");

interface ApproveTeacherRequest {
    teacherId: string;
}

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    await axios.post<void>("/api/hod/approve-teacher", { teacherId } as ApproveTeacherRequest);
    alert("Teacher approved successfully");
};

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-4">
      <h3 className="text-lg font-semibold mb-4">Approve Teacher</h3>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Teacher ID</label>
        <input
          type="text"
          value={teacherId}
          onChange={(e) => setTeacherId(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <button type="submit" className="bg-blue-500 text-white p-2 rounded">
        Approve Teacher
      </button>
    </form>
  );
}

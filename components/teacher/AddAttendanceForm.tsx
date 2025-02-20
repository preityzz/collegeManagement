import { useState } from "react";
import axios from "axios";

export default function AddAttendanceForm() {
  const [studentId, setStudentId] = useState("");
  const [paperId, setPaperId] = useState("");
  const [date, setDate] = useState("");
  const [status, setStatus] = useState("");

interface AttendanceData {
    studentId: string;
    paperId: string;
    date: string;
    status: string;
}

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    await axios.post<AttendanceData>("/api/teacher/add-attendance", {
        studentId,
        paperId,
        date,
        status,
    });
    alert("Attendance added successfully");
};

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-4">
      <h3 className="text-lg font-semibold mb-4">Add Attendance</h3>
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
        <label className="block text-sm font-medium mb-1">Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full p-2 border rounded"
          required
        >
          <option value="Present">Present</option>
          <option value="Absent">Absent</option>
        </select>
      </div>
      <button type="submit" className="bg-blue-500 text-white p-2 rounded">
        Add Attendance
      </button>
    </form>
  );
}

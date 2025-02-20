import { useState } from "react";
import axios from "axios";

export default function ManageTimetableForm() {
  const [semester, setSemester] = useState("");
  const [schedule, setSchedule] = useState("");

interface Schedule {
    day: string;
    subjects: {
        name: string;
        time: string;
    }[];
}

interface TimetableData {
    semester: string;
    schedule: Schedule[];
}

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await axios.post<void, void, TimetableData>("/api/hod/manage-timetable", {
        semester,
        schedule: JSON.parse(schedule),
    });
    alert("Timetable updated successfully");
};

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-4">
      <h3 className="text-lg font-semibold mb-4">Manage Timetable</h3>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Semester</label>
        <input
          type="text"
          value={semester}
          onChange={(e) => setSemester(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">
          Schedule (JSON)
        </label>
        <textarea
          value={schedule}
          onChange={(e) => setSchedule(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder='[{"day": "Monday", "subjects": [{"name": "Math", "time": "10:00 AM"}]}]'
          required
        />
      </div>
      <button type="submit" className="bg-blue-500 text-white p-2 rounded">
        Update Timetable
      </button>
    </form>
  );
}

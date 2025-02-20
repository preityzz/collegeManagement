import { useEffect, useState } from "react";
import axios from "axios";

interface AttendanceRecord {
  _id: string;
  date: string;
  status: string;
}

export default function AttendanceTable({ studentId }: { studentId: string }) {
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);

  useEffect(() => {
    const fetchAttendance = async () => {
      const res = await axios.get(
        `/api/student/attendance?studentId=${studentId}`
      );
      setAttendance(res.data);
    };
    fetchAttendance();
  }, [studentId]);

  return (
    <div className="bg-white shadow rounded-lg p-4">
      <h3 className="text-lg font-semibold mb-4">Attendance</h3>
      <table className="min-w-full">
        <thead>
          <tr>
            <th className="text-left">Date</th>
            <th className="text-left">Status</th>
          </tr>
        </thead>
        <tbody>
          {attendance.map((record) => (
            <tr key={record._id} className="border-b">
              <td className="p-2">
                {new Date(record.date).toLocaleDateString()}
              </td>
              <td className="p-2">{record.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

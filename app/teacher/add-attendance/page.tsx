"use client";

import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { Check, X, Search, Calendar, UserCheck } from "lucide-react";

interface Student {
  _id: string;
  name: string;
  rollNo: string;
}

interface AttendanceRecord {
  studentId: string;
  date: string;
  status: "present" | "absent";
}

export default function AddAttendance() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [attendance, setAttendance] = useState<Record<string, boolean>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await fetch("/api/teacher/students");
      const data = await response.json();
      if (response.ok) {
        setStudents(data.students);
        // Initialize attendance state
        const initialAttendance: Record<string, boolean> = {};
        data.students.forEach((student: Student) => {
          initialAttendance[student._id] = true;
        });
        setAttendance(initialAttendance);
      } else {
        toast.error(data.error || "Failed to fetch students");
      }
    } catch {
      toast.error("Error fetching students");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const attendanceRecords: AttendanceRecord[] = Object.entries(
        attendance
      ).map(([studentId, isPresent]) => ({
        studentId,
        date: selectedDate,
        status: isPresent ? "present" : "absent",
      }));

      const response = await fetch("/api/teacher/add-attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ attendance: attendanceRecords }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Attendance recorded successfully");
        // Reset attendance after successful submission
        const resetAttendance: Record<string, boolean> = {};
        students.forEach((student) => {
          resetAttendance[student._id] = true;
        });
        setAttendance(resetAttendance);
      } else {
        toast.error(data.error || "Failed to record attendance");
      }
    } catch {
      toast.error("Error recording attendance");
    } finally {
      setSubmitting(false);
    }
  };

  const markAllPresent = () => {
    const newAttendance = { ...attendance };
    students.forEach((student) => {
      newAttendance[student._id] = true;
    });
    setAttendance(newAttendance);
  };

  const markAllAbsent = () => {
    const newAttendance = { ...attendance };
    students.forEach((student) => {
      newAttendance[student._id] = false;
    });
    setAttendance(newAttendance);
  };

  const presentCount = Object.values(attendance).filter(Boolean).length;
  const absentCount = students.length - presentCount;

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.rollNo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          <UserCheck className="mr-2 h-8 w-8 text-blue-600" />
          Mark Attendance
        </h1>
        <p className="mt-2 text-gray-600">Record daily student attendance</p>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        {/* Date and Search Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Date
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 px-10 py-2.5 focus:border-blue-500 focus:ring-blue-500 transition"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Search Students
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
              <input
                type="text"
                placeholder="Search by name or roll number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 pl-10 pr-3 py-2.5 focus:border-blue-500 focus:ring-blue-500 transition"
              />
            </div>
          </div>
        </div>

        {/* Quick actions */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center space-x-2">
            <button
              onClick={markAllPresent}
              className="inline-flex items-center px-4 py-2 text-sm bg-green-50 text-green-700 rounded-lg border border-green-200 hover:bg-green-100 transition"
            >
              <Check className="w-4 h-4 mr-1" /> Mark All Present
            </button>
            <button
              onClick={markAllAbsent}
              className="inline-flex items-center px-4 py-2 text-sm bg-red-50 text-red-700 rounded-lg border border-red-200 hover:bg-red-100 transition"
            >
              <X className="w-4 h-4 mr-1" /> Mark All Absent
            </button>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-sm font-medium">
              <span className="text-green-600">{presentCount}</span> Present
            </div>
            <div className="text-sm font-medium">
              <span className="text-red-600">{absentCount}</span> Absent
            </div>
          </div>
        </div>

        {/* Attendance Table */}
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase">
                  Roll No
                </th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase">
                  Name
                </th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase">
                  Attendance
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <tr key={student._id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">
                      {student.rollNo}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {student.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-3">
                        <button
                          onClick={() =>
                            setAttendance({
                              ...attendance,
                              [student._id]: true,
                            })
                          }
                          className={`flex items-center justify-center px-3 py-1.5 rounded-lg transition ${
                            attendance[student._id]
                              ? "bg-green-100 text-green-700 border border-green-200 shadow-sm"
                              : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                          }`}
                        >
                          <Check className="w-4 h-4 mr-1" /> Present
                        </button>
                        <button
                          onClick={() =>
                            setAttendance({
                              ...attendance,
                              [student._id]: false,
                            })
                          }
                          className={`flex items-center justify-center px-3 py-1.5 rounded-lg transition ${
                            !attendance[student._id]
                              ? "bg-red-100 text-red-700 border border-red-200 shadow-sm"
                              : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                          }`}
                        >
                          <X className="w-4 h-4 mr-1" /> Absent
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={3}
                    className="px-6 py-10 text-center text-gray-500"
                  >
                    No students found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Submit Button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition shadow-sm flex items-center disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <>
                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent mr-2 align-[-0.125em]"></span>
                Submitting...
              </>
            ) : (
              "Submit Attendance"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

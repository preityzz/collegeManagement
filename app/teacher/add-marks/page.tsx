"use client";

import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { Search, Save,} from "lucide-react";

interface Student {
  _id: string;
  name: string;
  rollNo: string;
}

interface MarksRecord {
  studentId: string;
  paperId: string;
  marks: {
    internal: number;
    midterm: number;
    final: number;
  };
}

export default function AddMarks() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPaper, setSelectedPaper] = useState("");
  const [marks, setMarks] = useState<
    Record<string, { internal: number; midterm: number; final: number }>
  >({});

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await fetch("/api/teacher/students");
      const data = await response.json();
      if (response.ok) {
        setStudents(data.students);
        // Initialize marks state
        const initialMarks: Record<
          string,
          { internal: number; midterm: number; final: number }
        > = {};
        data.students.forEach((student: Student) => {
          initialMarks[student._id] = { internal: 0, midterm: 0, final: 0 };
        });
        setMarks(initialMarks);
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
    if (!selectedPaper) {
      toast.error("Please select a paper");
      return;
    }

    try {
      const marksRecords: MarksRecord[] = Object.entries(marks).map(
        ([studentId, studentMarks]) => ({
          studentId,
          paperId: selectedPaper,
          marks: studentMarks,
        })
      );

      const response = await fetch("/api/teacher/add-marks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ marks: marksRecords }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Marks recorded successfully");
        // Reset marks after successful submission
        const resetMarks: Record<
          string,
          { internal: number; midterm: number; final: number }
        > = {};
        students.forEach((student) => {
          resetMarks[student._id] = { internal: 0, midterm: 0, final: 0 };
        });
        setMarks(resetMarks);
      } else {
        toast.error(data.error || "Failed to record marks");
      }
    } catch {
      toast.error("Error recording marks");
    }
  };

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.rollNo.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        <h1 className="text-2xl font-bold text-gray-900">Add Marks</h1>
        <p className="mt-2 text-gray-600">
          Record student marks for different assessments
        </p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Paper
            </label>
            <select
              value={selectedPaper}
              onChange={(e) => setSelectedPaper(e.target.value)}
              className="block w-full rounded-md border border-gray-300 px-3 py-2"
              required
            >
              <option value="">Select Paper</option>
              <option value="CSE101">Computer Science Fundamentals</option>
              <option value="CSE102">Programming Basics</option>
              <option value="MAT201">Mathematics</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search Students
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search by name or roll number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full rounded-md border border-gray-300 pl-10 pr-3 py-2"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Marks Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Roll No
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Internal (30)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Midterm (40)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Final (100)
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredStudents.map((student) => (
                <tr key={student._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {student.rollNo}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {student.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="number"
                      min="0"
                      max="30"
                      value={marks[student._id]?.internal || 0}
                      onChange={(e) =>
                        setMarks({
                          ...marks,
                          [student._id]: {
                            ...marks[student._id],
                            internal: Number(e.target.value),
                          },
                        })
                      }
                      className="w-20 rounded-md border border-gray-300 px-3 py-2"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="number"
                      min="0"
                      max="40"
                      value={marks[student._id]?.midterm || 0}
                      onChange={(e) =>
                        setMarks({
                          ...marks,
                          [student._id]: {
                            ...marks[student._id],
                            midterm: Number(e.target.value),
                          },
                        })
                      }
                      className="w-20 rounded-md border border-gray-300 px-3 py-2"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={marks[student._id]?.final || 0}
                      onChange={(e) =>
                        setMarks({
                          ...marks,
                          [student._id]: {
                            ...marks[student._id],
                            final: Number(e.target.value),
                          },
                        })
                      }
                      className="w-20 rounded-md border border-gray-300 px-3 py-2"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Submit Button */}
        <div className="mt-6">
          <button
            onClick={handleSubmit}
            className="flex items-center space-x-2 bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600"
          >
            <Save className="w-4 h-4" />
            <span>Save Marks</span>
          </button>
        </div>
      </div>
    </div>
  );
}

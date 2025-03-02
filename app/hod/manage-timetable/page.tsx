"use client";

import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { Trash, Edit } from "lucide-react";

interface Timetable {
  _id: string;
  semester: string;
  day: string;
  subject: string;
  startTime: string;
  endTime: string;
  teacher: string;
  room: string;
}

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

export default function ManageTimetable() {
  const [timetables, setTimetables] = useState<Timetable[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    semester: "",
    day: "",
    subject: "",
    startTime: "",
    endTime: "",
    teacher: "",
    room: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState("");

  useEffect(() => {
    fetchTimetables();
  }, []);

  const fetchTimetables = async () => {
    try {
      const response = await fetch("/api/hod/manage-timetable");
      const data = await response.json();
      if (response.ok) {
        setTimetables(data.timetables);
      } else {
        toast.error(data.error || "Failed to fetch timetables");
      }
    } catch {
      toast.error("Error fetching timetables");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = isEditing
        ? `/api/hod/manage-timetable/${editId}`
        : "/api/hod/manage-timetable";

      const response = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(isEditing ? "Schedule updated" : "Schedule added");
        fetchTimetables();
        resetForm();
      } else {
        toast.error(data.error || "Operation failed");
      }
    } catch  {
      toast.error("Error performing operation");
    }
  };

  const handleEdit = (timetable: Timetable) => {
    setFormData({
      semester: timetable.semester,
      day: timetable.day,
      subject: timetable.subject,
      startTime: timetable.startTime,
      endTime: timetable.endTime,
      teacher: timetable.teacher,
      room: timetable.room,
    });
    setIsEditing(true);
    setEditId(timetable._id);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this schedule?")) return;

    try {
      const response = await fetch(`/api/hod/manage-timetable/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Schedule deleted successfully");
        fetchTimetables();
      } else {
        const data = await response.json();
        toast.error(data.error || "Failed to delete schedule");
      }
    } catch  {
      toast.error("Error deleting schedule");
    }
  };

  const resetForm = () => {
    setFormData({
      semester: "",
      day: "",
      subject: "",
      startTime: "",
      endTime: "",
      teacher: "",
      room: "",
    });
    setIsEditing(false);
    setEditId("");
  };

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
        <h1 className="text-2xl font-bold text-gray-900">Manage Timetable</h1>
        <p className="mt-2 text-gray-600">Create and manage class schedules</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Section */}
        <div className="lg:col-span-1">
          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded-lg shadow"
          >
            <h2 className="text-lg font-semibold mb-4">
              {isEditing ? "Edit Schedule" : "Add New Schedule"}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Semester
                </label>
                <select
                  value={formData.semester}
                  onChange={(e) =>
                    setFormData({ ...formData, semester: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  required
                >
                  <option value="">Select Semester</option>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                    <option key={sem} value={sem}>
                      Semester {sem}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Day
                </label>
                <select
                  value={formData.day}
                  onChange={(e) =>
                    setFormData({ ...formData, day: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  required
                >
                  <option value="">Select Day</option>
                  {days.map((day) => (
                    <option key={day} value={day}>
                      {day}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Subject
                </label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) =>
                    setFormData({ ...formData, subject: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={formData.startTime}
                    onChange={(e) =>
                      setFormData({ ...formData, startTime: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    End Time
                  </label>
                  <input
                    type="time"
                    value={formData.endTime}
                    onChange={(e) =>
                      setFormData({ ...formData, endTime: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Teacher
                </label>
                <input
                  type="text"
                  value={formData.teacher}
                  onChange={(e) =>
                    setFormData({ ...formData, teacher: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Room
                </label>
                <input
                  type="text"
                  value={formData.room}
                  onChange={(e) =>
                    setFormData({ ...formData, room: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  required
                />
              </div>

              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  {isEditing ? "Update Schedule" : "Add Schedule"}
                </button>
                {isEditing && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>

        {/* Timetable List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Day
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Subject
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Teacher
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Room
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {timetables.map((timetable) => (
                    <tr key={timetable._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {timetable.day}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {timetable.subject}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {timetable.startTime} - {timetable.endTime}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {timetable.teacher}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {timetable.room}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(timetable)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <Edit className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(timetable._id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

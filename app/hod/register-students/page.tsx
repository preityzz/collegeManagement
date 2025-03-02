"use client";

import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import {  Edit, Trash, Search } from "lucide-react";

interface Student {
  _id: string;
  name: string;
  email: string;
  rollNo: string;
  semester: string;
  branch: string;
}

export default function RegisterStudents() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    rollNo: "",
    semester: "",
    branch: "",
    password: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState("");

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await fetch("/api/hod/students");
      const data = await response.json();
      if (response.ok) {
        setStudents(data.students);
      } else {
        toast.error(data.error || "Failed to fetch students");
      }
    } catch {
      toast.error("Error fetching students");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = isEditing
        ? `/api/hod/students/${editId}`
        : "/api/hod/register-student";

      const response = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(
          isEditing
            ? "Student updated successfully"
            : "Student registered successfully"
        );
        fetchStudents();
        resetForm();
      } else {
        toast.error(data.error || "Operation failed");
      }
    } catch {
      toast.error("Error performing operation");
    }
  };

  const handleEdit = (student: Student) => {
    setFormData({
      name: student.name,
      email: student.email,
      rollNo: student.rollNo,
      semester: student.semester,
      branch: student.branch,
      password: "",
    });
    setIsEditing(true);
    setEditId(student._id);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this student?")) return;

    try {
      const response = await fetch(`/api/hod/students/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Student deleted successfully");
        fetchStudents();
      } else {
        const data = await response.json();
        toast.error(data.error || "Failed to delete student");
      }
    } catch {
      toast.error("Error deleting student");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      rollNo: "",
      semester: "",
      branch: "",
      password: "",
    });
    setIsEditing(false);
    setEditId("");
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
        <h1 className="text-2xl font-bold text-gray-900">Register Students</h1>
        <p className="mt-2 text-gray-600">
          Add and manage student registrations
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Section */}
        <div className="lg:col-span-1">
          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded-lg shadow"
          >
            <h2 className="text-lg font-semibold mb-4">
              {isEditing ? "Edit Student" : "Register New Student"}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Roll Number
                </label>
                <input
                  type="text"
                  value={formData.rollNo}
                  onChange={(e) =>
                    setFormData({ ...formData, rollNo: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  required
                />
              </div>

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
                  Branch
                </label>
                <select
                  value={formData.branch}
                  onChange={(e) =>
                    setFormData({ ...formData, branch: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  required
                >
                  <option value="">Select Branch</option>
                  <option value="CSE">Computer Science</option>
                  <option value="ECE">Electronics</option>
                  <option value="ME">Mechanical</option>
                  <option value="CE">Civil</option>
                </select>
              </div>

              {!isEditing && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                    required={!isEditing}
                    minLength={6}
                  />
                </div>
              )}

              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  {isEditing ? "Update Student" : "Register Student"}
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

        {/* Students List */}
        <div className="lg:col-span-2">
          <div className="mb-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 pl-10 rounded-lg border border-gray-300"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Roll No
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Semester
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Branch
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredStudents.map((student) => (
                    <tr key={student._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {student.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {student.rollNo}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {student.semester}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {student.branch}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(student)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <Edit className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(student._id)}
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

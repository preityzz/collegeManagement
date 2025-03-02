"use client";

import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";

interface Teacher {
  _id: string;
  name: string;
  email: string;
  role: string;
}

export default function ApproveTeacher() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingTeachers();
  }, []);

  const fetchPendingTeachers = async () => {
    try {
      const response = await fetch("/api/hod/approve-teacher");
      const data = await response.json();
      if (response.ok) {
        setTeachers(data.teachers);
      } else {
        toast.error(data.error || "Failed to fetch teachers");
      }
    } catch {
      toast.error("Error fetching teachers");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (teacherId: string) => {
    try {
      const response = await fetch("/api/hod/approve-teacher", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teacherId }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Teacher approved successfully");
        // Remove approved teacher from the list
        setTeachers(teachers.filter((teacher) => teacher._id !== teacherId));
      } else {
        toast.error(data.error || "Failed to approve teacher");
      }
    } catch {
      toast.error("Error approving teacher");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-500" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Approve Teachers</h1>

      {teachers.length === 0 ? (
        <p className="text-gray-500">No pending teacher approvals</p>
      ) : (
        <div className="grid gap-4">
          {teachers.map((teacher) => (
            <div
              key={teacher._id}
              className="p-4 border rounded-lg shadow-sm flex items-center justify-between"
            >
              <div>
                <h2 className="font-semibold">{teacher.name}</h2>
                <p className="text-sm text-gray-500">{teacher.email}</p>
              </div>
              <button
                onClick={() => handleApprove(teacher._id)}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                Approve
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

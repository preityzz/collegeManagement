"use client";

import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import {
  Calendar,
  CheckCircle,
  XCircle,
  ChevronDown,
  Clock,
  AlertTriangle,
  Filter,
  Search,
} from "lucide-react";

interface AttendanceRecord {
  _id: string;
  paperId: string;
  date: string;
  status: "present" | "absent";
  subject: string;
}

export default function StudentAttendance() {
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    try {
      const response = await fetch("/api/student/attendance");
      const data = await response.json();
      if (response.ok) {
        // Ensure we have an array even if data.attendance is undefined
        setAttendance(data.attendance || []);
      } else {
        toast.error(data.error || "Failed to fetch attendance");
        setAttendance([]);
      }
    } catch (error) {
      console.error("Error fetching attendance:", error);
      toast.error("Error fetching attendance");
      setAttendance([]);
    } finally {
      setLoading(false);
    }
  };

  const calculateAttendancePercentage = (subject?: string) => {
    // Safety check for attendance
    if (!attendance || attendance.length === 0) return 0;

    const filteredAttendance =
      subject && subject !== "all"
        ? attendance.filter((record) => record.subject === subject)
        : attendance;

    const totalClasses = filteredAttendance.length;
    if (totalClasses === 0) return 0;

    const presentClasses = filteredAttendance.filter(
      (record) => record.status === "present"
    ).length;

    return Math.round((presentClasses / totalClasses) * 100);
  };

  const getAttendanceStatus = (percentage: number) => {
    if (percentage >= 85)
      return { status: "Excellent", color: "text-green-500" };
    if (percentage >= 75) return { status: "Good", color: "text-blue-500" };
    if (percentage >= 65)
      return { status: "Average", color: "text-yellow-500" };
    return { status: "At Risk", color: "text-red-500" };
  };

  // Safe way to get subjects
  const subjectSet = new Set<string>();
  if (attendance && attendance.length > 0) {
    attendance.forEach((record) => {
      if (record.subject) {
        subjectSet.add(record.subject);
      }
    });
  }
  const subjects = ["all", ...Array.from(subjectSet)];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-indigo-600 font-medium">
            Loading your attendance records...
          </p>
        </div>
      </div>
    );
  }

  // Safe filtering with null checks
  const filteredBySubject =
    attendance && attendance.length > 0
      ? selectedSubject === "all"
        ? attendance
        : attendance.filter((record) => record.subject === selectedSubject)
      : [];

  const filteredByTab =
    filteredBySubject && filteredBySubject.length > 0
      ? activeTab === "all"
        ? filteredBySubject
        : filteredBySubject.filter((record) => record.status === activeTab)
      : [];

  const filteredAttendance =
    filteredByTab && filteredByTab.length > 0
      ? filteredByTab.filter(
          (record) =>
            record.subject &&
            record.subject.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : [];

  // Safely calculate counts
  const presentCount =
    attendance && attendance.length > 0
      ? attendance.filter((record) => record.status === "present").length
      : 0;

  const absentCount =
    attendance && attendance.length > 0
      ? attendance.filter((record) => record.status === "absent").length
      : 0;

  const overallPercentage = calculateAttendancePercentage();
  const attendanceStatus = getAttendanceStatus(overallPercentage);

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold">Attendance Dashboard</h1>
          <p className="mt-2 text-indigo-100">
            Track your attendance records and academic presence
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        {/* Main attendance card */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Overall stats */}
            <div className="col-span-1">
              <div className="flex flex-col h-full">
                <h2 className="text-lg font-semibold text-gray-700 mb-4">
                  Overall Attendance
                </h2>
                <div className="flex-grow flex flex-col items-center justify-center p-6 bg-gray-50 rounded-xl">
                  <div className="relative w-40 h-40">
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="#e2e8f0"
                        strokeWidth="10"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke={
                          overallPercentage >= 85
                            ? "#10b981"
                            : overallPercentage >= 75
                            ? "#3b82f6"
                            : overallPercentage >= 65
                            ? "#f59e0b"
                            : "#ef4444"
                        }
                        strokeWidth="10"
                        strokeDasharray={`${overallPercentage * 2.83} 283`}
                        strokeDashoffset="0"
                        transform="rotate(-90 50 50)"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-3xl font-bold">
                        {overallPercentage}%
                      </span>
                      <span
                        className={`text-sm font-medium ${attendanceStatus.color}`}
                      >
                        {attendanceStatus.status}
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-2 w-full gap-4 text-center">
                    <div className="bg-white p-3 rounded-lg shadow-sm">
                      <div className="flex justify-center">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Present</p>
                      <p className="text-lg font-semibold">{presentCount}</p>
                    </div>
                    <div className="bg-white p-3 rounded-lg shadow-sm">
                      <div className="flex justify-center">
                        <XCircle className="w-5 h-5 text-red-500" />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Absent</p>
                      <p className="text-lg font-semibold">{absentCount}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Subject-wise attendance */}
            <div className="col-span-1 lg:col-span-2">
              <h2 className="text-lg font-semibold text-gray-700 mb-4">
                Subject-wise Attendance
              </h2>
              <div className="bg-gray-50 rounded-xl p-6 h-full">
                {subjects
                  .filter((subject) => subject !== "all")
                  .map((subject) => {
                    const percentage = calculateAttendancePercentage(subject);
                    const status = getAttendanceStatus(percentage);
                    return (
                      <div key={subject} className="mb-4 last:mb-0">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium text-gray-700">
                            {subject}
                          </span>
                          <span
                            className={`text-sm font-medium ${status.color}`}
                          >
                            {percentage}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div
                            className={`h-2.5 rounded-full ${
                              percentage >= 85
                                ? "bg-green-500"
                                : percentage >= 75
                                ? "bg-blue-500"
                                : percentage >= 65
                                ? "bg-yellow-500"
                                : "bg-red-500"
                            }`}
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}

                {/* Risk alerts */}
                <div className="mt-6 p-4 border border-red-200 bg-red-50 rounded-lg">
                  <div className="flex items-start">
                    <AlertTriangle className="w-5 h-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium text-red-800">
                        Attendance Alert
                      </h4>
                      <p className="text-xs text-red-700 mt-0.5">
                        {overallPercentage < 75
                          ? "Your overall attendance is below the required 75%. Please improve your attendance to avoid academic penalties."
                          : "No attendance issues detected. Keep up the good work!"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Records */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="border-b border-gray-200">
            <div className="flex flex-wrap items-center justify-between p-4 gap-4">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setActiveTab("all")}
                  className={`px-4 py-2 text-sm font-medium rounded-md ${
                    activeTab === "all"
                      ? "bg-indigo-100 text-indigo-700"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  All Classes
                </button>
                <button
                  onClick={() => setActiveTab("present")}
                  className={`px-4 py-2 text-sm font-medium rounded-md ${
                    activeTab === "present"
                      ? "bg-green-100 text-green-700"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  Present
                </button>
                <button
                  onClick={() => setActiveTab("absent")}
                  className={`px-4 py-2 text-sm font-medium rounded-md ${
                    activeTab === "absent"
                      ? "bg-red-100 text-red-700"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  Absent
                </button>
              </div>

              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search subjects..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border rounded-md text-sm focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div className="relative">
                  <div className="relative">
                    <select
                      value={selectedSubject}
                      onChange={(e) => setSelectedSubject(e.target.value)}
                      className="appearance-none pl-3 pr-10 py-2 border rounded-md bg-white text-sm focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      {subjects.map((subject) => (
                        <option key={subject} value={subject}>
                          {subject === "all" ? "All Subjects" : subject}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                      <ChevronDown className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Attendance Records */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subject
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Time
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAttendance.length > 0 ? (
                  filteredAttendance.map((record) => (
                    <tr key={record._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-900">
                            {new Date(record.date).toLocaleDateString(
                              undefined,
                              {
                                weekday: "short",
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              }
                            )}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-gray-900">
                          {record.subject}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                            record.status === "present"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {record.status === "present" ? (
                            <CheckCircle className="w-4 h-4 mr-1.5" />
                          ) : (
                            <XCircle className="w-4 h-4 mr-1.5" />
                          )}
                          {record.status.charAt(0).toUpperCase() +
                            record.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 text-gray-400 mr-1.5" />
                          9:00 AM - 10:30 AM
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center">
                        <Filter className="h-10 w-10 text-gray-300 mb-2" />
                        <p className="text-gray-500 text-sm">
                          No attendance records found with the current filters.
                        </p>
                        <button
                          onClick={() => {
                            setSelectedSubject("all");
                            setActiveTab("all");
                            setSearchTerm("");
                          }}
                          className="mt-2 text-indigo-600 text-sm hover:text-indigo-500"
                        >
                          Clear all filters
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {filteredAttendance.length > 0 && (
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-between text-sm text-gray-700">
                <div>
                  Showing{" "}
                  <span className="font-medium">
                    {filteredAttendance.length}
                  </span>{" "}
                  out of{" "}
                  <span className="font-medium">
                    {attendance ? attendance.length : 0}
                  </span>{" "}
                  records
                </div>
                {/* Pagination placeholder */}
                <div className="flex items-center space-x-2">
                  <button className="px-3 py-1 border rounded-md text-gray-500 hover:bg-white">
                    Previous
                  </button>
                  <button className="px-3 py-1 border rounded-md bg-indigo-50 text-indigo-600 font-medium">
                    1
                  </button>
                  <button className="px-3 py-1 border rounded-md text-gray-500 hover:bg-white">
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

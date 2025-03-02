"use client";

import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import Link from "next/link";
import {
  Book,
  Calendar,
  ClipboardCheck,
  Clock,
  FileText,
  Bell,
  ChevronRight,
  BarChart,
  User,
  BookOpen,
  Award,
} from "lucide-react";

interface UpcomingClass {
  id: string;
  subject: string;
  time: string;
  teacher: string;
  room: string;
}

interface Assignment {
  id: string;
  title: string;
  subject: string;
  dueDate: string;
  status: "pending" | "submitted" | "graded";
  score?: number;
}

interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  author: string;
  important: boolean;
}

export default function StudentDashboard() {
  const [loading, setLoading] = useState(true);
  interface StudentData {
    name: string;
    rollNumber: string;
    semester: number;
    department: string;
    attendancePercentage: number;
    cgpa: number;
  }

  const [studentData, setStudentData] = useState<StudentData | null>(null);
  const [upcomingClasses, setUpcomingClasses] = useState<UpcomingClass[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // In a real app, these would be separate API calls
        // For now, we'll use mock data

        // Mock student data
        setStudentData({
          name: "John Doe",
          rollNumber: "CS2023001",
          semester: 3,
          department: "Computer Science",
          attendancePercentage: 84,
          cgpa: 3.7,
        });

        // Mock upcoming classes
        setUpcomingClasses([
          {
            id: "1",
            subject: "Data Structures",
            time: "9:00 AM - 10:30 AM",
            teacher: "Prof. Sarah Johnson",
            room: "CSE Lab 2",
          },
          {
            id: "2",
            subject: "Database Systems",
            time: "11:00 AM - 12:30 PM",
            teacher: "Dr. Michael Chen",
            room: "Lecture Hall 3",
          },
          {
            id: "3",
            subject: "Software Engineering",
            time: "2:00 PM - 3:30 PM",
            teacher: "Prof. Robert Williams",
            room: "Room 201",
          },
        ]);

        // Mock assignments
        setAssignments([
          {
            id: "1",
            title: "ER Diagram Assignment",
            subject: "Database Systems",
            dueDate: "2025-03-10",
            status: "pending",
          },
          {
            id: "2",
            title: "Algorithm Analysis",
            subject: "Data Structures",
            dueDate: "2025-03-05",
            status: "submitted",
          },
          {
            id: "3",
            title: "Requirements Document",
            subject: "Software Engineering",
            dueDate: "2025-02-28",
            status: "graded",
            score: 85,
          },
        ]);

        // Mock announcements
        setAnnouncements([
          {
            id: "1",
            title: "Mid-Term Examination Schedule",
            content:
              "Mid-term examinations will be conducted from March 15 to March 25, 2025. Please check your course portal for detailed schedule.",
            date: "2025-03-01",
            author: "Examination Department",
            important: true,
          },
          {
            id: "2",
            title: "Campus Coding Competition",
            content:
              "Register for the annual coding competition by March 10. Exciting prizes for winners!",
            date: "2025-02-28",
            author: "Student Activities Committee",
            important: false,
          },
        ]);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        toast.error("Failed to load dashboard data");
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-indigo-600 font-medium">
            Loading your dashboard...
          </p>
        </div>
      </div>
    );
  }

  // Helper function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold">
                Welcome back, {studentData?.name}
              </h1>
              <p className="mt-2 text-indigo-100">
                {studentData?.department} | Semester {studentData?.semester} |
                Roll #{studentData?.rollNumber}
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex space-x-4">
              <Link
                href="/students/attendance"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-indigo-600 bg-white hover:bg-indigo-50"
              >
                <Calendar className="w-4 h-4 mr-2" />
                View Attendance
              </Link>
              <Link
                href="/students/marks"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-indigo-600 bg-white hover:bg-indigo-50"
              >
                <BarChart className="w-4 h-4 mr-2" />
                View Marks
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Overall Attendance</p>
                <p className="text-2xl font-bold text-gray-900">
                  {studentData?.attendancePercentage}%
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {studentData && studentData.attendancePercentage >= 75
                    ? "Good standing"
                    : "Needs improvement"}
                </p>
              </div>
              <div
                className={`p-3 rounded-full ${
                  studentData && studentData.attendancePercentage >= 75
                    ? "bg-green-100"
                    : "bg-yellow-100"
                }`}
              >
                <Calendar
                  className={`h-6 w-6 ${
                    studentData && studentData.attendancePercentage >= 75
                      ? "text-green-600"
                      : "text-yellow-600"
                  }`}
                />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Current CGPA</p>
                <p className="text-2xl font-bold text-gray-900">
                  {studentData?.cgpa}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {studentData && studentData.cgpa >= 3.0
                    ? "Good performance"
                    : "Room for improvement"}
                </p>
              </div>
              <div
                className={`p-3 rounded-full ${
                  studentData && studentData.cgpa >= 3.0 ? "bg-blue-100" : "bg-yellow-100"
                }`}
              >
                <Award
                  className={`h-6 w-6 ${
                    studentData && studentData.cgpa >= 3.0
                      ? "text-blue-600"
                      : "text-yellow-600"
                  }`}
                />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Assignments</p>
                <p className="text-2xl font-bold text-gray-900">
                  {assignments.filter((a) => a.status === "pending").length}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {assignments.filter((a) => a.status === "pending").length > 0
                    ? "Action needed"
                    : "All caught up!"}
                </p>
              </div>
              <div
                className={`p-3 rounded-full ${
                  assignments.filter((a) => a.status === "pending").length > 0
                    ? "bg-yellow-100"
                    : "bg-green-100"
                }`}
              >
                <ClipboardCheck
                  className={`h-6 w-6 ${
                    assignments.filter((a) => a.status === "pending").length > 0
                      ? "text-yellow-600"
                      : "text-green-600"
                  }`}
                />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Today&apos;s Classes</p>
                <p className="text-2xl font-bold text-gray-900">
                  {upcomingClasses.length}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Next: {upcomingClasses[0]?.subject || "None"}
                </p>
              </div>
              <div className="p-3 rounded-full bg-purple-100">
                <BookOpen className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Today's Schedule */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden lg:col-span-2">
            <div className="px-6 py-5 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium text-gray-900">
                  Today&apos;s Schedule
                </h2>
                <Link
                  href="/students/schedule"
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-500 flex items-center"
                >
                  View full schedule
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>
            <ul className="divide-y divide-gray-200">
              {upcomingClasses.length > 0 ? (
                upcomingClasses.map((cls) => (
                  <li key={cls.id} className="px-6 py-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-50 text-indigo-700">
                          <Book className="h-6 w-6" />
                        </div>
                      </div>
                      <div className="ml-4 flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-base font-medium text-gray-800">
                              {cls.subject}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {cls.teacher}
                            </p>
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 text-gray-400 mr-1" />
                            <span className="text-sm text-gray-500">
                              {cls.time}
                            </span>
                          </div>
                        </div>
                        <p className="mt-1 text-sm text-gray-500">
                          <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">
                            Room: {cls.room}
                          </span>
                        </p>
                      </div>
                    </div>
                  </li>
                ))
              ) : (
                <li className="px-6 py-8 text-center">
                  <p className="text-gray-500">
                    No classes scheduled for today
                  </p>
                </li>
              )}
            </ul>
          </div>

          {/* Announcements */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium text-gray-900">
                  Announcements
                </h2>
                <Link
                  href="/students/announcements"
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-500 flex items-center"
                >
                  View all
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>
            <ul className="divide-y divide-gray-200">
              {announcements.length > 0 ? (
                announcements.map((announcement) => (
                  <li key={announcement.id} className="px-6 py-5">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mt-1">
                        <div
                          className={`flex items-center justify-center h-8 w-8 rounded-full ${
                            announcement.important
                              ? "bg-red-100"
                              : "bg-blue-100"
                          }`}
                        >
                          <Bell
                            className={`h-4 w-4 ${
                              announcement.important
                                ? "text-red-600"
                                : "text-blue-600"
                            }`}
                          />
                        </div>
                      </div>
                      <div className="ml-3 flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-medium text-gray-900">
                            {announcement.important && (
                              <span className="inline-flex items-center rounded-full bg-red-50 px-2 py-0.5 text-xs font-medium text-red-700 mr-2">
                                Important
                              </span>
                            )}
                            {announcement.title}
                          </h3>
                          <span className="text-xs text-gray-500">
                            {formatDate(announcement.date)}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                          {announcement.content}
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                          By: {announcement.author}
                        </p>
                      </div>
                    </div>
                  </li>
                ))
              ) : (
                <li className="px-6 py-8 text-center">
                  <p className="text-gray-500">No new announcements</p>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Assignments */}
        <div className="mt-8 bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900">
                Recent Assignments
              </h2>
              <Link
                href="/students/assignments"
                className="text-sm font-medium text-indigo-600 hover:text-indigo-500 flex items-center"
              >
                View all assignments
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Assignment
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Subject
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Due Date
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Score
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {assignments.map((assignment) => (
                  <tr key={assignment.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <FileText className="h-5 w-5 text-gray-400" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {assignment.title}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {assignment.subject}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatDate(assignment.dueDate)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          assignment.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : assignment.status === "submitted"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {assignment.status.charAt(0).toUpperCase() +
                          assignment.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {assignment.score !== undefined
                        ? `${assignment.score}/100`
                        : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Quick Links
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <Link
              href="/students/notes"
              className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow flex flex-col items-center"
            >
              <div className="flex items-center justify-center h-12 w-12 rounded-full bg-purple-100 text-purple-600">
                <BookOpen className="h-6 w-6" />
              </div>
              <span className="mt-2 text-sm font-medium text-gray-900">
                Notes
              </span>
            </Link>

            <Link
              href="/students/attendance"
              className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow flex flex-col items-center"
            >
              <div className="flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 text-blue-600">
                <Calendar className="h-6 w-6" />
              </div>
              <span className="mt-2 text-sm font-medium text-gray-900">
                Attendance
              </span>
            </Link>

            <Link
              href="/students/marks"
              className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow flex flex-col items-center"
            >
              <div className="flex items-center justify-center h-12 w-12 rounded-full bg-green-100 text-green-600">
                <BarChart className="h-6 w-6" />
              </div>
              <span className="mt-2 text-sm font-medium text-gray-900">
                Marks
              </span>
            </Link>

            <Link
              href="/students/profile"
              className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow flex flex-col items-center"
            >
              <div className="flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 text-yellow-600">
                <User className="h-6 w-6" />
              </div>
              <span className="mt-2 text-sm font-medium text-gray-900">
                Profile
              </span>
            </Link>

            <Link
              href="/students/resources"
              className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow flex flex-col items-center"
            >
              <div className="flex items-center justify-center h-12 w-12 rounded-full bg-red-100 text-red-600">
                <Book className="h-6 w-6" />
              </div>
              <span className="mt-2 text-sm font-medium text-gray-900">
                Resources
              </span>
            </Link>

            <Link
              href="/students/timetable"
              className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow flex flex-col items-center"
            >
              <div className="flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 text-indigo-600">
                <Clock className="h-6 w-6" />
              </div>
              <span className="mt-2 text-sm font-medium text-gray-900">
                Timetable
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

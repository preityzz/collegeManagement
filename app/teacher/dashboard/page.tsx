"use client";

import { useState, ReactElement } from "react";
import AddAttendanceForm from "@/components/teacher/AddAttendanceForm";
import AddMarksForm from "@/components/teacher/AddMarksForm";
import AddNotesForm from "@/components/teacher/AddNotesForm";
import { Calendar, GraduationCap, BookOpen, } from "lucide-react";

interface DashboardStat {
  title: string;
  value: string;
  icon: ReactElement;
  color: string;
}

export default function TeacherDashboard() {
  const [activeTab, setActiveTab] = useState("attendance");

  const stats: DashboardStat[] = [
    {
      title: "Total Students",
      value: "120",
      icon: <GraduationCap className="w-6 h-6" />,
      color: "bg-blue-500",
    },
    {
      title: "Classes Today",
      value: "4",
      icon: <Calendar className="w-6 h-6" />,
      color: "bg-green-500",
    },
    {
      title: "Courses",
      value: "3",
      icon: <BookOpen className="w-6 h-6" />,
      color: "bg-purple-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Teacher Dashboard
          </h1>
          <p className="mt-2 text-gray-600">
            Manage your classes and student records
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat) => (
            <div key={stat.title} className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center">
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  {stat.icon}
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {stat.value}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              {[
                {
                  id: "attendance",
                  label: "Attendance",
                  icon: <Calendar className="w-4 h-4" />,
                },
                {
                  id: "marks",
                  label: "Marks",
                  icon: <GraduationCap className="w-4 h-4" />,
                },
                {
                  id: "notes",
                  label: "Notes",
                  icon: <BookOpen className="w-4 h-4" />,
                },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium ${
                    activeTab === tab.id
                      ? "border-b-2 border-blue-500 text-blue-600"
                      : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          {activeTab === "attendance" && (
            <div>
              <h2 className="text-lg font-semibold mb-4">Mark Attendance</h2>
              <AddAttendanceForm />
            </div>
          )}
          {activeTab === "marks" && (
            <div>
              <h2 className="text-lg font-semibold mb-4">Add Marks</h2>
              <AddMarksForm />
            </div>
          )}
          {activeTab === "notes" && (
            <div>
              <h2 className="text-lg font-semibold mb-4">Share Notes</h2>
              <AddNotesForm />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

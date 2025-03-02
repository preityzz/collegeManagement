"use client";

import { useState } from "react";
import ManageTimetableForm from "@/components/hod/ManageTimeTableForm";
import SendNotificationForm from "@/components/hod/SendNotificationForm";
import ApproveTeacherForm from "@/components/hod/ApproveTeacherForm";
import RegisterStudentForm from "@/components/hod/RegisterStudentForm";
import ManagePapersForm from "@/components/hod/ManagePapersForm";
import {
  Layout,
  Calendar,
  Bell,
  UserPlus,
  Users,
  BookOpen,
} from "lucide-react";

const dashboardSections = [
  {
    title: "Manage Timetable",
    icon: <Calendar className="w-6 h-6 text-blue-500" />,
    component: <ManageTimetableForm />,
    description: "Create and manage class schedules",
  },
  {
    title: "Send Notification",
    icon: <Bell className="w-6 h-6 text-green-500" />,
    component: <SendNotificationForm />,
    description: "Send important announcements",
  },
  {
    title: "Approve Teacher",
    icon: <UserPlus className="w-6 h-6 text-purple-500" />,
    component: <ApproveTeacherForm />,
    description: "Review and approve teacher applications",
  },
  {
    title: "Register Student",
    icon: <Users className="w-6 h-6 text-orange-500" />,
    component: <RegisterStudentForm />,
    description: "Add new students to the system",
  },
  {
    title: "Manage Papers",
    icon: <BookOpen className="w-6 h-6 text-red-500" />,
    component: <ManagePapersForm />,
    description: "Organize academic papers and subjects",
  },
];

export default function HODDashboard() {
  const [activeTab, setActiveTab] = useState(dashboardSections[0].title);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">HOD Dashboard</h1>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500">Welcome back</span>
            <Layout className="w-6 h-6 text-blue-500" />
          </div>
        </div>

        {/* Dashboard Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          {dashboardSections.map((section) => (
            <button
              key={section.title}
              onClick={() => setActiveTab(section.title)}
              className={`p-4 rounded-lg transition-all ${
                activeTab === section.title
                  ? "bg-white shadow-lg border-l-4 border-blue-500"
                  : "bg-gray-100 hover:bg-white hover:shadow"
              }`}
            >
              <div className="flex items-center space-x-3">
                {section.icon}
                <div className="text-left">
                  <h3 className="font-semibold text-gray-900">
                    {section.title}
                  </h3>
                  <p className="text-sm text-gray-500">{section.description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Active Section Content */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          {dashboardSections.map((section) => (
            <div
              key={section.title}
              className={activeTab === section.title ? "block" : "hidden"}
            >
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {section.title}
                </h2>
                <p className="text-gray-600">{section.description}</p>
              </div>
              {section.component}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

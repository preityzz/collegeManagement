"use client";

import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import {

  Calendar,
  ChevronDown,
  FileText,
  Filter,
  Search,
  AlertCircle,
  Award,
  BookOpen,
 
  Loader2,
} from "lucide-react";

interface Mark {
  _id: string;
  studentId: string;
  paperId: string;
  subject: string;
  examType: "internal" | "external" | "assignment" | "project" | "practical";
  marksObtained: number;
  totalMarks: number;
  date: string;
  semester: number;
  examName: string;
}

interface SubjectStats {
  subject: string;
  totalObtained: number;
  totalMaximum: number;
  percentage: number;
  examCount: number;
}

export default function StudentMarks() {
  const [marks, setMarks] = useState<Mark[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSemester, setSelectedSemester] = useState<number | "all">(
    "all"
  );
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [selectedExamType, setSelectedExamType] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchMarks();
  }, []);

  const fetchMarks = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/student/marks");

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      setMarks(data);
    } catch (error) {
      console.error("Error fetching marks:", error);
      toast.error("Failed to load your marks data");
    } finally {
      setLoading(false);
    }
  };

  // Extract unique semesters from marks data
  const semesters =
    marks.length > 0
      ? [
          "all",
          ...Array.from(new Set(marks.map((mark) => mark.semester))).sort(
            (a, b) => a - b
          ),
        ]
      : ["all"];

  // Extract unique subjects from marks data
  const subjects =
    marks.length > 0
      ? ["all", ...Array.from(new Set(marks.map((mark) => mark.subject)))]
      : ["all"];

  // Extract unique exam types from marks data
  const examTypes =
    marks.length > 0
      ? ["all", ...Array.from(new Set(marks.map((mark) => mark.examType)))]
      : ["all"];

  // Filter marks based on selected filters
  const filteredMarks = marks.filter((mark) => {
    const matchesSemester =
      selectedSemester === "all" || mark.semester === selectedSemester;
    const matchesSubject =
      selectedSubject === "all" || mark.subject === selectedSubject;
    const matchesExamType =
      selectedExamType === "all" || mark.examType === selectedExamType;
    const matchesSearch =
      mark.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mark.examName.toLowerCase().includes(searchTerm.toLowerCase());

    return (
      matchesSemester && matchesSubject && matchesExamType && matchesSearch
    );
  });

  // Calculate overall percentage
  const calculateOverallPercentage = () => {
    if (marks.length === 0) return 0;

    const totalObtained = marks.reduce(
      (sum, mark) => sum + mark.marksObtained,
      0
    );
    const totalMaximum = marks.reduce((sum, mark) => sum + mark.totalMarks, 0);

    return Math.round((totalObtained / totalMaximum) * 100);
  };

  // Calculate subject-wise statistics
  const calculateSubjectStats = (): SubjectStats[] => {
    if (marks.length === 0) return [];

    const subjectMap = new Map<string, SubjectStats>();

    marks.forEach((mark) => {
      const { subject, marksObtained, totalMarks } = mark;

      if (subjectMap.has(subject)) {
        const stats = subjectMap.get(subject)!;
        stats.totalObtained += marksObtained;
        stats.totalMaximum += totalMarks;
        stats.examCount += 1;
        stats.percentage = Math.round(
          (stats.totalObtained / stats.totalMaximum) * 100
        );
        subjectMap.set(subject, stats);
      } else {
        subjectMap.set(subject, {
          subject,
          totalObtained: marksObtained,
          totalMaximum: totalMarks,
          percentage: Math.round((marksObtained / totalMarks) * 100),
          examCount: 1,
        });
      }
    });

    return Array.from(subjectMap.values()).sort(
      (a, b) => b.percentage - a.percentage
    );
  };

  // Get grade based on percentage
  const getGrade = (percentage: number) => {
    if (percentage >= 90) return { grade: "A+", color: "text-green-600" };
    if (percentage >= 80) return { grade: "A", color: "text-green-500" };
    if (percentage >= 70) return { grade: "B+", color: "text-blue-600" };
    if (percentage >= 60) return { grade: "B", color: "text-blue-500" };
    if (percentage >= 50) return { grade: "C", color: "text-yellow-600" };
    if (percentage >= 40) return { grade: "D", color: "text-orange-500" };
    return { grade: "F", color: "text-red-500" };
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const overallPercentage = calculateOverallPercentage();
  const subjectStats = calculateSubjectStats();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center">
          <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />
          <p className="mt-4 text-indigo-600 font-medium">
            Loading your marks...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold">Academic Performance</h1>
          <p className="mt-2 text-indigo-100">
            Track your examination results and academic progress
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        {/* Main performance card */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Overall stats */}
            <div className="col-span-1">
              <div className="flex flex-col h-full">
                <h2 className="text-lg font-semibold text-gray-700 mb-4">
                  Overall Performance
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
                          overallPercentage >= 80
                            ? "#10b981"
                            : overallPercentage >= 60
                            ? "#3b82f6"
                            : overallPercentage >= 40
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
                        className={`text-sm font-medium ${
                          getGrade(overallPercentage).color
                        }`}
                      >
                        Grade {getGrade(overallPercentage).grade}
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-2 w-full gap-4 text-center">
                    <div className="bg-white p-3 rounded-lg shadow-sm">
                      <div className="flex justify-center">
                        <FileText className="w-5 h-5 text-indigo-500" />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Total Exams</p>
                      <p className="text-lg font-semibold">{marks.length}</p>
                    </div>
                    <div className="bg-white p-3 rounded-lg shadow-sm">
                      <div className="flex justify-center">
                        <BookOpen className="w-5 h-5 text-indigo-500" />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Subjects</p>
                      <p className="text-lg font-semibold">
                        {subjects.length - 1}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Subject-wise performance */}
            <div className="col-span-1 lg:col-span-2">
              <h2 className="text-lg font-semibold text-gray-700 mb-4">
                Subject-wise Performance
              </h2>
              <div className="bg-gray-50 rounded-xl p-6 h-full">
                {subjectStats.length > 0 ? (
                  <div className="space-y-4">
                    {subjectStats.map((stat) => {
                      const gradeInfo = getGrade(stat.percentage);
                      return (
                        <div key={stat.subject} className="mb-4 last:mb-0">
                          <div className="flex justify-between items-center mb-1">
                            <div>
                              <span className="text-sm font-medium text-gray-700">
                                {stat.subject}
                              </span>
                              <span className="ml-2 text-xs text-gray-500">
                                ({stat.totalObtained}/{stat.totalMaximum},{" "}
                                {stat.examCount} exams)
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span
                                className={`text-sm font-medium ${gradeInfo.color}`}
                              >
                                {stat.percentage}%
                              </span>
                              <span
                                className={`px-2 py-0.5 text-xs rounded-full font-medium ${
                                  stat.percentage >= 60
                                    ? "bg-green-100 text-green-800"
                                    : stat.percentage >= 40
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                              >
                                {gradeInfo.grade}
                              </span>
                            </div>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div
                              className={`h-2.5 rounded-full ${
                                stat.percentage >= 80
                                  ? "bg-green-500"
                                  : stat.percentage >= 60
                                  ? "bg-blue-500"
                                  : stat.percentage >= 40
                                  ? "bg-yellow-500"
                                  : "bg-red-500"
                              }`}
                              style={{ width: `${stat.percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full py-8">
                    <div className="bg-indigo-100 p-3 rounded-full">
                      <AlertCircle className="w-6 h-6 text-indigo-600" />
                    </div>
                    <p className="mt-4 text-gray-600">
                      No marks data available
                    </p>
                    <p className="text-sm text-gray-500">
                      Your examination records will appear here
                    </p>
                  </div>
                )}

                {/* Performance alerts */}
                {subjectStats.length > 0 && (
                  <div className="mt-6 p-4 border border-indigo-200 bg-indigo-50 rounded-lg">
                    <div className="flex items-start">
                      <Award className="w-5 h-5 text-indigo-500 mr-2 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-medium text-indigo-800">
                          Performance Analysis
                        </h4>
                        <p className="text-xs text-indigo-700 mt-0.5">
                          {overallPercentage >= 70
                            ? "Excellent work! Your academic performance is strong across most subjects."
                            : overallPercentage >= 50
                            ? "Good progress! Focus on improving in your weaker subjects to boost your overall performance."
                            : "Needs attention. Consider seeking additional help in subjects with lower marks."}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Records */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="border-b border-gray-200">
            <div className="p-4 flex flex-wrap items-center justify-between gap-4">
              <h2 className="text-lg font-semibold text-gray-700">
                Examination Records
              </h2>

              <div className="flex items-center space-x-3 flex-wrap gap-y-2">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search subjects or exams..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border rounded-md text-sm focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div className="relative">
                  <select
                    value={String(selectedSemester)}
                    onChange={(e) =>
                      setSelectedSemester(
                        e.target.value === "all"
                          ? "all"
                          : Number(e.target.value)
                      )
                    }
                    className="appearance-none pl-3 pr-10 py-2 border rounded-md bg-white text-sm focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    {semesters.map((semester) => (
                      <option key={semester} value={semester}>
                        {semester === "all"
                          ? "All Semesters"
                          : `Semester ${semester}`}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  </div>
                </div>

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

                <div className="relative">
                  <select
                    value={selectedExamType}
                    onChange={(e) => setSelectedExamType(e.target.value)}
                    className="appearance-none pl-3 pr-10 py-2 border rounded-md bg-white text-sm focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    {examTypes.map((type) => (
                      <option key={type} value={type}>
                        {type === "all"
                          ? "All Exam Types"
                          : type.charAt(0).toUpperCase() + type.slice(1)}
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

          {/* Marks Records */}
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
                    Exam Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Marks
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Percentage
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredMarks.length > 0 ? (
                  filteredMarks.map((mark) => {
                    const percentage = Math.round(
                      (mark.marksObtained / mark.totalMarks) * 100
                    );
                    const gradeInfo = getGrade(percentage);

                    return (
                      <tr key={mark._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                            <span className="text-sm text-gray-900">
                              {formatDate(mark.date)}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-medium text-gray-900">
                            {mark.subject}
                          </span>
                          <div className="text-xs text-gray-500">
                            Semester {mark.semester}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-900">
                            {mark.examName}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              mark.examType === "internal"
                                ? "bg-blue-100 text-blue-800"
                                : mark.examType === "external"
                                ? "bg-purple-100 text-purple-800"
                                : mark.examType === "assignment"
                                ? "bg-green-100 text-green-800"
                                : mark.examType === "project"
                                ? "bg-pink-100 text-pink-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {mark.examType.charAt(0).toUpperCase() +
                              mark.examType.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-medium text-gray-900">
                            {mark.marksObtained} / {mark.totalMarks}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <span
                              className={`text-sm font-medium ${gradeInfo.color} mr-2`}
                            >
                              {percentage}%
                            </span>
                            <span
                              className={`px-2 py-0.5 text-xs rounded-full font-medium ${
                                percentage >= 60
                                  ? "bg-green-100 text-green-800"
                                  : percentage >= 40
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {gradeInfo.grade}
                            </span>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center">
                        <Filter className="h-10 w-10 text-gray-300 mb-2" />
                        <p className="text-gray-500 text-sm">
                          No examination records found with the current filters.
                        </p>
                        <button
                          onClick={() => {
                            setSelectedSemester("all");
                            setSelectedSubject("all");
                            setSelectedExamType("all");
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

          {filteredMarks.length > 0 && (
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-between text-sm text-gray-700">
                <div>
                  Showing{" "}
                  <span className="font-medium">{filteredMarks.length}</span>{" "}
                  out of <span className="font-medium">{marks.length}</span>{" "}
                  records
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

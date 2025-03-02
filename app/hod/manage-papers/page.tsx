"use client";

import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { Edit, Trash } from "lucide-react";

interface Paper {
  _id: string;
  name: string;
  code: string;
  semester: string;
  credits: number;
}

export default function ManagePapers() {
  const [papers, setPapers] = useState<Paper[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    semester: "",
    credits: 0,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState("");

  useEffect(() => {
    fetchPapers();
  }, []);

  const fetchPapers = async () => {
    try {
      const response = await fetch("/api/hod/manage-papers");
      const data = await response.json();
      if (response.ok) {
        setPapers(data.papers);
      } else {
        toast.error(data.error || "Failed to fetch papers");
      }
    } catch {
      toast.error("Error fetching papers");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = isEditing
        ? `/api/hod/manage-papers/${editId}`
        : "/api/hod/manage-papers";

      const response = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(
          isEditing ? "Paper updated successfully" : "Paper added successfully"
        );
        fetchPapers();
        resetForm();
      } else {
        toast.error(data.error || "Operation failed");
      }
    } catch {
      toast.error("Error performing operation");
    }
  };

  const handleEdit = (paper: Paper) => {
    setFormData({
      name: paper.name,
      code: paper.code,
      semester: paper.semester,
      credits: paper.credits,
    });
    setIsEditing(true);
    setEditId(paper._id);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this paper?")) return;

    try {
      const response = await fetch(`/api/hod/manage-papers/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Paper deleted successfully");
        fetchPapers();
      } else {
        const data = await response.json();
        toast.error(data.error || "Failed to delete paper");
      }
    } catch {
      toast.error("Error deleting paper");
    }
  };

  const resetForm = () => {
    setFormData({ name: "", code: "", semester: "", credits: 0 });
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
        <h1 className="text-2xl font-bold text-gray-900">Manage Papers</h1>
        <p className="mt-2 text-gray-600">Add, edit, or remove course papers</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Section */}
        <div className="lg:col-span-1">
          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded-lg shadow"
          >
            <h2 className="text-lg font-semibold mb-4">
              {isEditing ? "Edit Paper" : "Add New Paper"}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Paper Name
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
                  Paper Code
                </label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) =>
                    setFormData({ ...formData, code: e.target.value })
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
                  Credits
                </label>
                <input
                  type="number"
                  value={formData.credits}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      credits: Number(e.target.value),
                    })
                  }
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  required
                  min="1"
                  max="6"
                />
              </div>

              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  {isEditing ? "Update Paper" : "Add Paper"}
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

        {/* Papers List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Code
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Semester
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Credits
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {papers.map((paper) => (
                    <tr key={paper._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {paper.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {paper.code}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {paper.semester}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {paper.credits}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(paper)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <Edit className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(paper._id)}
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

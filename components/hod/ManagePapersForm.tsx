import { useState } from "react";
import axios from "axios";

export default function ManagePapersForm() {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");

interface Paper {
    name: string;
    code: string;
}

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    await axios.post<Paper>("/api/hod/manage-papers", { name, code });
    alert("Paper added successfully");
};

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-4">
      <h3 className="text-lg font-semibold mb-4">Manage Papers</h3>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Paper Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Paper Code</label>
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <button type="submit" className="bg-blue-500 text-white p-2 rounded">
        Add Paper
      </button>
    </form>
  );
}

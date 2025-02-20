import { useState } from "react";
import axios from "axios";

export default function SendNotificationForm() {
  const [message, setMessage] = useState("");
  const [studentIds, setStudentIds] = useState("");

interface NotificationPayload {
    message: string;
    studentIds: string[];
}

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    await axios.post<void>("/api/hod/send-notification", {
        message,
        studentIds: studentIds.split(","),
    } as NotificationPayload);
    alert("Notification sent successfully");
};

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-4">
      <h3 className="text-lg font-semibold mb-4">Send Notification</h3>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Message</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">
          Student IDs (comma-separated)
        </label>
        <input
          type="text"
          value={studentIds}
          onChange={(e) => setStudentIds(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <button type="submit" className="bg-blue-500 text-white p-2 rounded">
        Send Notification
      </button>
    </form>
  );
}

"use client";

import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { Send,Trash} from "lucide-react";

interface Notification {
  _id: string;
  title: string;
  message: string;
  recipients: string[];
  createdAt: string;
}

export default function SendNotification() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    recipients: [] as string[],
  });

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await fetch("/api/hod/notifications");
      const data = await response.json();
      if (response.ok) {
        setNotifications(data.notifications);
      } else {
        toast.error(data.error || "Failed to fetch notifications");
      }
    } catch  {
      toast.error("Error fetching notifications");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.recipients.length === 0) {
      toast.error("Please select at least one recipient group");
      return;
    }

    try {
      const response = await fetch("/api/hod/send-notification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Notification sent successfully");
        fetchNotifications();
        resetForm();
      } else {
        toast.error(data.error || "Failed to send notification");
      }
    } catch  {
      toast.error("Error sending notification");
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      message: "",
      recipients: [],
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this notification?")) return;

    try {
      const response = await fetch(`/api/hod/notifications/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Notification deleted successfully");
        fetchNotifications();
      } else {
        const data = await response.json();
        toast.error(data.error || "Failed to delete notification");
      }
    } catch  {
      toast.error("Error deleting notification");
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
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Send Notification</h1>
        <p className="mt-2 text-gray-600">
          Send notifications to students and teachers
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Notification Form */}
        <div>
          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded-lg shadow"
          >
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Message
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  rows={4}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Recipients
                </label>
                <div className="space-y-2">
                  {["students", "teachers", "all"].map((group) => (
                    <label key={group} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.recipients.includes(group)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData({
                              ...formData,
                              recipients: [...formData.recipients, group],
                            });
                          } else {
                            setFormData({
                              ...formData,
                              recipients: formData.recipients.filter(
                                (r) => r !== group
                              ),
                            });
                          }
                        }}
                        className="rounded border-gray-300 text-blue-600"
                      />
                      <span className="text-sm text-gray-700 capitalize">
                        {group}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center justify-center space-x-2"
              >
                <Send className="w-4 h-4" />
                <span>Send Notification</span>
              </button>
            </div>
          </form>
        </div>

        {/* Recent Notifications */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Recent Notifications</h2>
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification._id}
                className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium">{notification.title}</h3>
                  <button
                    onClick={() => handleDelete(notification._id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-gray-600 text-sm mb-2">
                  {notification.message}
                </p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>
                    Sent to: {notification.recipients.map((r) => r).join(", ")}
                  </span>
                  <span>
                    {new Date(notification.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

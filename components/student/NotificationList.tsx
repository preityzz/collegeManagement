import { useEffect, useState } from "react";
import axios from "axios";

interface Notification {
  _id: string;
  message: string;
  createdAt: string;
}
export default function NotificationsList({
  studentId,
}: {
  studentId: string;
}) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  useEffect(() => {
    const fetchNotifications = async () => {
      const res = await axios.get(
        `/api/student/notifications?studentId=${studentId}`
      );
      setNotifications(res.data);
    };
    fetchNotifications();
  }, [studentId]);

  return (
    <div className="bg-white shadow rounded-lg p-4">
      <h3 className="text-lg font-semibold mb-4">Notifications</h3>
      <ul>
        {notifications.map((notification) => (
          <li key={notification._id} className="mb-2 p-2 bg-gray-50 rounded">
            <p>{notification.message}</p>
            <p className="text-sm text-gray-500">
              {new Date(notification.createdAt).toLocaleString()}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

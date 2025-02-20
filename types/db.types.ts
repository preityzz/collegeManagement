import { Connection, Model } from "mongoose";

// Connection type for MongoDB
export interface MongoConnection {
  conn: Connection | null;
  promise: Promise<Connection> | null;
}

// User collection type
export interface UserDocument {
  name: string;
  email: string;
  password: string;
  role: "student" | "staff";
  createdAt: Date;
  updatedAt: Date;
}

// Timetable collection type
export interface TimetableDocument {
  subject: string;
  day: string;
  startTime: string;
  endTime: string;
  staff: string;
  class: string;
  createdAt: Date;
  updatedAt: Date;
}

// Notes collection type
export interface NotesDocument {
  subject: string;
  title: string;
  content: string;
  staff: string;
  class: string;
  createdAt: Date;
  updatedAt: Date;
}

// Notifications collection type
export interface NotificationDocument {
  title: string;
  message: string;
  type: "class" | "exam" | "general";
  staff: string;
  class: string;
  createdAt: Date;
  updatedAt: Date;
}

// Collection models type
export interface Collections {
  users: Model<UserDocument>;
  timetables: Model<TimetableDocument>;
  notes: Model<NotesDocument>;
  notifications: Model<NotificationDocument>;
}

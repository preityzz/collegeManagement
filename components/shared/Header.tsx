"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  User,
  LogOut,
  BookOpen,
  Bell,
  Calendar,
  FileText,
  Users,
  GraduationCap,
} from "lucide-react";

// Navigation links based on user roles
const navLinks = {
  public: [
    { name: "Home", href: "/", icon: <BookOpen className="w-4 h-4 mr-2" /> },
    { name: "About", href: "/about", icon: <Users className="w-4 h-4 mr-2" /> },
    {
      name: "Contact",
      href: "/contact",
      icon: <Bell className="w-4 h-4 mr-2" />,
    },
  ],
  student: [
    {
      name: "Dashboard",
      href: "/students/dashboard",
      icon: <BookOpen className="w-4 h-4 mr-2" />,
    },
    {
      name: "Attendance",
      href: "/students/attendance",
      icon: <Calendar className="w-4 h-4 mr-2" />,
    },
    {
      name: "Marks",
      href: "/students/marks",
      icon: <GraduationCap className="w-4 h-4 mr-2" />,
    },
    {
      name: "Notes",
      href: "/students/notes",
      icon: <FileText className="w-4 h-4 mr-2" />,
    },
  ],
  teacher: [
    {
      name: "Dashboard",
      href: "/teacher/dashboard",
      icon: <BookOpen className="w-4 h-4 mr-2" />,
    },
    {
      name: "Attendance",
      href: "/teacher/add-attendance",
      icon: <Calendar className="w-4 h-4 mr-2" />,
    },
    {
      name: "Marks",
      href: "/teacher/add-marks",
      icon: <GraduationCap className="w-4 h-4 mr-2" />,
    },
    {
      name: "Notes",
      href: "/teacher/add-notes",
      icon: <FileText className="w-4 h-4 mr-2" />,
    },
  ],
  hod: [
    {
      name: "Dashboard",
      href: "/hod/dashboard",
      icon: <BookOpen className="w-4 h-4 mr-2" />,
    },
    {
      name: "Manage Papers",
      href: "/hod/manage-papers",
      icon: <FileText className="w-4 h-4 mr-2" />,
    },
    {
      name: "Manage Teachers",
      href: "/hod/manage-teachers",
      icon: <Users className="w-4 h-4 mr-2" />,
    },
    {
      name: "Notifications",
      href: "/hod/notifications",
      icon: <Bell className="w-4 h-4 mr-2" />,
    },
  ],
};

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const pathname = usePathname();

  // For demo purposes, let's detect the current user type based on URL
  // In a real app, this would come from authentication
  let userType = "public";
  if (pathname.startsWith("/students")) userType = "student";
  if (pathname.startsWith("/teacher")) userType = "teacher";
  if (pathname.startsWith("/hod")) userType = "hod";

  // Get the appropriate navigation links based on user type
  const navigation =
    navLinks[userType as keyof typeof navLinks] || navLinks.public;

  // Mock user data (in a real app, this would come from auth context)
  const user =
    userType !== "public"
      ? {
          name:
            userType === "student"
              ? "John Doe"
              : userType === "teacher"
              ? "Prof. Smith"
              : "Dr. Johnson",
          email: `${userType}@example.com`,
          role: userType,
          image: `https://ui-avatars.com/api/?name=${userType}&background=0D8ABC&color=fff`,
        }
      : null;

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Top">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <GraduationCap className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                CMS
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center text-sm font-medium transition-colors ${
                  pathname === item.href
                    ? "text-blue-600"
                    : "text-gray-700 hover:text-blue-600"
                }`}
              >
                {item.icon}
                {item.name}
              </Link>
            ))}
          </div>

          {/* User Menu - Desktop */}
          <div className="hidden md:flex md:items-center">
            {user ? (
              <div className="relative ml-3">
                <button
                  className="flex items-center space-x-3 focus:outline-none"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                >
                  <div className="hidden md:block text-right">
                    <div className="text-sm font-medium text-gray-800">
                      {user.name}
                    </div>
                    <div className="text-xs text-gray-500 capitalize">
                      {user.role}
                    </div>
                  </div>
                  <img
                    className="h-8 w-8 rounded-full"
                    src={user.image}
                    alt={user.name}
                  />
                </button>

                {/* User dropdown menu */}
                {userMenuOpen && (
                  <div className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="px-4 py-3">
                      <p className="text-sm">Signed in as</p>
                      <p className="truncate text-sm font-medium text-gray-900">
                        {user.email}
                      </p>
                    </div>
                    <div className="border-t border-gray-100"></div>
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                    <Link
                      href="/"
                      className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign out
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm font-medium text-gray-700 hover:text-blue-600 px-3 py-2"
                >
                  Sign in
                </Link>
                <Link
                  href="/register"
                  className="ml-4 inline-flex items-center justify-center rounded-md bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-sm font-medium text-white hover:from-blue-700 hover:to-indigo-700 shadow-sm"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            {user && (
              <button
                className="mr-4"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
              >
                <img
                  className="h-8 w-8 rounded-full"
                  src={user.image}
                  alt={user.name}
                />
              </button>
            )}
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md p-2 text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">
                {mobileMenuOpen ? "Close menu" : "Open menu"}
              </span>
              {mobileMenuOpen ? (
                <X className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center rounded-md px-3 py-2 text-base font-medium ${
                    pathname === item.href
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.icon}
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Mobile user menu */}
            {user ? (
              <div className="border-t border-gray-200 pt-4 pb-3">
                <div className="flex items-center px-4">
                  <div className="flex-shrink-0">
                    <img
                      className="h-10 w-10 rounded-full"
                      src={user.image}
                      alt={user.name}
                    />
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-gray-800">
                      {user.name}
                    </div>
                    <div className="text-sm font-medium text-gray-500">
                      {user.email}
                    </div>
                  </div>
                </div>
                <div className="mt-3 space-y-1 px-2">
                  <Link
                    href="/profile"
                    className="flex items-center rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                  <Link
                    href="/logout"
                    className="flex items-center rounded-md px-3 py-2 text-base font-medium text-red-600 hover:bg-gray-50"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </Link>
                </div>
              </div>
            ) : (
              <div className="border-t border-gray-200 pt-4 pb-3">
                <Link
                  href="/login"
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign in
                </Link>
                <Link
                  href="/register"
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Mobile user dropdown (when user menu button is clicked) */}
        {userMenuOpen && user && window.innerWidth <= 768 && (
          <div className="absolute right-0 left-0 z-10 mt-2 mx-4 origin-top rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 md:hidden">
            <div className="py-1">
              <div className="px-4 py-3">
                <p className="text-sm">Signed in as</p>
                <p className="truncate text-sm font-medium text-gray-900">
                  {user.email}
                </p>
              </div>
              <div className="border-t border-gray-100"></div>
              <Link
                href="/profile"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                onClick={() => setUserMenuOpen(false)}
              >
                <User className="mr-2 h-4 w-4" />
                Profile
              </Link>
              <Link
                href="/logout"
                className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center"
                onClick={() => setUserMenuOpen(false)}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}

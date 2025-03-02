import {
  Book,
  GraduationCap,
  Users,
  Calendar,
  ArrowRight,
  CheckCircle,
} from "lucide-react";

export default function Home() {
  const features = [
    {
      title: "Course Management",
      description:
        "Efficiently manage academic courses and curricula with advanced tools",
      icon: <Book className="w-6 h-6" />,
    },
    {
      title: "Student Portal",
      description:
        "Seamless access to grades, attendance, and educational resources",
      icon: <GraduationCap className="w-6 h-6" />,
    },
    {
      title: "Faculty Dashboard",
      description:
        "Streamline teaching workflows and administrative responsibilities",
      icon: <Users className="w-6 h-6" />,
    },
    {
      title: "Schedule Planning",
      description:
        "Intelligent organization of classes and academic calendar events",
      icon: <Calendar className="w-6 h-6" />,
    },
  ];

  const testimonials = [
    {
      quote:
        "This system transformed how we manage our university operations. Highly recommended!",
      author: "Dr. Sarah Johnson",
      role: "Dean of Administration, Pacific University",
    },
    {
      quote:
        "The interface is intuitive and the features comprehensive. Exactly what we needed.",
      author: "Prof. Michael Chen",
      role: "Department Chair, Westlake College",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section - Modern asymmetric design */}
      <div className="bg-gradient-to-br from-indigo-600 via-blue-600 to-sky-500 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-20"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 text-white">
              <span className="bg-blue-800 bg-opacity-40 text-blue-100 py-1 px-3 rounded-full text-sm font-medium inline-block mb-6">
                Next-Generation Education Platform
              </span>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                Elevate Your <span className="text-sky-200">Educational</span>{" "}
                Institution
              </h1>
              <p className="text-blue-100 text-lg mb-8 max-w-lg">
                A comprehensive management system designed to streamline
                operations, enhance learning experiences, and drive
                institutional success.
              </p>
              <div className="flex flex-wrap gap-4">
                <a
                  href="/demo"
                  className="bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors inline-flex items-center group"
                >
                  Request Demo
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </a>
                <a
                  href="/about"
                  className="border border-white text-white px-6 py-3 rounded-lg font-medium hover:bg-white/10 transition-colors inline-block"
                >
                  Learn More
                </a>
              </div>
            </div>
            <div className="lg:col-span-6">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-500 rounded-2xl blur opacity-30"></div>
                <div className="relative bg-white rounded-xl shadow-2xl overflow-hidden">
                  <img
                    src="/api/placeholder/800/600"
                    alt="College Management Dashboard"
                    className="w-full h-auto"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 w-full h-24 bg-gradient-to-t from-gray-50 to-transparent"></div>
      </div>

      {/* Stats Section */}
      <div className="relative -mt-12 mb-12">
        <div className="max-w-5xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-xl p-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-4xl font-bold text-blue-600">500+</p>
              <p className="text-gray-600 mt-1">Institutions</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-blue-600">1M+</p>
              <p className="text-gray-600 mt-1">Students</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-blue-600">98%</p>
              <p className="text-gray-600 mt-1">Satisfaction</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-blue-600">24/7</p>
              <p className="text-gray-600 mt-1">Support</p>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section - Card-based design */}
      <div className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">
              Features
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-4">
              Complete Management Solution
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Our platform provides all the tools needed to efficiently manage
              your educational institution in one unified system.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group"
              >
                <div className="h-2 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
                <div className="p-8">
                  <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="bg-gray-100 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">
              Testimonials
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-4">
              Trusted by Leading Institutions
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-md">
                <svg
                  className="h-10 w-10 text-blue-500 mb-4"
                  fill="currentColor"
                  viewBox="0 0 32 32"
                >
                  <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                </svg>
                <p className="text-gray-700 mb-6 italic text-lg">
                  {testimonial.quote}
                </p>
                <div>
                  <p className="font-semibold text-gray-900">
                    {testimonial.author}
                  </p>
                  <p className="text-gray-600 text-sm">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section - Modern design with list of benefits */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl overflow-hidden shadow-xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
              <div className="p-12 lg:p-16 text-white">
                <h2 className="text-3xl font-bold mb-6">
                  Ready to Transform Your Institution?
                </h2>
                <p className="text-blue-100 mb-8 text-lg">
                  Join hundreds of educational institutions already benefiting
                  from our platform.
                </p>

                <ul className="space-y-3 mb-10">
                  {[
                    "Reduce administrative workload by 40%",
                    "Improve student engagement and outcomes",
                    "Centralize all institutional operations",
                    "Get detailed analytics and insights",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-blue-200 mr-3 mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <a
                  href="/register"
                  className="inline-block bg-white text-blue-600 px-8 py-4 rounded-lg font-medium hover:bg-blue-50 transition-colors shadow-md"
                >
                  Get Started Today
                </a>
              </div>
              <div className="hidden lg:block relative">
                <img
                  src="/api/placeholder/600/800"
                  alt="College students using platform"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-white font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Demo
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Guides
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Support
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Careers
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Terms
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Security
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p>© 2025 College Management System. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              {["twitter", "facebook", "instagram", "linkedin"].map(
                (platform) => (
                  <a
                    key={platform}
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <span className="sr-only">{platform}</span>
                    <div className="w-6 h-6">{/* Icon placeholder */}</div>
                  </a>
                )
              )}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

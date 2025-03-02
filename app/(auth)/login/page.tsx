// In your login page
import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <div className="max-w-md mx-auto my-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-center">Sign In</h1>
      <LoginForm />
    </div>
  );
}

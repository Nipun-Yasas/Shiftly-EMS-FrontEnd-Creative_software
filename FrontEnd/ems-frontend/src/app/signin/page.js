'use client';
import '../globals.css'; 
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (email === 'admin@example.com' && password === 'admin') {
      setErrorMsg('');
      router.push('/change-password');
    } else {
      setErrorMsg('Invalid credentials.');
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gray-100">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-50 z-0"
        style={{ backgroundImage: "url('/images/image1.jpg')" }}
      ></div>

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black opacity-50 z-0"></div>

      {/* Sign-in Card */}
      <div className="relative z-10 w-full max-w-sm bg-white px-6 py-8 rounded-xl shadow-lg mt-8">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Sign in</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div>
            <label className="block text-base font-medium text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              name="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 text-base"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-base font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              name="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 text-base"
            />
          </div>

          {/* Error Message */}
          {errorMsg && (
            <p className="text-sm text-red-600 text-center">{errorMsg}</p>
          )}

          {/* Sign In Button */}
          <button
            type="submit"
            className="w-full bg-[#E80A4D] text-white py-3 px-4 rounded-md hover:bg-pink-700 transition duration-200 text-base font-semibold"
          >
            Sign In
          </button>

          {/* Forgot Password */}
          <p className="text-sm text-center text-gray-500 hover:underline cursor-pointer">
            Forgot password?
          </p>

          {/* Sign Up Link */}
          <p className="text-sm text-center text-gray-700">
            New to Shiftly?{' '}
            <Link href="/signup" className="font-bold text-pink-600 hover:underline">
              Sign up now.
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

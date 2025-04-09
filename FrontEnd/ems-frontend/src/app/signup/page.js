import '../globals.css'; 
import Link from 'next/link';

export default function SignUpPage() {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
       {/* Background image */}
       <div className="absolute inset-0 bg-cover bg-center opacity-50 z-0" style={{ backgroundImage: "url('/images/image1.jpg')" }}></div>
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black opacity-50 z-0"></div>

      {/* Sign Up Box */}
      <div className="relative z-20 bg-white p-8 rounded-xl shadow-md w-full max-w-sm">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Sign Up</h2>
        <form className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              name="name"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>

          {/* Submit Button */}
          <div>
          <Link href="/signin" passHref>
            <button
              type="submit"
              className="w-full bg-[#E80A4D] text-white py-2 px-4 rounded-md hover:bg-pink-700 transition duration-200"
            >
              Sign Up
            </button>
            </Link>
          </div>

          {/* Info Message */}
          <p className="text-sm text-gray-500 text-center">
            You will receive a temporary password via email.
          </p>
        </form>
      </div>
    </div>
  );
}

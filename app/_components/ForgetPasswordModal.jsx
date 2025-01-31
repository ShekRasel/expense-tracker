'use client';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { AiOutlineClose, AiOutlineMail, AiOutlineLock } from 'react-icons/ai';

const ForgetPasswordModal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState(1); // 1: Request Reset, 2: Enter Token & Password
  const [loading, setLoading] = useState(false);

  const handleRequestReset = async () => {
    if (!email) {
      toast.error('Please enter your email');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('http://localhost:3000/user/forgetpassword', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) throw new Error('Failed to send reset request');

      toast.success('Reset link sent! Check your email for the token.');
      setStep(2);
    } catch (error) {
      toast.error(error.message);
    }
    setLoading(false);
  };

  const handleUpdatePassword = async () => {
    if (!token || !newPassword) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('http://localhost:3000/user/updatepassword', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, newPassword }),
      });

      if (!res.ok) throw new Error('Failed to update password');

      toast.success('Password updated successfully! Redirecting to Sign In...');
      setTimeout(() => {
        onClose();
        window.location.href = '/sign-in'; // Redirect
      }, 2000);
    } catch (error) {
      toast.error(error.message);
    }
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-600 hover:text-gray-900">
          <AiOutlineClose className="h-5 w-5" />
        </button>
        <h2 className="text-xl font-semibold text-center text-blue-600 mb-4">
          {step === 1 ? 'Reset Password' : 'Enter Token & New Password'}
        </h2>

        {step === 1 && (
          <>
            <label className="block text-gray-700 mb-2">Email</label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 pl-10 border rounded-md"
                placeholder="Enter your email"
              />
              <AiOutlineMail className="absolute left-3 top-3 text-gray-500 h-5 w-5" />
            </div>
            <button
              onClick={handleRequestReset}
              className="w-full bg-blue-600 text-white py-2 rounded-md mt-4 hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <label className="block text-gray-700 mb-2">Token</label>
            <input
              type="text"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="w-full px-4 py-2 border rounded-md mb-3"
              placeholder="Enter the token"
            />

            <label className="block text-gray-700 mb-2">New Password</label>
            <div className="relative">
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-2 pl-10 border rounded-md"
                placeholder="Enter new password"
              />
              <AiOutlineLock className="absolute left-3 top-3 text-gray-500 h-5 w-5" />
            </div>

            <button
              onClick={handleUpdatePassword}
              className="w-full bg-green-600 text-white py-2 rounded-md mt-4 hover:bg-green-700"
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgetPasswordModal;

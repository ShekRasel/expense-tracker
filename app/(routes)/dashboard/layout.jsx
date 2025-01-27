'use client';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SideNavbar from "./_components/SideNavbar";
import DashboardHeader from "./_components/DashboardHeader";
import { FiMail } from "react-icons/fi"; // Icon for feedback button
import { AiOutlineClose } from "react-icons/ai"; // Close icon for modal
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function DashboardLayout({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      router.push("/sign-in");
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleFeedbackChange = (e) => {
    setFeedback(e.target.value);
  };

  const handleSubmitFeedback = async () => {
    if (!feedback.trim()) {
      return;
    }

    const token = localStorage.getItem("authToken");

    if (!token) {
      toast.error('Please log in to submit feedback.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('http://localhost:3000/feedback/addFeedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Send token in Authorization header
        },
        body: JSON.stringify({ feedback }), // Send the feedback as 'feedback'
      });

      if (response.ok) {
        toast.success('Feedback submitted successfully!');
        setFeedback('');
        setIsModalOpen(false);
      } else {
        const errorResponse = await response.json();
        toast.error(errorResponse.message || 'Failed to submit feedback. Please try again.');
      }
    } catch (error) {
      toast.error('Error submitting feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="w-16 h-16 border-4 border-t-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex relative">
      {/* Sidebar */}
      <SideNavbar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      
      {/* Main content */}
      <div className="flex-1 md:ml-64"> {/* Give space for the sidebar */}
        <DashboardHeader toggleSidebar={toggleSidebar} />
        <div className="pt-20 px-5">{children}</div>
      </div>

      {/* Feedback Button */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-5 right-5 bg-blue-500 text-white px-4 py-2 rounded-sm shadow-lg hover:bg-blue-600 transition-all duration-300"
      >
        <FiMail size={24} />
      </button>

      {/* Feedback Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
            {/* Close Button */}
            <button
              onClick={handleCloseModal}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
            >
              <AiOutlineClose size={20} />
            </button>

            <h2 className="text-xl mb-4">Give Feedback</h2>
            <textarea
              value={feedback}
              onChange={handleFeedbackChange}
              className="w-full p-3 border border-gray-300 rounded-md mb-4"
              rows="5"
              placeholder="Write your feedback here..."
            />
            <div className="flex justify-end">
              <button
                onClick={handleSubmitFeedback}
                disabled={isSubmitting}
                className="bg-blue-500 text-white px-6 py-2 rounded-sm hover:bg-blue-600 disabled:bg-gray-300 transition-all duration-300"
              >
                {isSubmitting ? 'Sending...' : 'Send'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notifications */}
      <ToastContainer />
    </div>
  );
}

export default DashboardLayout;

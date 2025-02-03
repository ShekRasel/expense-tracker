
'use client'
import React, { useState } from 'react';
import { FiPlus } from 'react-icons/fi';
import { AiOutlineClose } from 'react-icons/ai';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const FeedbackPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const token = localStorage.getItem('authToken'); // Replace with your actual token

  const handleFeedbackChange = (e) => {
    setFeedback(e.target.value);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFeedback('');
  };

  const handleSubmitFeedback = async () => {
    setIsSubmitting(true);

    try {
      const response = await fetch('http://localhost:3000/feedback/addFeedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ feedback }),
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

  return (
    <div className="  flex  h-[90vh] items-center flex-cols justify-center p-4 ">
      {/* Feedback Box */}
      <div
        onClick={() => setIsModalOpen(true)}
        className="w-64 h-64 bg-gray-50 border rounded-lg shadow-md flex flex-col items-center justify-center cursor-pointer hover:shadow-lg transition-shadow duration-300"
      >
        <FiPlus size={48} className="text-blue-500 mb-2" />
        <p className="text-lg text-gray-700">Give Feedback</p>
      </div>

      {/* Feedback Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
            {/* Close Button */}
            <button
              onClick={handleCloseModal}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
            >
              <AiOutlineClose size={20} />
            </button>

            <h2 className="text-xl font-semibold mb-4">Give Feedback</h2>
            <textarea
              value={feedback}
              onChange={handleFeedbackChange}
              className="w-full p-3 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="5"
              placeholder="Write your feedback here..."
            />
            <div className="flex justify-end">
              <button
                onClick={handleSubmitFeedback}
                disabled={isSubmitting}
                className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-300 transition-all duration-300"
              >
                {isSubmitting ? 'Sending...' : 'Send'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default FeedbackPage;
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { axiosInstance } from "../lib/axios";
import {
  PlusCircle,
  Edit,
  Trash2,
  Info,
  Loader,
  FileBarChart,
  Calendar,
  Clock,
  AlertTriangle,
  Mail,
} from "lucide-react";
import toast from "react-hot-toast";

const HomePage = () => {
  const [flowcharts, setFlowcharts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();

  // Fetch all flowcharts for the user
  const fetchFlowcharts = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get("/flowchart/all");
      setFlowcharts(response.data.data || []);
    } catch (error) {
      console.error("Error fetching flowcharts:", error);
      // Don't show any toast for flowchart fetching errors
      setFlowcharts([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Delete a flowchart
  const handleDeleteFlowchart = async (flowId) => {
    if (window.confirm("Are you sure you want to delete this flowchart?")) {
      setIsDeleting(true);
      try {
        await axiosInstance.delete(`/flowchart/delete/${flowId}`);
        toast.success("Flowchart deleted successfully");
        fetchFlowcharts(); // Refresh the list
      } catch (error) {
        console.error("Error deleting flowchart:", error);
        toast.error(
          error.response?.data?.message || "Failed to delete flowchart"
        );
      } finally {
        setIsDeleting(false);
      }
    }
  };

  // Edit a flowchart
  const handleEditFlowchart = (flowId) => {
    navigate(`/create-flow?id=${flowId}`);
  };

  // View flowchart details
  const handleViewFlowchart = (flowId) => {
    navigate(`/view-flow/${flowId}`);
  };

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  // Count emails in a flowchart
  const countEmailNodes = (nodes) => {
    return nodes.filter((node) => node.type === "coldEmail").length;
  };

  // Count delays in a flowchart
  const countDelayNodes = (nodes) => {
    return nodes.filter((node) => node.type === "waitDelay").length;
  };

  // Fetch flowcharts on component mount
  useEffect(() => {
    fetchFlowcharts();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center pt-16">
        <div className="text-center">
          <Loader className="h-8 w-8 animate-spin text-blue-500 mx-auto" />
          <p className="mt-2 text-gray-600">Loading your flowcharts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 pt-20 pb-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Email Sequence Dashboard
            </h1>
            <p className="text-gray-600 mt-1">
              Manage your email marketing sequences
            </p>
          </div>

          <Link
            to="/create-flow"
            className="mt-4 sm:mt-0 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg shadow-md flex items-center hover:shadow-lg transition-all transform hover:scale-105"
          >
            <PlusCircle className="h-5 w-5 mr-2" />
            Create New Sequence
          </Link>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-md p-4 md:p-6 border border-gray-100">
          {flowcharts.length === 0 ? (
            <div className="text-center py-10">
              <FileBarChart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700">
                No email sequences yet
              </h3>
              <p className="text-gray-500 mt-2 max-w-md mx-auto">
                Create your first email sequence to start automating your email
                marketing campaigns
              </p>
              <Link
                to="/create-flow"
                className="mt-6 inline-block px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg shadow-md hover:shadow-lg transition-all transform hover:scale-105"
              >
                <PlusCircle className="h-5 w-5 inline mr-2" />
                Create Your First Sequence
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {flowcharts.map((flowchart) => (
                    <tr
                      key={flowchart._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {flowchart.flowName}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {formatDate(flowchart.createdAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex space-x-4 text-sm text-gray-500">
                          <span className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1 text-blue-500" />
                            {flowchart.nodes?.length || 0} Nodes
                          </span>
                          <span className="flex items-center">
                            <Mail className="h-4 w-4 mr-1 text-green-500" />
                            {countEmailNodes(flowchart.nodes || [])} Emails
                          </span>
                          <span className="flex items-center">
                            <Clock className="h-4 w-4 mr-1 text-amber-500" />
                            {countDelayNodes(flowchart.nodes || [])} Delays
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditFlowchart(flowchart._id)}
                            className="text-indigo-600 hover:text-indigo-900 transition-colors"
                            title="Edit"
                          >
                            <Edit className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleViewFlowchart(flowchart._id)}
                            className="text-blue-600 hover:text-blue-900 transition-colors"
                            title="View Details"
                          >
                            <Info className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDeleteFlowchart(flowchart._id)}
                            className="text-red-600 hover:text-red-900 transition-colors"
                            disabled={isDeleting}
                            title="Delete"
                          >
                            {isDeleting ? (
                              <Loader className="h-5 w-5 animate-spin" />
                            ) : (
                              <Trash2 className="h-5 w-5" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Optional: Quick Tips Section */}
        {flowcharts.length > 0 && (
          <div className="mt-6 bg-white rounded-xl shadow-sm p-4 border border-gray-100">
            <div className="flex items-start">
              <AlertTriangle className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />
              <div>
                <h3 className="font-medium text-gray-800">
                  Tips for effective email sequences
                </h3>
                <ul className="mt-2 text-sm text-gray-600 space-y-1 list-disc list-inside">
                  <li>Use personalized subject lines to increase open rates</li>
                  <li>Keep delays between 2-3 days for follow-up emails</li>
                  <li>Include a clear call-to-action in every email</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;

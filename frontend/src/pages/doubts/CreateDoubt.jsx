import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { doubtService } from "../../services/doubt.service";
import { useAuthStore } from "../../store/authStore";
import "./CreateDoubt.css";

const CreateDoubt = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    subject: "",
    tags: "",
    isUrgent: false,
  });
  const [loading, setLoading] = useState(false);

  const subjects = [
    "Data Structures",
    "Algorithms",
    "Database",
    "Operating System",
    "Networks",
    "Web Development",
    "Machine Learning",
    "Mathematics",
    "Physics",
    "Chemistry",
    "Other",
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create a plain object instead of FormData since we're not uploading files
      const doubtData = {
        title: formData.title,
        description: formData.description,
        subject: formData.subject,
        isUrgent: formData.isUrgent,
        // Handle tags
        tags: formData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag),
      };

      const response = await doubtService.createDoubt(doubtData);
      toast.success("Doubt posted successfully!");
      navigate(`/doubts/${response.data.doubt._id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to post doubt");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-doubt-page">
      <div className="container">
        <div className="page-header">
          <h1>Post a Doubt</h1>
          <p className="text-muted">
            Ask your question and get help from the community
          </p>
        </div>

        <form onSubmit={handleSubmit} className="doubt-form card">
          <div className="form-group">
            <label htmlFor="title">
              Title <span className="required">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="form-control"
              placeholder="e.g., How to implement binary search tree in C++?"
              maxLength="200"
            />
            <small className="text-muted">
              Be specific and clear in your title
            </small>
          </div>

          <div className="form-group">
            <label htmlFor="description">
              Description <span className="required">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              className="form-control"
              rows="8"
              placeholder="Provide detailed information about your doubt..."
              maxLength="5000"
            />
            <small className="text-muted">
              Include all relevant details, code snippets, and what you've tried
            </small>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="subject">
                Subject <span className="required">*</span>
              </label>
              <select
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                className="form-control"
              >
                <option value="">Select Subject</option>
                {subjects.map((subject) => (
                  <option key={subject} value={subject}>
                    {subject}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="tags">Tags</label>
              <input
                type="text"
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                className="form-control"
                placeholder="javascript, arrays, sorting (comma separated)"
              />
              <small className="text-muted">
                Add relevant tags separated by commas
              </small>
            </div>
          </div>

          {/* Removed file upload section */}

          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="isUrgent"
                checked={formData.isUrgent}
                onChange={handleChange}
              />
              <span>Mark as urgent</span>
            </label>
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? "Posting..." : "Post Doubt"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateDoubt;

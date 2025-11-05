import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { authService } from '../../services/auth.service';
import { useAuthStore } from '../../store/authStore';
import './Auth.css';

const Register = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
    department: '',
    branch: '',
    semester: ''
  });
  const [loading, setLoading] = useState(false);

  const departments = ['CSE', 'ECE', 'ME', 'CE', 'EEE', 'IT', 'Other'];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Prepare data based on role
      const registrationData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        department: formData.department
      };

      // Only add student-specific fields if role is student
      if (formData.role === 'student') {
        registrationData.branch = formData.branch;
        registrationData.semester = parseInt(formData.semester);
      }

      const response = await authService.register(registrationData);
      setAuth(response.data.user, response.data.token);
      toast.success('Registration successful!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="container">
        <div className="auth-card">
          <h2>Join DoubtStack</h2>
          <p className="auth-subtitle">Create your account and start learning together</p>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="form-control"
                placeholder="Enter your full name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="form-control"
                placeholder="Enter your email"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength="6"
                className="form-control"
                placeholder="Minimum 6 characters"
              />
            </div>

            <div className="form-group">
              <label htmlFor="role">Role</label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="form-control"
              >
                <option value="student">Student</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="department">Department</label>
              <select
                id="department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                required
                className="form-control"
              >
                <option value="">Select Department</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>

            {formData.role === 'student' && (
              <>
                <div className="form-group">
                  <label htmlFor="branch">Branch</label>
                  <input
                    type="text"
                    id="branch"
                    name="branch"
                    value={formData.branch}
                    onChange={handleChange}
                    required
                    className="form-control"
                    placeholder="e.g., Computer Science"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="semester">Semester</label>
                  <select
                    id="semester"
                    name="semester"
                    value={formData.semester}
                    onChange={handleChange}
                    required
                    className="form-control"
                  >
                    <option value="">Select Semester</option>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                      <option key={sem} value={sem}>{sem}</option>
                    ))}
                  </select>
                </div>
              </>
            )}

            <button type="submit" className="btn btn-primary w-full" disabled={loading}>
              {loading ? 'Creating Account...' : 'Register'}
            </button>
          </form>

          <p className="auth-footer">
            Already have an account? <Link to="/login">Login here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;

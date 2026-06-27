import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Register() {
  const { register } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 6) e.password = 'At least 6 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      toast.success('Account created!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const field = (name, label, type = 'text', placeholder) => (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-gray-500">{label}</label>
      <input
        type={type}
        value={form[name]}
        onChange={e => { setForm(p => ({ ...p, [name]: e.target.value })); setErrors(p => ({ ...p, [name]: '' })); }}
        className={`w-full px-3 py-2 text-sm rounded-lg border bg-white outline-none transition-colors
          ${errors[name] ? 'border-red-300 focus:border-red-400' : 'border-gray-200 focus:border-gray-400'}`}
        placeholder={placeholder}
      />
      {errors[name] && <span className="text-xs text-red-500">{errors[name]}</span>}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="mb-8">
          <h1 className="text-xl font-medium text-gray-900">TaskFlow</h1>
          <p className="text-sm text-gray-400 mt-1">Create your account</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col gap-4">
          {field('name', 'Name', 'text', 'Your name')}
          {field('email', 'Email', 'email', 'you@example.com')}
          {field('password', 'Password', 'password', '6+ characters')}
          <button
            type="submit"
            disabled={loading}
            className="mt-1 w-full py-2 px-4 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-400 mt-4">
          Already have an account?{' '}
          <Link to="/login" className="text-gray-700 font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

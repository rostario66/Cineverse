import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../api/auth';
import { validators } from '../utils/validation';

export default function Register() {
    const [form, setForm] = useState({
        userName: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [errors, setErrors] = useState<Record<string, string | null>>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});
    const [serverError, setServerError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    // Валидация поля
    const validateField = (name: string, value: string) => {
        let error: string | null = null;

        if (name === 'userName') error = validators.username(value);
        if (name === 'email') error = validators.email(value);
        if (name === 'password') error = validators.password(value);
        if (name === 'confirmPassword') {
            if (value !== form.password) error = 'Passwords do not match';
        }

        setErrors(prev => ({ ...prev, [name]: error }));
        return error;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));

        // Валидируем только если поле уже было затронуто
        if (touched[name]) {
            validateField(name, value);
        }

        // Если меняем пароль, перевалидируем confirmPassword
        if (name === 'password' && touched.confirmPassword) {
            setErrors(prev => ({
                ...prev,
                confirmPassword: value !== form.confirmPassword ? 'Passwords do not match' : null,
            }));
        }
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setTouched(prev => ({ ...prev, [name]: true }));
        validateField(name, value);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setServerError(null);

        // Валидируем все поля
        const usernameErr = validateField('userName', form.userName);
        const emailErr = validateField('email', form.email);
        const passwordErr = validateField('password', form.password);
        const confirmErr = form.password !== form.confirmPassword ? 'Passwords do not match' : null;

        setTouched({ userName: true, email: true, password: true, confirmPassword: true });
        setErrors({
            userName: usernameErr,
            email: emailErr,
            password: passwordErr,
            confirmPassword: confirmErr,
        });

        if (usernameErr || emailErr || passwordErr || confirmErr) return;

        setIsLoading(true);
        try {
            const response = await authApi.register({
                userName: form.userName,
                email: form.email,
                password: form.password,
            });
            login(response);
            navigate('/');
        } catch (err) {
            setServerError(err instanceof Error ? err.message : 'Registration failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-8">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white">Create account</h1>
                    <p className="text-gray-500 text-sm mt-2">Join the CineVerse community</p>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="bg-white/5 border border-white/10 rounded-2xl p-8 space-y-4"
                >
                    {/* Username */}
                    <FormField
                        label="Username"
                        name="userName"
                        value={form.userName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.userName ? errors.userName : null}
                        placeholder="cinephile"
                    />

                    {/* Email */}
                    <FormField
                        label="Email"
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.email ? errors.email : null}
                        placeholder="you@example.com"
                    />

                    {/* Password */}
                    <FormField
                        label="Password"
                        name="password"
                        type="password"
                        value={form.password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.password ? errors.password : null}
                        placeholder="••••••••"
                        hint="At least 8 characters, with uppercase, lowercase and a number"
                    />

                    {/* Confirm password */}
                    <FormField
                        label="Confirm password"
                        name="confirmPassword"
                        type="password"
                        value={form.confirmPassword}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.confirmPassword ? errors.confirmPassword : null}
                        placeholder="••••••••"
                    />

                    {serverError && (
                        <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-xl">
                            {serverError}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed text-black font-semibold py-3 rounded-xl transition-colors"
                    >
                        {isLoading ? 'Creating account...' : 'Create Account'}
                    </button>

                    <p className="text-center text-sm text-gray-500">
                        Already have an account?{' '}
                        <Link to="/login" className="text-cyan-400 hover:text-cyan-300">
                            Sign in
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}

// Переиспользуемый компонент поля формы
interface FormFieldProps {
    label: string;
    name: string;
    type?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
    error: string | null;
    placeholder: string;
    hint?: string;
}

function FormField({
    label, name, type = 'text', value, onChange, onBlur, error, placeholder, hint
}: FormFieldProps) {
    return (
        <div>
            <label className="block text-sm text-gray-300 mb-2">{label}</label>
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                required
                placeholder={placeholder}
                className={`w-full bg-white/5 border text-white px-4 py-3 rounded-xl outline-none transition-colors ${
                    error
                        ? 'border-red-500/50 focus:border-red-500'
                        : 'border-white/10 focus:border-cyan-500/50'
                }`}
            />
            {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
            {!error && hint && <p className="text-gray-500 text-xs mt-1">{hint}</p>}
        </div>
    );
}
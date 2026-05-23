import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { authApi } from "../api/auth";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            const response = await authApi.login({ email, password });
            login(response);
            navigate("/");
        }
        catch (err) {
            setError(err instanceof(Error) ? err.message : "Login failed");
        }
        finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                {/* Лого */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white">Welcome back</h1>
                    <p className="text-gray-500 text-sm mt-2">Sign in to your CineVerse account</p>
                </div>

                {/* Форма */}
                <form
                    onSubmit={handleSubmit}
                    className="bg-white/5 border border-white/10 rounded-2xl p-8 space-y-5"
                >
                    {/* Email */}
                    <div>
                        <label className="block text-sm text-gray-300 mb-2">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                            className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 rounded-xl outline-none focus:border-cyan-500/50 transition-colors"
                            placeholder="you@example.com"
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-sm text-gray-300 mb-2">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                            className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 rounded-xl outline-none focus:border-cyan-500/50 transition-colors"
                            placeholder="••••••••"
                        />
                    </div>

                    {/* Ошибка */}
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-xl">
                            {error}
                        </div>
                    )}

                    {/* Кнопка */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed text-black font-semibold py-3 rounded-xl transition-colors"
                    >
                        {isLoading ? 'Signing in...' : 'Sign In'}
                    </button>

                    {/* Ссылка на регистрацию */}
                    <p className="text-center text-sm text-gray-500">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-cyan-400 hover:text-cyan-300">
                            Sign up
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    )
}

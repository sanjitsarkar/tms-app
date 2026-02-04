import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useMutation } from '@apollo/client';
import { Truck, Mail, Lock, AlertCircle, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { LOGIN_MUTATION } from '../graphql/queries';
import { useAppDispatch } from '../store/hooks';
import { loginSuccess, loginFailure, setLoading } from '../store/slices/authSlice';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const [login, { loading }] = useMutation(LOGIN_MUTATION, {
        onCompleted: (data) => {
            dispatch(loginSuccess({
                user: data.login.user,
                token: data.login.token
            }));
            navigate('/');
        },
        onError: (error) => {
            setError(error.message || 'Invalid email or password');
            dispatch(loginFailure(error.message));
        }
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!email || !password) {
            setError('Please fill in all fields');
            return;
        }

        dispatch(setLoading(true));
        await login({ variables: { email, password } });
    };

    const handleDemoLogin = (role: 'admin' | 'employee') => {
        if (role === 'admin') {
            setEmail('admin@tms.com');
            setPassword('admin123');
        } else {
            setEmail('employee@tms.com');
            setPassword('employee123');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
            {/* Animated background */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-radial from-primary-500/20 via-transparent to-transparent animate-pulse" />
                <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-radial from-accent-500/20 via-transparent to-transparent animate-pulse" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md relative"
            >
                {/* Logo */}
                <div className="text-center mb-8">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', duration: 0.8 }}
                        className="w-20 h-20 mx-auto rounded-2xl bg-gradient-primary flex items-center justify-center shadow-glow-md mb-4"
                    >
                        <Truck size={40} className="text-white" />
                    </motion.div>
                    <h1 className="text-3xl font-bold text-gradient mb-2">Welcome Back</h1>
                    <p className="text-dark-400">Sign in to your TMS account</p>
                </div>

                {/* Login form */}
                <motion.form
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    onSubmit={handleSubmit}
                    className="glass-dark rounded-3xl p-8 shadow-2xl"
                >
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center gap-2 p-4 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 mb-6"
                        >
                            <AlertCircle size={20} />
                            <span className="text-sm">{error}</span>
                        </motion.div>
                    )}

                    <div className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-dark-300 mb-2">Email</label>
                            <div className="relative">
                                <Mail size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-500" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email"
                                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-dark-800/50 border border-white/10 
                    text-white placeholder:text-dark-500 focus:outline-none focus:border-primary-500/50 
                    focus:ring-2 focus:ring-primary-500/20 transition-all"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-dark-300 mb-2">Password</label>
                            <div className="relative">
                                <Lock size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-500" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-dark-800/50 border border-white/10 
                    text-white placeholder:text-dark-500 focus:outline-none focus:border-primary-500/50 
                    focus:ring-2 focus:ring-primary-500/20 transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    <motion.button
                        type="submit"
                        disabled={loading}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full mt-8 py-3.5 rounded-xl bg-gradient-primary text-white font-semibold 
              shadow-glow-sm hover:shadow-glow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed
              flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <Loader2 size={20} className="animate-spin" />
                                Signing in...
                            </>
                        ) : (
                            'Sign In'
                        )}
                    </motion.button>

                    {/* Demo accounts */}
                    <div className="mt-8 pt-6 border-t border-white/10">
                        <p className="text-center text-sm text-dark-500 mb-4">Quick demo login</p>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => handleDemoLogin('admin')}
                                className="py-2.5 px-4 rounded-xl border border-primary-500/30 text-primary-400 
                  hover:bg-primary-500/10 transition-all text-sm font-medium"
                            >
                                Admin Demo
                            </button>
                            <button
                                type="button"
                                onClick={() => handleDemoLogin('employee')}
                                className="py-2.5 px-4 rounded-xl border border-accent-500/30 text-accent-400 
                  hover:bg-accent-500/10 transition-all text-sm font-medium"
                            >
                                Employee Demo
                            </button>
                        </div>
                    </div>
                </motion.form>

                <p className="text-center text-dark-500 text-sm mt-6">
                    Transportation Management System © 2024
                </p>
            </motion.div>
        </div>
    );
};

export default Login;

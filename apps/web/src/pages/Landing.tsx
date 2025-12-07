import React, { useState } from 'react';
import { TrendingUp, BarChart3, DollarSign, Shield, Users, Zap, ArrowRight } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import {login,signup}   from '../services/auth';
export default function LandingPage() {
    const [showAuth, setShowAuth] = useState(false);
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [Loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const handleLogin = async (email: string, password: string) => {
        setLoading(true);
        try {
            const data = await login(email, password);
            localStorage.setItem("Token", data.token);
            console.log("Token", data.token);


            navigate("/home", { replace: true });
        }
        catch (err) {
            alert("Login failed");
        } finally {
            setLoading(false);
        }
    };


    const handleSignup = async (name: string, email: string, password: string) => {
        setLoading(true);
        try {
            const data = await signup(name, email, password);
            localStorage.setItem("Token", data.token);
            console.log("Token", data.token);


            navigate("/home", { replace: true });
        }
        catch (e) {
            console.log(e);
            alert(e);
        } finally {
            setLoading(false);
        }


    };

    const handleAuthSubmit = () => {
        if (isLogin) {
            handleLogin(formData.email, formData.password);
        } else {
            handleSignup(formData.name, formData.email, formData.password);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950">
            
            <nav className="fixed top-0 w-full bg-slate-950 bg-opacity-95 backdrop-blur-sm border-b border-slate-800 z-50">
                <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                        <TrendingUp className="text-cyan-400" size={32} />
                        <span className="text-2xl font-bold text-white">TradeSim</span>
                    </div>
                    <div className="flex space-x-4">
                        <button
                            onClick={() => { setShowAuth(true); setIsLogin(true); }}
                            className="px-5 py-2 text-slate-300 hover:text-cyan-400 font-medium transition"
                        >
                            Login
                        </button>
                        <button
                            onClick={() => { setShowAuth(true); setIsLogin(false); }}
                            className="px-5 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:from-cyan-400 hover:to-blue-400 font-medium transition"
                        >
                            Sign Up
                        </button>
                    </div>
                </div>
            </nav>

        
            {showAuth && (
                <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
                    <div className="bg-slate-900 rounded-lg p-8 max-w-md w-full border border-slate-700 shadow-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-white">
                                {isLogin ? 'Welcome Back' : 'Create Account'}
                            </h2>
                            <button
                                onClick={() => setShowAuth(false)}
                                className="text-slate-400 hover:text-white text-2xl transition"
                            >
                                ×
                            </button>
                        </div>
                        <div className="space-y-4">
                            {!isLogin && (
                                <input
                                    type="text"
                                    placeholder="Full Name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg focus:outline-none focus:border-cyan-500 text-white placeholder-slate-400"
                                />
                            )}
                            <input
                                type="email"
                                placeholder="Email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg focus:outline-none focus:border-cyan-500 text-white placeholder-slate-400"
                            />
                            <input
                                type="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg focus:outline-none focus:border-cyan-500 text-white placeholder-slate-400"
                            />
                            <button
                                onClick={handleAuthSubmit}
                                className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:from-cyan-400 hover:to-blue-400 font-medium transition"
                                   disabled = {Loading}
                            >
                              
                                {isLogin ? 'Login' : 'Sign Up'}
                            </button>
                        </div>
                        <p className="text-center mt-4 text-slate-400">
                            {isLogin ? "Don't have an account? " : "Already have an account? "}
                            <button
                                onClick={() => setIsLogin(!isLogin)}
                                className="text-cyan-400 hover:text-cyan-300 font-medium transition"
                            >
                                {isLogin ? 'Sign Up' : 'Login'}
                            </button>
                        </p>
                    </div>
                </div>
            )}

            {/* Hero Section */}
            <section className="pt-32 pb-20 px-6">
                <div className="max-w-6xl mx-auto text-center">
                    <h1 className="text-5xl md:text-6xl font-bold mb-6">
                        <span className="text-white">Master Trading Without</span>
                        <span className="block bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mt-2">
                            Risking Real Money
                        </span>
                    </h1>
                    <p className="text-xl text-slate-400 mb-8 max-w-2xl mx-auto leading-relaxed">
                        Practice trading stocks, options, and crypto with virtual money. Build confidence and test strategies in a risk-free environment.
                    </p>
                    <button
                        onClick={() => { setShowAuth(true); setIsLogin(false); }}
                        className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:from-cyan-400 hover:to-blue-400 text-lg font-medium inline-flex items-center space-x-2 transition shadow-lg shadow-cyan-500/30"
                    >
                        <span>Start Trading Free</span>
                        <ArrowRight size={20} />
                    </button>
                    <div className="mt-16 bg-slate-900 border border-slate-800 rounded-lg p-8 shadow-2xl">
                        <div className="grid grid-cols-3 gap-8 text-center">
                            <div>
                                <BarChart3 className="mx-auto mb-3 text-cyan-400" size={48} />
                                <h3 className="text-3xl font-bold text-white">100K+</h3>
                                <p className="text-slate-400">Active Traders</p>
                            </div>
                            <div>
                                <DollarSign className="mx-auto mb-3 text-yellow-400" size={48} />
                                <h3 className="text-3xl font-bold text-white">$100K</h3>
                                <p className="text-slate-400">Virtual Starting Balance</p>
                            </div>
                            <div>
                                <TrendingUp className="mx-auto mb-3 text-purple-400" size={48} />
                                <h3 className="text-3xl font-bold text-white">Real-Time</h3>
                                <p className="text-slate-400">Market Data</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-slate-900 px-6">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-4xl font-bold text-center text-white mb-4">
                        Everything You Need to Learn Trading
                    </h2>
                    <p className="text-center text-slate-400 mb-16 text-lg">
                        Powerful features designed to help you become a confident trader
                    </p>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="bg-slate-800 border border-slate-700 p-8 rounded-lg hover:border-cyan-500 hover:shadow-lg hover:shadow-cyan-500/10 transition">
                            <Shield className="text-cyan-400 mb-4" size={40} />
                            <h3 className="text-2xl font-bold text-white mb-4">Zero Risk Trading</h3>
                            <p className="text-slate-400 leading-relaxed">
                                Trade with virtual money and learn from mistakes without any financial consequences. Perfect for beginners and experienced traders testing new strategies.
                            </p>
                        </div>
                        <div className="bg-slate-800 border border-slate-700 p-8 rounded-lg hover:border-cyan-500 hover:shadow-lg hover:shadow-cyan-500/10 transition">
                            <Zap className="text-yellow-400 mb-4" size={40} />
                            <h3 className="text-2xl font-bold text-white mb-4">Real Market Conditions</h3>
                            <p className="text-slate-400 leading-relaxed">
                                Experience actual market prices and conditions. Our platform uses live market data so you can practice trading in realistic scenarios.
                            </p>
                        </div>
                        <div className="bg-slate-800 border border-slate-700 p-8 rounded-lg hover:border-cyan-500 hover:shadow-lg hover:shadow-cyan-500/10 transition">
                            <BarChart3 className="text-purple-400 mb-4" size={40} />
                            <h3 className="text-2xl font-bold text-white mb-4">Advanced Analytics</h3>
                            <p className="text-slate-400 leading-relaxed">
                                Track your performance with detailed analytics and insights. Understand your trading patterns and identify areas for improvement.
                            </p>
                        </div>
                        <div className="bg-slate-800 border border-slate-700 p-8 rounded-lg hover:border-cyan-500 hover:shadow-lg hover:shadow-cyan-500/10 transition">
                            <Users className="text-pink-400 mb-4" size={40} />
                            <h3 className="text-2xl font-bold text-white mb-4">Community Learning</h3>
                            <p className="text-slate-400 leading-relaxed">
                                Join a community of traders, share strategies, and learn from others. Compete in trading competitions and climb the leaderboards.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-20 px-6 bg-slate-950">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-4xl font-bold text-center text-white mb-4">
                        Get Started in 3 Simple Steps
                    </h2>
                    <p className="text-center text-slate-400 mb-16 text-lg">
                        Begin your trading journey in less than a minute
                    </p>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6 shadow-lg shadow-cyan-500/50">
                                1
                            </div>
                            <h3 className="text-xl font-bold text-white mb-4">Sign Up Free</h3>
                            <p className="text-slate-400 leading-relaxed">
                                Create your account in seconds. No credit card required, no hidden fees.
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6 shadow-lg shadow-cyan-500/50">
                                2
                            </div>
                            <h3 className="text-xl font-bold text-white mb-4">Get Virtual Money</h3>
                            <p className="text-slate-400 leading-relaxed">
                                Start with $100,000 in virtual cash to practice trading without any risk.
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6 shadow-lg shadow-cyan-500/50">
                                3
                            </div>
                            <h3 className="text-xl font-bold text-white mb-4">Start Trading</h3>
                            <p className="text-slate-400 leading-relaxed">
                                Buy and sell stocks, track your portfolio, and learn as you go.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-br from-cyan-600 via-blue-600 to-purple-700 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-4xl font-bold text-white mb-6">
                        Ready to Start Your Trading Journey?
                    </h2>
                    <p className="text-xl text-cyan-100 mb-8">
                        Join thousands of traders learning to invest smarter with TradeSim
                    </p>
                    <button
                        onClick={() => { setShowAuth(true); setIsLogin(false); }}
                        className="px-8 py-4 bg-white text-blue-600 rounded-lg hover:bg-slate-100 text-lg font-medium inline-flex items-center space-x-2 transition shadow-xl"
                    >
                        <span>Create Free Account</span>
                        <ArrowRight size={20} />
                    </button>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-black text-white py-12 px-6 border-t border-slate-800">
                <div className="max-w-6xl mx-auto text-center">
                    <div className="flex items-center justify-center space-x-2 mb-6">
                        <TrendingUp className="text-cyan-400" size={28} />
                        <span className="text-2xl font-bold">TradeSim</span>
                    </div>
                    <p className="text-slate-400 mb-6">
                        Practice trading without the risk. Learn, grow, and become a better trader.
                    </p>
                    <p className="text-slate-600 text-sm">
                        © 2025 TradeSim. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
}
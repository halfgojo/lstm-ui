import { Link } from 'react-router-dom';
import { Battery, TrendingUp, Activity, ArrowRight } from 'lucide-react';

export default function Home() {
    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="container mx-auto px-4 py-20">
                <div className="text-center max-w-4xl mx-auto">
                    <div className="flex justify-center mb-6">
                        <Battery className="w-20 h-20 text-blue-400 animate-pulse" />
                    </div>
                    <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                        Early Prediction of Battery Swelling
                    </h1>
                    <p className="text-xl text-slate-300 mb-8">
                        Using Delta-Resistance (ΔR) and Machine Learning to detect battery swelling before it becomes dangerous
                    </p>
                    <div className="flex gap-4 justify-center">
                        <Link to="/dashboard" className="btn-primary flex items-center gap-2">
                            Go to Dashboard <ArrowRight className="w-5 h-5" />
                        </Link>
                        <Link to="/methodology" className="bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200">
                            Learn More
                        </Link>
                    </div>
                </div>
            </section>

            {/* Problem & Solution */}
            <section className="container mx-auto px-4 py-16">
                <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                    {/* Problem */}
                    <div className="card border-red-500/30">
                        <h2 className="text-2xl font-bold mb-4 text-red-400">⚠️ The Problem</h2>
                        <ul className="space-y-3 text-slate-300">
                            <li className="flex items-start gap-2">
                                <span className="text-red-400 mt-1">•</span>
                                <span>Battery swelling causes safety risks and thermal runaway</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-red-400 mt-1">•</span>
                                <span>Traditional BMS detect failures too late</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-red-400 mt-1">•</span>
                                <span>Irreversible damage often occurs before detection</span>
                            </li>
                        </ul>
                    </div>

                    {/* Solution */}
                    <div className="card border-green-500/30">
                        <h2 className="text-2xl font-bold mb-4 text-green-400">✓ Our Solution</h2>
                        <ul className="space-y-3 text-slate-300">
                            <li className="flex items-start gap-2">
                                <span className="text-green-400 mt-1">•</span>
                                <span><strong>Delta-Resistance (ΔR)</strong> - Physics-based early indicator</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-green-400 mt-1">•</span>
                                <span><strong>ML Models</strong> - LSTM, Random Forest, GBDT</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-green-400 mt-1">•</span>
                                <span><strong>Early Detection</strong> - Before irreversible damage</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* Architecture */}
            <section className="container mx-auto px-4 py-16">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl font-bold text-center mb-8">System Architecture</h2>
                    <div className="card">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="flex flex-col items-center">
                                <Activity className="w-12 h-12 text-blue-400 mb-2" />
                                <p className="font-semibold">Battery Data</p>
                                <p className="text-sm text-slate-400">CSV Upload</p>
                            </div>
                            <ArrowRight className="w-8 h-8 text-slate-500 rotate-90 md:rotate-0" />
                            <div className="flex flex-col items-center">
                                <TrendingUp className="w-12 h-12 text-purple-400 mb-2" />
                                <p className="font-semibold">ΔR Calculation</p>
                                <p className="text-sm text-slate-400">Client-Side</p>
                            </div>
                            <ArrowRight className="w-8 h-8 text-slate-500 rotate-90 md:rotate-0" />
                            <div className="flex flex-col items-center">
                                <Battery className="w-12 h-12 text-green-400 mb-2" />
                                <p className="font-semibold">Prediction</p>
                                <p className="text-sm text-slate-400">Health Status</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="container mx-auto px-4 py-16 pb-32">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="card text-center">
                            <div className="text-4xl mb-4">📊</div>
                            <h3 className="text-xl font-bold mb-2">Real-Time Analysis</h3>
                            <p className="text-slate-400">Upload CSV and get instant predictions</p>
                        </div>
                        <div className="card text-center">
                            <div className="text-4xl mb-4">📈</div>
                            <h3 className="text-xl font-bold mb-2">Visual Insights</h3>
                            <p className="text-slate-400">Interactive charts for trend analysis</p>
                        </div>
                        <div className="card text-center">
                            <div className="text-4xl mb-4">🎯</div>
                            <h3 className="text-xl font-bold mb-2">High Accuracy</h3>
                            <p className="text-slate-400">Physics-informed ML predictions</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

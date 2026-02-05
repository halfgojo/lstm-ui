export default function Methodology() {
    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <h1 className="text-4xl font-bold mb-8">Model & Methodology</h1>

            {/* Delta-Resistance Explanation */}
            <section className="card mb-8">
                <h2 className="text-2xl font-bold mb-4">What is Delta-Resistance (ΔR)?</h2>
                <div className="space-y-4 text-slate-300">
                    <p>
                        Delta-Resistance is the change in internal resistance of a battery compared to its initial state:
                    </p>
                    <div className="bg-slate-900/50 p-4 rounded-lg font-mono text-center text-lg">
                        ΔR = Current Resistance - Initial Resistance
                    </div>
                    <p>
                        <strong className="text-blue-400">Why it matters:</strong> Battery swelling causes gas formation
                        and mechanical deformation, which increases internal resistance. By tracking ΔR, we can detect
                        swelling early before visible damage occurs.
                    </p>
                </div>
            </section>

            {/* Physics Behind It */}
            <section className="card mb-8 border-purple-500/30">
                <h2 className="text-2xl font-bold mb-4">⚡ Physics Behind Swelling</h2>
                <div className="space-y-3 text-slate-300">
                    <div className="flex items-start gap-3">
                        <span className="text-2xl">1️⃣</span>
                        <div>
                            <strong>Gas Formation:</strong> Electrolyte decomposition produces gases
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <span className="text-2xl">2️⃣</span>
                        <div>
                            <strong>Mechanical Stress:</strong> Gas buildup causes electrode separation
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <span className="text-2xl">3️⃣</span>
                        <div>
                            <strong>Resistance Increase:</strong> Poor contact raises internal resistance
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <span className="text-2xl">4️⃣</span>
                        <div>
                            <strong>ΔR Detection:</strong> Our system catches this change early
                        </div>
                    </div>
                </div>
            </section>

            {/* Model Comparison */}
            <section className="card mb-8">
                <h2 className="text-2xl font-bold mb-4">🧠 Machine Learning Models</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="border-b border-slate-600">
                            <tr>
                                <th className="py-3 px-4">Model</th>
                                <th className="py-3 px-4">Use Case</th>
                                <th className="py-3 px-4">Performance</th>
                            </tr>
                        </thead>
                        <tbody className="text-slate-300">
                            <tr className="border-b border-slate-700">
                                <td className="py-3 px-4 font-semibold">Random Forest</td>
                                <td className="py-3 px-4">Static prediction</td>
                                <td className="py-3 px-4 text-green-400">High</td>
                            </tr>
                            <tr className="border-b border-slate-700">
                                <td className="py-3 px-4 font-semibold">GBDT</td>
                                <td className="py-3 px-4">Feature learning</td>
                                <td className="py-3 px-4 text-green-400">Very High</td>
                            </tr>
                            <tr>
                                <td className="py-3 px-4 font-semibold">LSTM</td>
                                <td className="py-3 px-4">Time-series prediction</td>
                                <td className="py-3 px-4 text-blue-400 font-bold">Best ⭐</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Why LSTM */}
            <section className="card mb-8 bg-blue-500/10 border-blue-500/30">
                <h2 className="text-2xl font-bold mb-4">🎯 Why LSTM Performs Best</h2>
                <ul className="space-y-2 text-slate-300">
                    <li className="flex items-start gap-2">
                        <span className="text-blue-400 mt-1">✓</span>
                        <span>Handles sequential battery degradation data</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-blue-400 mt-1">✓</span>
                        <span>Captures long-term dependencies in resistance trends</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-blue-400 mt-1">✓</span>
                        <span>Lowest validation loss across all test scenarios</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-blue-400 mt-1">✓</span>
                        <span>Real-time prediction capability for BMS integration</span>
                    </li>
                </ul>
            </section>

            {/* Current Implementation */}
            <section className="card">
                <h2 className="text-2xl font-bold mb-4">💻 Current Implementation</h2>
                <p className="text-slate-300 mb-4">
                    This web application uses a <strong className="text-yellow-400">rule-based prediction system</strong>
                    for demonstration purposes:
                </p>
                <div className="bg-slate-900/50 p-4 rounded-lg space-y-2 text-sm font-mono">
                    <div className="text-green-400">ΔR &lt; 5% → Normal 🟢</div>
                    <div className="text-yellow-400">5% ≤ ΔR &lt; 15% → Early Swelling 🟡</div>
                    <div className="text-red-400">ΔR ≥ 15% → Critical 🔴</div>
                </div>
                <p className="text-slate-400 text-sm mt-4">
                    For production deployment, the LSTM model can be integrated via TensorFlow.js or a backend API.
                </p>
            </section>
        </div>
    );
}

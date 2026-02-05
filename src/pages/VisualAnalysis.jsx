import { useState } from 'react';
import { ResistanceChart, DeltaResistanceChart, TemperatureChart } from '../components/Charts';

export default function VisualAnalysis() {
    // Sample data for demonstration
    const [sampleData] = useState([
        { cycle: 1, Resistance: 0.085, delta_resistance_percent: 0, Temperature: 25.3 },
        { cycle: 2, Resistance: 0.086, delta_resistance_percent: 1.2, Temperature: 27.5 },
        { cycle: 3, Resistance: 0.088, delta_resistance_percent: 3.5, Temperature: 29.2 },
        { cycle: 4, Resistance: 0.089, delta_resistance_percent: 4.7, Temperature: 31.0 },
        { cycle: 5, Resistance: 0.091, delta_resistance_percent: 7.1, Temperature: 32.8 },
        { cycle: 6, Resistance: 0.093, delta_resistance_percent: 9.4, Temperature: 34.5 },
        { cycle: 7, Resistance: 0.095, delta_resistance_percent: 11.8, Temperature: 36.2 },
        { cycle: 8, Resistance: 0.098, delta_resistance_percent: 15.3, Temperature: 37.8 },
    ]);

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold mb-4">Visual Analysis</h1>
            <p className="text-slate-400 mb-8">
                Explore battery health trends through interactive visualizations
            </p>

            <div className="space-y-8">
                <div className="card bg-blue-500/10 border-blue-500/30">
                    <h2 className="text-2xl font-bold mb-4">📊 How to Interpret Charts</h2>
                    <div className="grid md:grid-cols-3 gap-4 text-sm">
                        <div>
                            <h3 className="font-semibold text-blue-400 mb-2">Resistance Trend</h3>
                            <p className="text-slate-300">
                                Increasing resistance indicates internal degradation and potential swelling
                            </p>
                        </div>
                        <div>
                            <h3 className="font-semibold text-yellow-400 mb-2">Delta-Resistance</h3>
                            <p className="text-slate-300">
                                ΔR &gt; 5% signals early swelling; ΔR &gt; 15% is critical
                            </p>
                        </div>
                        <div>
                            <h3 className="font-semibold text-red-400 mb-2">Temperature</h3>
                            <p className="text-slate-300">
                                Rising temperature correlates with swelling and thermal risks
                            </p>
                        </div>
                    </div>
                </div>

                <ResistanceChart data={sampleData} />
                <DeltaResistanceChart data={sampleData} />
                <TemperatureChart data={sampleData} />

                <div className="card">
                    <h2 className="text-2xl font-bold mb-4">🔍 Key Observations</h2>
                    <ul className="space-y-2 text-slate-300">
                        <li className="flex items-start gap-2">
                            <span className="text-green-400 mt-1">✓</span>
                            <span>
                                <strong>Cycles 1-4:</strong> Normal operation with minimal resistance change
                            </span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-yellow-400 mt-1">⚠</span>
                            <span>
                                <strong>Cycles 5-7:</strong> Early swelling phase with ΔR between 5-15%
                            </span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-red-400 mt-1">✗</span>
                            <span>
                                <strong>Cycle 8+:</strong> Critical swelling with ΔR exceeding 15%
                            </span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

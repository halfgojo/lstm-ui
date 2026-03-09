import { useState, useEffect } from 'react';
import FileUpload from '../components/FileUpload';
import StatusCard from '../components/StatusCard';
import MetricsCard from '../components/MetricsCard';
import { ResistanceChart, DeltaResistanceChart } from '../components/Charts';
import { parseCSV, calculateDeltaResistance, validateCSVStructure } from '../utils/csvParser';
import { analyzeBatteryData } from '../services/prediction';
import {
    checkBackendHealth,
    predictWithBackend,
    transformPredictionsForCharts,
    transformToAnalysis,
} from '../services/api';

export default function Dashboard() {
    const [isLoading, setIsLoading] = useState(false);
    const [batteryData, setBatteryData] = useState(null);
    const [analysis, setAnalysis] = useState(null);
    const [error, setError] = useState(null);
    const [backendAvailable, setBackendAvailable] = useState(false);
    const [usingML, setUsingML] = useState(false);

    useEffect(() => {
        checkBackendHealth().then((isHealthy) => {
            setBackendAvailable(isHealthy);
        });
    }, []);

    const handleFileUpload = async (file) => {
        setIsLoading(true);
        setError(null);
        setUsingML(false);

        // try ML backend first, if it fails fall back to client side
        if (backendAvailable) {
            try {
                const response = await predictWithBackend(file);
                const chartData = transformPredictionsForCharts(response.data);
                const analysisResult = transformToAnalysis(response, chartData);

                setBatteryData(chartData);
                setAnalysis(analysisResult);
                setUsingML(true);
                setIsLoading(false);
                return;
            } catch (err) {
                console.warn('ML backend failed, falling back to client-side:', err.message);
            }
        }

        try {
            const parsedData = await parseCSV(file);

            const validation = validateCSVStructure(parsedData);
            if (!validation.valid) {
                throw new Error(validation.error);
            }

            const dataWithDelta = calculateDeltaResistance(parsedData);
            setBatteryData(dataWithDelta);

            const analysisResult = analyzeBatteryData(dataWithDelta);
            setAnalysis(analysisResult);
        } catch (err) {
            setError(err.message);
            console.error('Error processing file:', err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold mb-2">Battery Health Dashboard</h1>

            <div className="mb-6 flex items-center gap-3">
                <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${backendAvailable
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                        : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                        }`}
                >
                    <span
                        className={`w-2 h-2 rounded-full ${backendAvailable ? 'bg-green-400 animate-pulse' : 'bg-yellow-400'
                            }`}
                    />
                    {backendAvailable ? 'ML Backend Connected' : 'Client-Side Mode'}
                </span>
                {usingML && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                        🧠 LSTM Model Active
                    </span>
                )}
            </div>

            <div className="mb-8">
                <FileUpload onFileUpload={handleFileUpload} isLoading={isLoading} />
            </div>

            {error && (
                <div className="mb-8 p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-300">
                    <strong>Error:</strong> {error}
                </div>
            )}

            {analysis && (
                <div className="mb-8">
                    <StatusCard prediction={analysis.prediction} />
                </div>
            )}

            {analysis && usingML && analysis.summary && (
                <div className="mb-8 card border border-blue-500/20">
                    <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
                        🧠 ML Model Predictions
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                            <p className="text-slate-400">Total Predictions</p>
                            <p className="text-lg font-bold">{analysis.summary.total_predictions}</p>
                        </div>
                        <div>
                            <p className="text-slate-400">Normal</p>
                            <p className="text-lg font-bold text-green-400">{analysis.summary.normal_count}</p>
                        </div>
                        <div>
                            <p className="text-slate-400">Warning</p>
                            <p className="text-lg font-bold text-yellow-400">{analysis.summary.warning_count}</p>
                        </div>
                        <div>
                            <p className="text-slate-400">Critical</p>
                            <p className="text-lg font-bold text-red-400">{analysis.summary.critical_count}</p>
                        </div>
                    </div>
                </div>
            )}

            {analysis && (
                <div className="mb-8">
                    <h2 className="text-2xl font-bold mb-4">Key Metrics</h2>
                    <MetricsCard metrics={analysis.metrics} />
                </div>
            )}

            {batteryData && (
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold">Trend Analysis</h2>
                    <ResistanceChart data={batteryData} />
                    <DeltaResistanceChart data={batteryData} />
                </div>
            )}

            {!batteryData && !isLoading && (
                <div className="card text-center py-16">
                    <p className="text-slate-400 text-lg">
                        Upload a CSV file to begin analysis
                    </p>
                </div>
            )}
        </div>
    );
}

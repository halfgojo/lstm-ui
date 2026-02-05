import { useState } from 'react';
import FileUpload from '../components/FileUpload';
import StatusCard from '../components/StatusCard';
import MetricsCard from '../components/MetricsCard';
import { ResistanceChart, DeltaResistanceChart } from '../components/Charts';
import { parseCSV, calculateDeltaResistance, validateCSVStructure } from '../utils/csvParser';
import { analyzeBatteryData } from '../services/prediction';

export default function Dashboard() {
    const [isLoading, setIsLoading] = useState(false);
    const [batteryData, setBatteryData] = useState(null);
    const [analysis, setAnalysis] = useState(null);
    const [error, setError] = useState(null);

    const handleFileUpload = async (file) => {
        setIsLoading(true);
        setError(null);

        try {
            // Parse CSV
            const parsedData = await parseCSV(file);

            // Validate structure
            const validation = validateCSVStructure(parsedData);
            if (!validation.valid) {
                throw new Error(validation.error);
            }

            // Calculate Delta-Resistance
            const dataWithDelta = calculateDeltaResistance(parsedData);
            setBatteryData(dataWithDelta);

            // Analyze data
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
            <h1 className="text-4xl font-bold mb-8">Battery Health Dashboard</h1>

            {/* File Upload */}
            <div className="mb-8">
                <FileUpload onFileUpload={handleFileUpload} isLoading={isLoading} />
            </div>

            {/* Error Message */}
            {error && (
                <div className="mb-8 p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-300">
                    <strong>Error:</strong> {error}
                </div>
            )}

            {/* Status Card */}
            {analysis && (
                <div className="mb-8">
                    <StatusCard prediction={analysis.prediction} />
                </div>
            )}

            {/* Metrics Cards */}
            {analysis && (
                <div className="mb-8">
                    <h2 className="text-2xl font-bold mb-4">Key Metrics</h2>
                    <MetricsCard metrics={analysis.metrics} />
                </div>
            )}

            {/* Charts */}
            {batteryData && (
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold">Trend Analysis</h2>
                    <ResistanceChart data={batteryData} />
                    <DeltaResistanceChart data={batteryData} />
                </div>
            )}

            {/* Empty State */}
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

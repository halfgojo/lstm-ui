import { AlertCircle, CheckCircle, AlertTriangle } from 'lucide-react';

export default function StatusCard({ prediction }) {
    if (!prediction) {
        return (
            <div className="card text-center">
                <div className="text-slate-400">
                    <AlertCircle className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg">Upload battery data to see prediction</p>
                </div>
            </div>
        );
    }

    const { status, confidence, color, description } = prediction;

    const getIcon = () => {
        switch (status) {
            case 'Normal':
                return <CheckCircle className="w-20 h-20" />;
            case 'Early Swelling':
                return <AlertTriangle className="w-20 h-20" />;
            case 'Critical':
                return <AlertCircle className="w-20 h-20" />;
            default:
                return <AlertCircle className="w-20 h-20" />;
        }
    };

    const getColorClasses = () => {
        switch (status) {
            case 'Normal':
                return 'text-green-400 border-green-500/50 bg-green-500/10';
            case 'Early Swelling':
                return 'text-yellow-400 border-yellow-500/50 bg-yellow-500/10';
            case 'Critical':
                return 'text-red-400 border-red-500/50 bg-red-500/10';
            default:
                return 'text-slate-400 border-slate-500/50 bg-slate-500/10';
        }
    };

    const getBadgeColor = () => {
        switch (status) {
            case 'Normal':
                return 'bg-green-500 text-white';
            case 'Early Swelling':
                return 'bg-yellow-500 text-black';
            case 'Critical':
                return 'bg-red-500 text-white';
            default:
                return 'bg-slate-500 text-white';
        }
    };

    return (
        <div className={`card border-2 ${getColorClasses()} transition-all duration-500`}>
            <div className="text-center">
                <div className="flex justify-center mb-4 animate-pulse">
                    {getIcon()}
                </div>

                <div className={`status-badge ${getBadgeColor()} inline-block mb-4`}>
                    {status}
                </div>

                <p className="text-slate-300 mb-4">{description}</p>

                <div className="bg-slate-900/50 rounded-lg p-4 inline-block">
                    <p className="text-sm text-slate-400">Confidence Score</p>
                    <p className="text-3xl font-bold mt-1">
                        {(confidence * 100).toFixed(1)}%
                    </p>
                </div>
            </div>
        </div>
    );
}

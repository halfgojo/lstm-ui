import { Activity, TrendingUp, Battery, Thermometer } from 'lucide-react';

export default function MetricsCard({ metrics }) {
    if (!metrics) return null;

    const metricItems = [
        {
            label: 'Current Resistance',
            value: metrics.currentResistance?.toFixed(4) || 'N/A',
            unit: 'Ω',
            icon: Activity,
            color: 'text-blue-400',
            show: true
        },
        {
            label: 'Delta Resistance',
            value: metrics.deltaResistancePercent?.toFixed(2) || 'N/A',
            unit: '%',
            icon: TrendingUp,
            color: Math.abs(metrics.deltaResistancePercent) > 10 ? 'text-red-400' : 'text-green-400',
            show: true
        },
        {
            label: 'State of Charge',
            value: metrics.soc?.toFixed(1) || 'N/A',
            unit: '%',
            icon: Battery,
            color: 'text-purple-400',
            show: metrics.soc !== undefined
        },
        {
            label: 'Temperature',
            value: metrics.temperature?.toFixed(1) || 'N/A',
            unit: '°C',
            icon: Thermometer,
            color: metrics.temperature > 40 ? 'text-red-400' : 'text-cyan-400',
            show: metrics.temperature !== undefined
        }
    ].filter(item => item.show);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {metricItems.map((item, index) => {
                const Icon = item.icon;
                return (
                    <div key={index} className="card hover:scale-105 transition-transform">
                        <div className="flex items-center gap-3 mb-2">
                            <Icon className={`w-5 h-5 ${item.color}`} />
                            <p className="text-sm text-slate-400">{item.label}</p>
                        </div>
                        <p className={`text-2xl font-bold ${item.color}`}>
                            {item.value} <span className="text-lg">{item.unit}</span>
                        </p>
                    </div>
                );
            })}
        </div>
    );
}

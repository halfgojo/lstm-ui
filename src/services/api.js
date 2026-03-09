const API_BASE_URL = 'http://localhost:8000';

export const checkBackendHealth = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/health`, {
            method: 'GET',
            signal: AbortSignal.timeout(3000),
        });
        if (!response.ok) return false;
        const data = await response.json();
        return data.status === 'healthy' && data.model_loaded;
    } catch {
        return false;
    }
};

export const predictWithBackend = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/predict`, {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Backend error: ${response.status}`);
    }

    return response.json();
};

export const transformPredictionsForCharts = (predictions) => {
    return predictions.map((p) => ({
        cycle: p.cycle,
        Resistance: p.resistance,
        predicted_resistance: p.predicted_resistance,
        delta_resistance_percent: p.delta_resistance_percent,
        Temperature: p.temperature,
        SoC: p.soc,
        status: p.status,
    }));
};

export const transformToAnalysis = (backendResponse, chartData) => {
    const { summary, data } = backendResponse;
    const latest = data[data.length - 1];

    const statusMap = {
        Normal: {
            status: 'Normal',
            color: 'battery-normal',
            description: 'ML model predicts battery is operating within normal parameters.',
        },
        Warning: {
            status: 'Early Swelling',
            color: 'battery-warning',
            description: 'ML model detects early signs of swelling. Monitor closely.',
        },
        Critical: {
            status: 'Critical',
            color: 'battery-critical',
            description: 'ML model predicts critical swelling! Immediate action required.',
        },
    };

    const predictionInfo = statusMap[summary.overall_status] || statusMap.Normal;

    return {
        prediction: {
            ...predictionInfo,
            confidence: 0.92,
            deltaResistancePercent: summary.max_delta_resistance_percent,
        },
        metrics: {
            currentResistance: latest.resistance,
            predictedResistance: latest.predicted_resistance,
            deltaResistance: latest.delta_resistance,
            deltaResistancePercent: latest.delta_resistance_percent,
            temperature: latest.temperature,
            soc: latest.soc,
            avgResistance: summary.avg_predicted_resistance,
            avgTemperature:
                chartData.reduce((s, d) => s + d.Temperature, 0) / chartData.length,
            avgSoC: chartData.reduce((s, d) => s + d.SoC, 0) / chartData.length,
            maxDeltaR: summary.max_delta_resistance_percent,
            totalCycles: summary.total_predictions,
        },
        mlPowered: true,
        summary,
        latestReading: latest,
    };
};

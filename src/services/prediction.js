export const predictHealthStatus = (deltaResistancePercent) => {
    const absDelta = Math.abs(deltaResistancePercent);

    let status, confidence, color, description;

    if (absDelta < 5) {
        status = 'Normal';
        confidence = 0.95 - (absDelta / 5) * 0.15;
        color = 'battery-normal';
        description = 'Battery is operating within normal parameters';
    } else if (absDelta < 15) {
        status = 'Early Swelling';
        confidence = 0.85 - ((absDelta - 5) / 10) * 0.15;
        color = 'battery-warning';
        description = 'Early signs of swelling detected. Monitor closely.';
    } else {
        status = 'Critical';
        confidence = 0.90 + Math.min((absDelta - 15) / 20, 0.09);
        color = 'battery-critical';
        description = 'Critical swelling detected! Immediate action required.';
    }

    return {
        status,
        confidence: Math.min(confidence, 0.99),
        color,
        description,
        deltaResistancePercent: absDelta
    };
};

export const analyzeBatteryData = (data) => {
    if (!data || data.length === 0) {
        return null;
    }

    const latestReading = data[data.length - 1];
    const prediction = predictHealthStatus(latestReading.delta_resistance_percent);

    const avgResistance = data.reduce((sum, row) =>
        sum + (row.Resistance || row.resistance || 0), 0) / data.length;

    const avgTemperature = data.reduce((sum, row) =>
        sum + (row.Temperature || row.temperature || 0), 0) / data.length;

    const avgSoC = data.reduce((sum, row) =>
        sum + (row.SoC || row.soc || 0), 0) / data.length;

    const maxDeltaR = Math.max(...data.map(row =>
        Math.abs(row.delta_resistance_percent || 0)));

    return {
        prediction,
        metrics: {
            currentResistance: latestReading.Resistance || latestReading.resistance,
            deltaResistance: latestReading.delta_resistance,
            deltaResistancePercent: latestReading.delta_resistance_percent,
            temperature: latestReading.Temperature || latestReading.temperature,
            soc: latestReading.SoC || latestReading.soc,
            avgResistance,
            avgTemperature,
            avgSoC,
            maxDeltaR,
            totalCycles: data.length
        },
        latestReading
    };
};

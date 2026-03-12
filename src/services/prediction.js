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
  
  // Get latest reading
  const latestReading = data[data.length - 1];
  const prediction = predictHealthStatus(latestReading.delta_resistance_percent);
  
  // Calculate statistics only for fields that exist
  const getAvg = (fieldName, fieldAlias) => {
    const validRows = data.filter(r => r[fieldName] !== undefined || r[fieldAlias] !== undefined);
    if (validRows.length === 0) return undefined;
    
    const sum = validRows.reduce((acc, row) => 
      acc + (row[fieldName] || row[fieldAlias] || 0), 0);
    return sum / validRows.length;
  };
  
  const avgResistance = getAvg('Resistance', 'resistance');
  const avgTemperature = getAvg('Temperature', 'temperature');
  const avgSoC = getAvg('SoC', 'soc');
  
  const maxDeltaR = Math.max(...data.map(row => 
    Math.abs(row.delta_resistance_percent || 0)));
  
  return {
    prediction,
    metrics: {
      currentResistance: latestReading.Resistance || latestReading.resistance,
      deltaResistance: latestReading.delta_resistance,
      deltaResistancePercent: latestReading.delta_resistance_percent,
      temperature: latestReading.Temperature || latestReading.temperature || undefined,
      soc: latestReading.SoC || latestReading.soc || undefined,
      avgResistance,
      avgTemperature,
      avgSoC,
      maxDeltaR,
      totalCycles: data.length
    },
    latestReading
  };
};

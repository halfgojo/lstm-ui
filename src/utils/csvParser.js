import Papa from 'papaparse';

export const parseCSV = (file) => {
    return new Promise((resolve, reject) => {
        Papa.parse(file, {
            header: true,
            dynamicTyping: true,
            skipEmptyLines: true,
            complete: (results) => {
                if (results.errors.length > 0) {
                    reject(new Error('CSV parsing failed: ' + results.errors[0].message));
                } else {
                    resolve(results.data);
                }
            },
            error: (error) => {
                reject(error);
            }
        });
    });
};

export const calculateDeltaResistance = (data) => {
    if (!data || data.length === 0) return [];

    const initialResistance = data[0].Resistance || data[0].resistance || 0;

    return data.map((row, index) => {
        const currentResistance = row.Resistance || row.resistance || 0;
        const deltaResistance = currentResistance - initialResistance;
        const deltaResistancePercent = initialResistance !== 0
            ? (deltaResistance / initialResistance) * 100
            : 0;

        return {
            ...row,
            cycle: index + 1,
            delta_resistance: deltaResistance,
            delta_resistance_percent: deltaResistancePercent,
            initial_resistance: initialResistance
        };
    });
};

export const validateCSVStructure = (data) => {
    if (!data || data.length === 0) {
        return { valid: false, error: 'CSV file is empty' };
    }

    const firstRow = data[0];
    const fields = Object.keys(firstRow).map(k => k.toLowerCase());

    // Only Resistance is truly required for ΔR calculation
    const hasResistance = fields.some(f => f === 'resistance');

    if (!hasResistance) {
        return {
            valid: false,
            error: 'Missing required field: Resistance. Your CSV must have a "Resistance" column.'
        };
    }

    return { valid: true };
};

# Battery Swelling Prediction System

Early prediction of lithium-ion battery swelling using Delta-Resistance (ΔR) and Machine Learning.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

Visit `http://localhost:5173/` to use the application.

## 📋 Features

- **Real-time Prediction**: Upload CSV battery data and get instant swelling predictions
- **Interactive Visualizations**: Charts showing resistance trends, delta-resistance, and temperature
- **Color-Coded Status**: Green (Normal), Yellow (Early Swelling), Red (Critical)
- **Sample Data**: Pre-loaded CSV files for testing (Normal, Warning, Critical)
- **Modern UI**: Dark-themed interface with TailwindCSS

## 🔬 How It Works

The system uses **Delta-Resistance (ΔR)** as an early indicator of battery swelling:

```
ΔR = Current Resistance - Initial Resistance
```

**Classification Thresholds:**
- ΔR < 5% → Normal 🟢
- 5% ≤ ΔR < 15% → Early Swelling 🟡
- ΔR ≥ 15% → Critical 🔴

## 📁 CSV Format

Your CSV file must contain these columns:
- `Resistance` (Ω)
- `Temperature` (°C)
- `SoC` (State of Charge, %)

Optional columns: `Voltage`, `Current`, `Cycle`

## 🛠️ Tech Stack

- React 18 + Vite 5
- TailwindCSS 3
- Recharts (Data Visualization)
- React Router DOM
- PapaParse (CSV Parsing)

## 📊 Sample Data

Three sample CSV files are included in `/public`:
- `sample_normal.csv` - Healthy battery
- `sample_warning.csv` - Early swelling indicators
- `sample_critical.csv` - Critical swelling

## 🎓 Project Background

This application demonstrates early battery swelling detection using physics-based features and machine learning concepts. The Delta-Resistance metric captures internal resistance changes caused by gas formation and electrode deformation during battery degradation.

## 🔮 Future Enhancements

- TensorFlow.js integration for LSTM model inference
- Backend API with FastAPI
- Real-time monitoring via WebSocket
- PDF report generation
- Historical data comparison

## 📄 License

MIT


- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

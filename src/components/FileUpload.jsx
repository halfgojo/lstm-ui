import { Upload, FileText } from 'lucide-react';
import { useState } from 'react';

export default function FileUpload({ onFileUpload, isLoading }) {
    const [dragActive, setDragActive] = useState(false);
    const [fileName, setFileName] = useState('');

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    const handleFile = (file) => {
        if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
            alert('Please upload a CSV file');
            return;
        }
        setFileName(file.name);
        onFileUpload(file);
    };

    return (
        <div className="card">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Upload Battery Data
            </h3>

            <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${dragActive
                        ? 'border-blue-500 bg-blue-500/10'
                        : 'border-slate-600 hover:border-slate-500'
                    }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
            >
                <input
                    type="file"
                    id="file-upload"
                    className="hidden"
                    accept=".csv"
                    onChange={handleChange}
                    disabled={isLoading}
                />

                <label
                    htmlFor="file-upload"
                    className="cursor-pointer flex flex-col items-center gap-3"
                >
                    <FileText className="w-12 h-12 text-slate-400" />
                    <div>
                        <p className="text-lg font-semibold text-slate-200">
                            {isLoading ? 'Processing...' : 'Drop CSV file here or click to browse'}
                        </p>
                        <p className="text-sm text-slate-400 mt-1">
                            CSV must contain: Resistance (Temperature, SoC optional)
                        </p>
                    </div>
                    {fileName && (
                        <div className="mt-2 px-4 py-2 bg-slate-700/50 rounded-lg">
                            <p className="text-sm text-slate-300">📄 {fileName}</p>
                        </div>
                    )}
                </label>
            </div>

            <div className="mt-4 flex gap-2 text-sm text-slate-400">
                <span>Sample files:</span>
                <a href="/sample_normal.csv" download className="text-blue-400 hover:underline">
                    Normal
                </a>
                <span>•</span>
                <a href="/sample_warning.csv" download className="text-yellow-400 hover:underline">
                    Warning
                </a>
                <span>•</span>
                <a href="/sample_critical.csv" download className="text-red-400 hover:underline">
                    Critical
                </a>
            </div>
        </div>
    );
}

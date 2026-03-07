import React, { useState } from "react";
import { X, Upload, Check, AlertCircle, Loader2 } from "lucide-react";
import axios from "axios";
import { router } from "@inertiajs/react";

export default function ImportModal({ isOpen, onClose }) {
    const [file, setFile] = useState(null);
    const [headers, setHeaders] = useState([]);
    const [mapping, setMapping] = useState({});
    const [step, setStep] = useState(1); // 1: Select, 2: Map, 3: Process
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState({ current: 0, total: 0, percent: 0 });
    const [missingFields, setMissingFields] = useState([]);

    const FIELDS = [
        { id: "sku", label: "SKU*", required: true },
        { id: "pp_id", label: "PP ID", required: false },
        { id: "description", label: "Description*", required: true },
        { id: "list_price", label: "List Price*", required: true },
        { id: "stock_oakville", label: "Stock Oakville", required: false },
        { id: "stock_mississauga", label: "Stock Mississauga", required: false },
        { id: "stock_saskatoon", label: "Stock Saskatoon", required: false },
        { id: "part_type_id", label: "Part Type ID*", required: true },
        { id: "shop_view_id", label: "Shop View ID*", required: true },
        { id: "sorting_id", label: "Sorting ID*", required: true },
        { id: "location_id", label: "Location ID", required: false },
        { id: "visibility", label: "Visibility*", required: true },
        { id: "is_clearance", label: "Is Clearance", required: false },
        { id: "interchange_numbers", label: "Interchange Numbers", required: false },
        { id: "fitments", label: "Fitments", required: false },
        { id: "image_source", label: "Image Sources (Comma separated)", required: false },
    ];

    const handleFileChange = async (e) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile) return;

        setFile(selectedFile);
        setLoading(true);

        const formData = new FormData();
        formData.append("file", selectedFile);

        try {
            const response = await axios.post(route("admin.products.parse-import"), formData);
            setHeaders(response.data.headers || []);
            
            // Auto-mapping logic
            const newMapping = {};
            response.data.headers.forEach((header, index) => {
                const standardizedHeader = header.toLowerCase().replace(/[^a-z0-9]/g, "").trim();
                
                const match = FIELDS.find(f => {
                    const fieldId = f.id.toLowerCase().replace(/[^a-z0-9]/g, "");
                    const fieldLabel = f.label.toLowerCase().replace("*", "").replace(/[^a-z0-9]/g, "").trim();
                    const cleanHeader = header.toLowerCase().replace(/[^a-z0-9]/g, "").trim();
                    
                    return fieldId === cleanHeader || 
                           fieldLabel === cleanHeader ||
                           cleanHeader.includes(fieldId) ||
                           fieldId.includes(cleanHeader);
                });
                
                if (match) {
                    newMapping[match.id] = index;
                }
            });
            setMapping(newMapping);
            
            // Check for missing fields that usually are given manually
            const missing = FIELDS.filter(f => !newMapping.hasOwnProperty(f.id)).map(f => ({
                label: f.label.replace('*', ''),
                required: f.required
            }));
            setMissingFields(missing);

            setStep(2);
        } catch (error) {
            console.error("Parse error", error);
            alert("Failed to parse CSV file. Please make sure it's a valid CSV.");
        } finally {
            setLoading(false);
        }
    };

    const handleMappingChange = (fieldId, headerIndex) => {
        const newMapping = { ...mapping, [fieldId]: headerIndex === "" ? null : parseInt(headerIndex) };
        setMapping(newMapping);
        
        // Update missing fields
        const missing = FIELDS.filter(f => !newMapping.hasOwnProperty(f.id) || newMapping[f.id] === null).map(f => ({
            label: f.label.replace('*', ''),
            required: f.required
        }));
        setMissingFields(missing);
    };

    const handleImport = () => {
        if (!mapping.sku && mapping.sku !== 0) {
            alert("SKU mapping is required.");
            return;
        }

        setLoading(true);
        setStep(3); // Moving to progress step

        // Start polling progress
        const progressInterval = setInterval(async () => {
            try {
                const res = await axios.get(route("admin.products.import-progress"));
                const { progress, total, status } = res.data;
                const percent = total > 0 ? Math.round((progress / total) * 100) : 0;
                setProgress({ current: progress, total, percent });
                
                if (status === 'completed' || status === 'failed') {
                    clearInterval(progressInterval);
                }
            } catch (e) {
                console.error("Progress error", e);
            }
        }, 1000);

        router.post(route("admin.products.import"), {
            file: file,
            mapping: JSON.stringify(mapping)
        }, {
            forceFormData: true,
            onSuccess: () => {
                clearInterval(progressInterval);
                onClose();
                reset();
            },
            onError: () => {
                clearInterval(progressInterval);
                setLoading(false);
                setStep(2);
            },
            onFinish: () => {
                // Interval will handle cleanup on status change
            }
        });
    };

    const reset = () => {
        setFile(null);
        setHeaders([]);
        setMapping({});
        setStep(1);
        setLoading(false);
        setMissingFields([]);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <div>
                        <h3 className="text-lg font-bold text-slate-900">Import Products</h3>
                        <p className="text-sm text-slate-500">Bulk upload your inventory from CSV</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                        <X size={20} className="text-slate-500" />
                    </button>
                </div>

                <div className="p-6">
                    {step === 1 && (
                        <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-xl p-10 hover:border-blue-400 transition-colors group cursor-pointer relative">
                            <input 
                                type="file" 
                                accept=".csv" 
                                onChange={handleFileChange} 
                                className="absolute inset-0 opacity-0 cursor-pointer"
                                disabled={loading}
                            />
                            {loading ? (
                                <Loader2 size={40} className="text-blue-500 animate-spin mb-4" />
                            ) : (
                                <Upload size={40} className="text-slate-400 group-hover:text-blue-500 mb-4 transition-colors" />
                            )}
                            <p className="text-slate-900 font-semibold text-center">
                                {loading ? "Parsing file..." : "Click or drag CSV file to upload"}
                            </p>
                            <p className="text-slate-500 text-sm mt-1">Only .csv files are supported</p>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                            <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-100 rounded-lg">
                                <span className="text-sm text-blue-700 font-medium">Map CSV Columns to Product Fields</span>
                                <Check size={16} className="text-blue-600" />
                            </div>

                            {missingFields.length > 0 && (
                                <div className="p-3 bg-amber-50 border border-amber-100 rounded-lg">
                                    <div className="flex items-center gap-2 text-amber-800 font-bold text-sm mb-1 uppercase tracking-wider">
                                        <AlertCircle size={16} /> 
                                        <span>Missing Expected Fields</span>
                                    </div>
                                    <p className="text-[12px] text-amber-700 leading-relaxed mb-2 font-medium">
                                        The following fields were not found in your CSV headers. You can manually map them if they exist under different names, or they will be imported with default values:
                                    </p>
                                    <div className="flex flex-wrap gap-1.5">
                                        {missingFields.map((field, idx) => (
                                            <span 
                                                key={idx} 
                                                className={`inline-flex px-2 py-0.5 border text-[10px] font-bold rounded-md shadow-sm transition-all ${
                                                    field.required 
                                                        ? "bg-rose-50 border-rose-200 text-rose-700 ring-1 ring-rose-200" 
                                                        : "bg-white border-amber-200 text-amber-700"
                                                }`}
                                            >
                                                {field.label} {field.required && <span className="ml-1 text-rose-500">*</span>}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="text-left text-slate-500 uppercase text-[11px] font-bold tracking-wider">
                                        <th className="pb-3 px-2">Field Name</th>
                                        <th className="pb-3 px-2 text-right">CSV Column</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {FIELDS.map((field) => (
                                        <tr key={field.id} className="group hover:bg-slate-50 transition-colors">
                                            <td className="py-2.5 px-2">
                                                <span className={`font-medium ${field.required ? "text-slate-900" : "text-slate-600"}`}>
                                                    {field.label}
                                                </span>
                                            </td>
                                            <td className="py-2.5 px-2 text-right">
                                                <select
                                                    value={mapping[field.id] === undefined ? "" : mapping[field.id]}
                                                    onChange={(e) => handleMappingChange(field.id, e.target.value)}
                                                    className="text-[13px] border-slate-200 rounded-md py-1 px-2 focus:ring-blue-500 focus:border-blue-500 min-w-[150px]"
                                                >
                                                    <option value="">-- Ignore --</option>
                                                    {headers.map((h, idx) => (
                                                        <option key={idx} value={idx}>{h}</option>
                                                    ))}
                                                </select>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="py-10 flex flex-col items-center justify-center space-y-6">
                            <div className="relative w-32 h-32 flex items-center justify-center">
                                <svg className="w-full h-full transform -rotate-90">
                                    <circle
                                        cx="64"
                                        cy="64"
                                        r="58"
                                        stroke="currentColor"
                                        strokeWidth="8"
                                        fill="transparent"
                                        className="text-slate-100"
                                    />
                                    <circle
                                        cx="64"
                                        cy="64"
                                        r="58"
                                        stroke="currentColor"
                                        strokeWidth="8"
                                        fill="transparent"
                                        strokeDasharray={364.4}
                                        strokeDashoffset={364.4 - (364.4 * progress.percent) / 100}
                                        className="text-blue-500 transition-all duration-500 ease-out"
                                        strokeLinecap="round"
                                    />
                                </svg>
                                <span className="absolute text-2xl font-bold text-slate-900">{progress.percent}%</span>
                            </div>
                            
                            <div className="text-center">
                                <h4 className="text-lg font-bold text-slate-900">Processing Data...</h4>
                                <p className="text-sm text-slate-500 mt-1">
                                    Imported <span className="font-mono font-bold text-blue-600">{progress.current}</span> of <span className="font-mono font-bold text-slate-700">{progress.total}</span> products
                                </p>
                            </div>

                            <div className="w-full max-w-xs bg-slate-100 h-2 rounded-full overflow-hidden">
                                <div 
                                    className="bg-blue-500 h-full transition-all duration-500" 
                                    style={{ width: `${progress.percent}%` }}
                                />
                            </div>
                            
                            <p className="text-[11px] text-slate-400 italic">Please do not close this window until finished</p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <button 
                        onClick={() => {
                            if (step === 2) setStep(1);
                            else if (step === 3) return; // Prevent closing while processing easily
                            else onClose();
                        }} 
                        className={`px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors ${step === 3 ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={step === 3}
                    >
                        {step === 2 ? "Back" : "Cancel"}
                    </button>
                    {step === 2 && (
                        <button
                            onClick={handleImport}
                            disabled={loading}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm font-bold shadow-lg shadow-blue-200 transition-all flex items-center"
                        >
                            {loading && <Loader2 size={16} className="animate-spin mr-2" />}
                            Start Import
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

import React, { useState, useEffect } from "react";
import { Upload, X, CheckCircle2, AlertCircle } from "lucide-react";

const FileUpload = ({
    data,
    setData,
    errors, // লারাভেলের errors অবজেক্ট এখানে আসবে
    clearErrors, // Inertia clearErrors ফাংশন
    field = "image",
    label = "Product Image",
    multiple = false,
}) => {
    const [previews, setPreviews] = useState([]);

    useEffect(() => {
        return () => previews.forEach((p) => URL.revokeObjectURL(p.url));
    }, [previews]);

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        // নতুন ফাইল সিলেক্ট করলে আগের এরর রিমুভ হবে
        if (errors[field]) {
            clearErrors(field);
        }

        if (multiple) {
            const currentFiles = data[field] || [];
            setData(field, [...currentFiles, ...files]);

            const newPreviews = files.map((file) => ({
                url: URL.createObjectURL(file),
                name: file.name,
                size: (file.size / 1024).toFixed(1) + " KB",
            }));
            setPreviews((prev) => [...prev, ...newPreviews]);
        } else {
            setData(field, files[0]);
            setPreviews([
                {
                    url: URL.createObjectURL(files[0]),
                    name: files[0].name,
                    size: (files[0].size / 1024).toFixed(1) + " KB",
                },
            ]);
        }
    };

    const removeImage = (index) => {
        if (multiple) {
            const updatedFiles = Array.from(data[field]).filter(
                (_, i) => i !== index
            );
            const updatedPreviews = previews.filter((_, i) => i !== index);
            setData(field, updatedFiles);
            setPreviews(updatedPreviews);
        } else {
            setData(field, null);
            setPreviews([]);
        }
    };

    return (
        <div className="w-full font-sans">
            {label && (
                <label className="text-sm font-semibold text-slate-700 mb-2 block">
                    {label}
                </label>
            )}

            <div
                className={`relative group border-2 border-dashed rounded-2xl p-8 transition-all duration-300 ease-in-out
                ${
                    errors[field]
                        ? "border-red-400 bg-red-50/50"
                        : "border-slate-200 bg-slate-50/30 hover:bg-white hover:border-orange-400"
                }`}
            >
                <input
                    type="file"
                    multiple={multiple}
                    accept="image/jpeg,image/png,image/jpg,image/webp"
                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                    onChange={handleFileChange}
                />

                <div className="flex flex-col items-center justify-center text-center">
                    <div className="mb-4 p-4 bg-white border border-slate-100 shadow-sm rounded-2xl text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-all duration-300">
                        <Upload size={24} strokeWidth={2.5} />
                    </div>

                    <p className="text-[15px] font-semibold text-slate-800">
                        Drop your image here, or{" "}
                        <span className="text-orange-600 font-bold">
                            browse
                        </span>
                    </p>
                    <p className="text-xs font-medium text-slate-400 mt-1.5 flex items-center gap-2">
                        <span>JPEG, PNG, JPG, WEBP</span>
                        <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                        <span>Max 20MB</span>
                    </p>
                </div>
            </div>

            {errors[field] && (
                <div className="flex items-center gap-1.5 mt-2 text-red-500 font-medium text-xs bg-red-50 p-2 rounded-lg border border-red-100 animate-in fade-in duration-300">
                    <AlertCircle size={14} />
                    <span>{errors[field]}</span>
                </div>
            )}

            {/* Previews */}
            <div className="mt-4 space-y-2">
                {previews.map((file, index) => (
                    <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-xl"
                    >
                        <div className="flex items-center gap-3">
                            <img
                                src={file.url}
                                className="w-12 h-12 rounded-lg object-cover border"
                                alt="preview"
                            />
                            <div className="overflow-hidden">
                                <p className="text-sm font-semibold text-slate-700 truncate max-w-[200px]">
                                    {file.name}
                                </p>
                                <p className="text-xs text-slate-400 font-mono">
                                    {file.size}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle2
                                size={18}
                                className="text-green-500"
                            />
                            <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="p-1.5 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-500 transition-all"
                            >
                                <X size={18} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FileUpload;

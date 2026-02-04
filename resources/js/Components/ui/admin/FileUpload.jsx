import React, { useState, useEffect } from "react";
import { Upload, X, CheckCircle2, AlertCircle } from "lucide-react";

const FileUpload = ({
    data,
    setData,
    errors,
    clearErrors,
    field = "image",
    label = "Product Image",
    multiple = false,
}) => {
    const [previews, setPreviews] = useState([]);
    const [isDragging, setIsDragging] = useState(false);

    useEffect(() => {
        if (data[field] && typeof data[field] === "string" && previews.length === 0) {
            const imageUrl = data[field].startsWith("http") || data[field].startsWith("/") 
                ? data[field] 
                : `/${data[field]}`;
                
            setPreviews([
                {
                    url: imageUrl,
                    name: "Existing Image",
                    size: "Saved",
                    isServerFile: true,
                },
            ]);
        }
    }, [data[field]]);

    useEffect(() => {
        return () => previews.forEach((p) => {
            if (!p.isServerFile) URL.revokeObjectURL(p.url);
        });
    }, [previews]);

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        processFiles(files);
    };

    const processFiles = (files) => {
        if (files.length === 0) return;

        if (errors[field]) {
            clearErrors(field);
        }

        const newPreviews = files.map((file) => ({
            url: URL.createObjectURL(file),
            name: file.name,
            size: (file.size / (1024 * 1024)).toFixed(2) + " MB",
        }));

        if (multiple) {
            const currentFiles = data[field] || [];
            setData(field, [...currentFiles, ...files]);
            setPreviews((prev) => [...prev, ...newPreviews]);
        } else {
            setData(field, files[0]);
            setPreviews([newPreviews[0]]);
        }
    };

    const removeImage = (index) => {
        if (multiple) {
            const updatedFiles = Array.from(data[field]).filter(
                (_, i) => i !== index,
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
                <div className="flex items-center justify-between mb-2">
                    <label className="text-[13px] font-bold text-slate-700 uppercase tracking-wider">
                        {label}
                    </label>
                    <span className="text-[11px] font-medium text-slate-400">
                        {multiple
                            ? "Multiple files allowed"
                            : "Single file only"}
                    </span>
                </div>
            )}

            <div
                onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    processFiles(Array.from(e.dataTransfer.files));
                }}
                className={`relative group border-2 border-dashed rounded-2xl p-3 transition-all duration-300
                ${
                    isDragging
                        ? "border-orange-500 bg-orange-50/50 scale-[1.01]"
                        : errors[field]
                          ? "border-red-300 bg-red-50/30"
                          : "border-slate-200 bg-slate-50/30 hover:bg-white hover:border-orange-400 hover:shadow-xl hover:shadow-orange-500/5"
                }
                `}
            >
                <input
                    type="file"
                    multiple={multiple}
                    accept="image/*"
                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                    onChange={handleFileChange}
                />

                <div className="flex flex-col items-center justify-center py-1">
                    <div
                        className={`mb-2 p-2 rounded-xl transition-all duration-500
                        ${isDragging ? "bg-orange-500 text-white rotate-12" : "bg-white text-orange-600 shadow-sm group-hover:shadow-orange-200 group-hover:-translate-y-1"}
                    `}
                    >
                        <Upload size={20} strokeWidth={2.5} />
                    </div>

                    <p className="text-[13px] font-bold text-slate-800">
                        Drag & Drop or{" "}
                        <span className="text-orange-600">Browse</span>
                    </p>
                    <p className="text-[10px] font-medium text-slate-400 mt-1 flex items-center gap-2">
                        <span>PNG, JPG, WEBP up to 20MB</span>
                    </p>
                </div>
            </div>

            {errors[field] && (
                <div className="flex items-center gap-2 mt-3 text-red-600 font-bold text-[11px] bg-red-50 px-3 py-2 rounded-xl border border-red-100 uppercase tracking-wide">
                    <AlertCircle size={14} />
                    <span>{errors[field]}</span>
                </div>
            )}

            {/* Previews */}
            {previews.length > 0 && (
                <div className="mt-3 grid grid-cols-2 lg:grid-cols-4 gap-2">
                    {previews.map((file, index) => (
                        <div
                            key={index}
                            className="relative group/card bg-white border border-slate-100 rounded-xl p-1.5 shadow-sm hover:shadow-md transition-all animate-in zoom-in-95 duration-200"
                        >
                            <div className="relative aspect-square rounded-lg overflow-hidden border border-slate-50">
                                <img
                                    src={file.url}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-110"
                                    alt="preview"
                                />
                                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/card:opacity-100 transition-opacity flex items-center justify-center">
                                    <button
                                        type="button"
                                        onClick={() => removeImage(index)}
                                        className="bg-white/90 p-2 rounded-full text-red-500 hover:bg-red-500 hover:text-white transition-all transform hover:scale-110"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            </div>

                            <div className="mt-2 px-1">
                                <p className="text-[11px] font-bold text-slate-700 truncate">
                                    {file.name}
                                </p>
                                <div className="flex items-center justify-between mt-0.5">
                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">
                                        {file.size}
                                    </span>
                                    <CheckCircle2
                                        size={12}
                                        className="text-green-500"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default FileUpload;

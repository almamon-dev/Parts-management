import React, { useState } from "react";
import { useForm } from "@inertiajs/react";
import { X, Upload, ArrowUpRight } from "lucide-react";

export default function ReturnRequestModal({ isOpen, onClose, orders }) {
    if (!isOpen) return null;

    const { data, setData, post, processing, errors, reset } = useForm({
        order_id: "",
        reason: "",
        description: "",
        image: null,
    });

    const [imagePreview, setImagePreview] = useState(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData("image", file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const submit = (e) => {
        e.preventDefault();
        post(route("orders.return.request"), {
            forceFormData: true,
            onSuccess: () => {
                reset();
                setImagePreview(null);
                onClose();
            },
        });
    };

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-[2px] p-4 transition-all duration-300">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-in zoom-in duration-300">
                <div className="p-6 flex justify-between items-center border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="bg-red-50 p-2 rounded-lg">
                            <Upload className="w-5 h-5 text-red-600" />
                        </div>
                        <h2 className="text-xl font-bold text-slate-800">
                            New Return Request
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={submit} className="p-6 space-y-5">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">
                            Order ID
                        </label>

                        <input
                            type="text"
                            value={data.order_id}
                            onChange={(e) =>
                                setData("order_id", e.target.value)
                            }
                            className="w-full border-gray-200 rounded-sm focus:ring-red-500 focus:border-red-500 text-sm  font-medium"
                        />
                        {errors.order_id && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.order_id}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">
                            Return Reason
                        </label>
                        <select
                            value={data.reason}
                            onChange={(e) => setData("reason", e.target.value)}
                            className="w-full border-gray-200 rounded-sm  text-sm font-medium"
                        >
                            <option value="">Select Reason</option>
                            <option value="Wrong part received">
                                Wrong part received
                            </option>
                            <option value="Damaged during shipping">
                                Damaged during shipping
                            </option>
                            <option value="Defective item">
                                Defective item
                            </option>
                            <option value="No longer needed">
                                No longer needed
                            </option>
                        </select>
                        {errors.reason && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.reason}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">
                            Description
                        </label>
                        <textarea
                            rows="4"
                            value={data.description}
                            onChange={(e) =>
                                setData("description", e.target.value)
                            }
                            placeholder="Please provide details about your return..."
                            className="w-full border-gray-200 rounded-sm focus:ring-red-500 focus:border-red-500 text-sm placeholder:text-gray-300"
                        ></textarea>
                    </div>

                    <div className="relative border-2 border-dashed border-gray-200 rounded-sm p-6 hover:bg-gray-50 transition-colors group">
                        <input
                            type="file"
                            onChange={handleFileChange}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <div className="text-center">
                            {imagePreview ? (
                                <img
                                    src={imagePreview}
                                    className="mx-auto h-24 w-auto rounded-lg shadow-sm"
                                    alt="Preview"
                                />
                            ) : (
                                <>
                                    <div className="bg-orange-400 w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2">
                                        <Upload className="w-5 h-5 text-white" />
                                    </div>
                                    <p className="text-xs text-gray-500">
                                        Drag and drop or{" "}
                                        <span className="text-orange-500 font-bold">
                                            browse files
                                        </span>
                                    </p>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="flex gap-4 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-3 border border-gray-200 rounded-full font-bold text-gray-600 hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="flex-1 px-6 py-3 bg-red-700 text-white rounded-full font-bold flex items-center justify-center gap-2 hover:bg-red-800 transition-all disabled:opacity-50"
                        >
                            {processing ? "Submitting..." : "Submit Request"}
                            {!processing && (
                                <ArrowUpRight className="w-4 h-4" />
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

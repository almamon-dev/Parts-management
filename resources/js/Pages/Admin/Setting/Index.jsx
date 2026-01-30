import React, { useState } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, useForm } from "@inertiajs/react";
import { Save, Image as ImageIcon, Globe, Mail, Phone, MapPin } from "lucide-react";
import { Input } from "@/Components/ui/admin/input";

export default function Index({ settings }) {
    const { data, setData, post, processing, errors } = useForm({
        site_name: settings.site_name || "",
        site_logo: null,
        site_favicon: null,
        contact_email: settings.contact_email || "",
        contact_phone: settings.contact_phone || "",
        address: settings.address || "",
    });

    const [logoPreview, setLogoPreview] = useState(settings.site_logo ? `/${settings.site_logo}` : null);
    const [faviconPreview, setFaviconPreview] = useState(settings.site_favicon ? `/${settings.site_favicon}` : null);

    const handleFileChange = (e, field) => {
        const file = e.target.files[0];
        if (file) {
            setData(field, file);
            const reader = new FileReader();
            reader.onloadend = () => {
                if (field === 'site_logo') setLogoPreview(reader.result);
                if (field === 'site_favicon') setFaviconPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("admin.settings.update"), {
            forceFormData: true,
            preserveScroll: true,
        });
    };

    return (
        <AdminLayout>
            <Head title="Site Settings" />
            
            <div className="p-6 bg-slate-50/50 min-h-screen">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        <Globe size={24} className="text-[#FF9F43]" />
                        <span>General Settings</span>
                    </h1>
                    <p className="text-slate-500 text-sm mt-1">Manage your website's branding and contact information.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
                    {/* Branding Section */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 border-b pb-4">
                            <ImageIcon size={20} className="text-[#FF9F43]" />
                            Branding & Identity
                        </h2>
                        
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Input
                                    label="Site Name"
                                    value={data.site_name}
                                    onChange={(e) => setData("site_name", e.target.value)}
                                    error={errors.site_name}
                                    placeholder="Enter Site Name"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Logo Upload */}
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-3">Site Logo</label>
                                    <div className="flex items-start gap-4">
                                        <div className="w-40 h-24 bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl overflow-hidden flex items-center justify-center relative group">
                                            {logoPreview ? (
                                                <img src={logoPreview} alt="Logo" className="w-full h-full object-contain p-2" />
                                            ) : (
                                                <ImageIcon size={32} className="text-slate-300" />
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => handleFileChange(e, 'site_logo')}
                                                className="hidden"
                                                id="logo-upload"
                                            />
                                            <label
                                                htmlFor="logo-upload"
                                                className="inline-flex items-center px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-bold hover:bg-slate-200 cursor-pointer transition-colors"
                                            >
                                                Change Logo
                                            </label>
                                            <p className="text-[11px] text-slate-400 mt-2 italic">Recommended size: 200x80px. Max 2MB.</p>
                                            {errors.site_logo && <p className="text-red-500 text-xs mt-1">{errors.site_logo}</p>}
                                        </div>
                                    </div>
                                </div>

                                {/* Favicon Upload */}
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-3">Favicon</label>
                                    <div className="flex items-start gap-4">
                                        <div className="w-16 h-16 bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl overflow-hidden flex items-center justify-center relative">
                                            {faviconPreview ? (
                                                <img src={faviconPreview} alt="Favicon" className="w-8 h-8 object-contain" />
                                            ) : (
                                                <ImageIcon size={20} className="text-slate-300" />
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <input
                                                type="file"
                                                accept="image/x-icon,image/png"
                                                onChange={(e) => handleFileChange(e, 'site_favicon')}
                                                className="hidden"
                                                id="favicon-upload"
                                            />
                                            <label
                                                htmlFor="favicon-upload"
                                                className="inline-flex items-center px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-bold hover:bg-slate-200 cursor-pointer transition-colors"
                                            >
                                                Change Favicon
                                            </label>
                                            <p className="text-[11px] text-slate-400 mt-2 italic">Size: 32x32px or 64x64px. ICO or PNG.</p>
                                            {errors.site_favicon && <p className="text-red-500 text-xs mt-1">{errors.site_favicon}</p>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Information */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 border-b pb-4">
                            <Mail size={20} className="text-[#FF9F43]" />
                            Contact Information
                        </h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input
                                label="Contact Email"
                                type="email"
                                value={data.contact_email}
                                onChange={(e) => setData("contact_email", e.target.value)}
                                error={errors.contact_email}
                                icon={<Mail size={16} />}
                                placeholder="support@example.com"
                            />
                            <Input
                                label="Contact Phone"
                                value={data.contact_phone}
                                onChange={(e) => setData("contact_phone", e.target.value)}
                                error={errors.contact_phone}
                                icon={<Phone size={16} />}
                                placeholder="+1 (234) 567-890"
                            />
                            <div className="md:col-span-2">
                                <Input
                                    label="Business Address"
                                    isTextArea
                                    value={data.address}
                                    onChange={(e) => setData("address", e.target.value)}
                                    error={errors.address}
                                    icon={<MapPin size={16} />}
                                    placeholder="123 Street, City, Country"
                                    className="min-h-[80px]"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end pt-4">
                        <button
                            type="submit"
                            disabled={processing}
                            className="bg-[#FF9F43] text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-[#e68a30] transition-all shadow-lg shadow-orange-100 disabled:opacity-50 active:scale-95"
                        >
                            <Save size={20} />
                            {processing ? "Saving Changes..." : "Save Configuration"}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}

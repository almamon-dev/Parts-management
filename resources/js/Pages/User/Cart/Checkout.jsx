import React, { useState } from "react";
import UserLayout from "@/Layouts/UserLayout";
import { Head, usePage, router, Link } from "@inertiajs/react";
import {
    ChevronLeft,
    AlertCircle,
    Info,
    Clock,
    Truck,
    FileText,
} from "lucide-react";
import { toast } from "react-hot-toast";

export default function Checkout() {
    const { auth, cart, userAddresses, user, errors } = usePage().props;
    const {
        items: cartItems,
        subtotal,
        tax,
        tax_label,
        total,
    } = cart || { items: [], subtotal: 0, tax: 0, tax_label: "Tax", total: 0 };

    const [processing, setProcessing] = useState(false);
    const [deliveryType, setDeliveryType] = useState("store_pickup");
    const [addressOption, setAddressOption] = useState("my_address");
    const [selectedAddressId, setSelectedAddressId] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("");
    const [validationErrors, setValidationErrors] = useState({});

    // Merge backend errors with frontend validation errors
    const allErrors = { ...validationErrors, ...errors };

    const [formData, setFormData] = useState({
        notes: "",
        po_number: "",
        shop_name: "",
        manager_name: "",
        contact_number: "",
        street_address: "",
        city: "",
        province: "",
        post_code: "",
        address_type: "Business",
        save_to_address_book: false,
    });

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleAddressSelect = (e) => {
        const addrId = e.target.value;
        setSelectedAddressId(addrId);
        if (addrId) {
            const addr = userAddresses.find((a) => a.id.toString() === addrId);
            if (addr) {
                setFormData((prev) => ({
                    ...prev,
                    shop_name: addr.shop_name || "",
                    manager_name: addr.manager_name || "",
                    contact_number: addr.contact_number || "",
                    street_address: addr.street_address || "",
                    city: addr.city || "",
                    province: addr.province || "",
                    post_code: addr.post_code || "",
                }));
            }
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Submit clicked", {
            deliveryType,
            paymentMethod,
            addressOption,
        });

        // Clear previous validation errors
        setValidationErrors({});
        const newErrors = {};

        // Validation: Payment Method
        if (!paymentMethod) {
            newErrors.payment_method = "Please select a payment method";
        }

        // Validation: Delivery Type
        if (!deliveryType) {
            newErrors.delivery_type = "Please select a delivery method";
        }

        // Validation for Delivery and Ship options
        if (deliveryType === "deliver_it" || deliveryType === "ship_it") {
            if (!addressOption) {
                toast.error("Please select an address option");
                return;
            }

            // Validation for "New Address" option
            if (addressOption === "different_address") {
                const requiredFields = {
                    shop_name: "Company Name",
                    contact_number: "Phone Number",
                    manager_name: "Contact Person",
                    street_address: "Street Address",
                    province: "Province",
                    city: "City",
                    post_code: "Postal Code",
                };

                for (const [field, label] of Object.entries(requiredFields)) {
                    if (!formData[field] || formData[field].trim() === "") {
                        newErrors[field] = `${label} is required`;
                    }
                }

                // Validate phone number format (basic)
                if (
                    formData.contact_number &&
                    formData.contact_number.trim() !== ""
                ) {
                    const phoneRegex = /^[\d\s\-\(\)]+$/;
                    if (!phoneRegex.test(formData.contact_number)) {
                        newErrors.contact_number =
                            "Please enter a valid phone number";
                    }
                }
            }
        }

        // Validate PO Number (optional but has max length)
        if (formData.po_number && formData.po_number.length > 15) {
            newErrors.po_number = "PO number cannot exceed 15 characters";
        }

        // Validate Notes length
        if (formData.notes && formData.notes.length > 100) {
            newErrors.notes = "Notes cannot exceed 100 characters";
        }

        // If there are validation errors, set them and stop submission
        if (Object.keys(newErrors).length > 0) {
            setValidationErrors(newErrors);
            toast.error("Please fix the errors below");
            return;
        }

        setProcessing(true);

        let shipping_address = "";
        let order_type = "Pick up";

        if (deliveryType === "store_pickup") {
            shipping_address =
                `${user.company_name || ""} ${user.address || ""}`.trim() ||
                "Store Pick Up";
            order_type = "Pick up";
        } else if (deliveryType === "deliver_it") {
            order_type = "Delivery";
            if (addressOption === "my_address") {
                shipping_address = user.address || "Default Address";
            } else {
                shipping_address = `${formData.shop_name}, ${formData.manager_name}, ${formData.contact_number}, ${formData.street_address}, ${formData.city}, ${formData.province}, ${formData.post_code}`;
            }
        } else if (deliveryType === "ship_it") {
            order_type = "Ship";
            if (addressOption === "my_address") {
                shipping_address = user.address || "Default Address";
            } else {
                shipping_address = `${formData.shop_name}, ${formData.manager_name}, ${formData.contact_number}, ${formData.street_address}, ${formData.city}, ${formData.province}, ${formData.post_code}`;
            }
        }

        // Prepare data to send
        const dataToSend = {
            notes: formData.notes,
            po_number: formData.po_number,
            delivery_type: deliveryType,
            shipping_address: shipping_address,
            billing_address:
                `${user.company_name || ""} ${user.address || ""}`.trim(),
            order_type: order_type,
            payment_method: paymentMethod,
            address_option: addressOption,
            address_type: formData.address_type,
        };

        // Only include address fields if delivery or ship different address is selected
        if (deliveryType === "deliver_it" || deliveryType === "ship_it") {
            if (addressOption === "different_address") {
                dataToSend.shop_name = formData.shop_name;
                dataToSend.manager_name = formData.manager_name;
                dataToSend.contact_number = formData.contact_number;
                dataToSend.street_address = formData.street_address;
                dataToSend.city = formData.city;
                dataToSend.province = formData.province;
                dataToSend.post_code = formData.post_code;
                dataToSend.address_type = formData.address_type;
                dataToSend.save_to_address_book = formData.save_to_address_book;
            }
        }

        router.post(route("checkout.process"), dataToSend, {
            onFinish: () => setProcessing(false),
            onError: (errors) => {
                Object.values(errors).forEach((err) => toast.error(err));
            },
        });
    };

    const charsLeft = formData.notes?.length || 0;

    return (
        <>
            <Head title="Checkout" />

            <div className="bg-[#F8FAFC] min-h-screen pb-12">
                <div className="max-w-4xl mx-auto px-4 py-4">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <Link
                                href={route("carts.index")}
                                className="w-8 h-8 rounded-full bg-white border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors shadow-sm"
                            >
                                <ChevronLeft size={16} />
                            </Link>
                            <div>
                                <h1 className="text-xl font-bold text-gray-900">
                                    Checkout
                                </h1>
                                <p className="text-gray-500 text-[11px]">
                                    Review your order and select delivery
                                </p>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-3">
                        {/* Important Notice */}
                        <div className="bg-red-50/50 border-l-4 border-red-200 p-3 rounded-r-xl">
                            <div className="space-y-1 text-[11px] leading-relaxed italic text-[#b54a4a] font-medium">
                                <p>
                                    Pickup: Please allow a minimum of 1 hour to
                                    process before coming to pickup your order.
                                </p>
                                <p>
                                    This order will take an extra day to ship
                                    because it is coming from our other
                                    warehouse.
                                </p>
                                <p>We do not deliver to residential address.</p>
                            </div>
                        </div>

                        {/* Section 1: Delivery Method */}
                        <section className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                            <div className="p-4 border-b border-gray-100 bg-gray-50 uppercase text-xs font-bold text-gray-800">
                                1. Delivery Type
                            </div>

                            <div className="p-4 space-y-3">
                                <div>
                                    <label className="text-[11px] font-semibold text-gray-700 mb-1 block uppercase">
                                        Select Delivery Type
                                    </label>
                                    <select
                                        value={deliveryType}
                                        onChange={(e) =>
                                            setDeliveryType(e.target.value)
                                        }
                                        className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm focus:ring-1 focus:ring-blue-400 focus:border-blue-400"
                                    >
                                        <option value="store_pickup">
                                            Store Pick Up - Free
                                        </option>
                                        <option value="deliver_it">
                                            Deliver it - Free
                                        </option>
                                        <option value="ship_it">
                                            Ship it - Customer Pays For Shipping
                                        </option>
                                    </select>
                                </div>

                                {/* Conditional Address Options */}
                                {(deliveryType === "deliver_it" ||
                                    deliveryType === "ship_it") && (
                                    <div className="space-y-3 pt-3 border-t border-gray-100">
                                        <div className="flex flex-col md:flex-row gap-3">
                                            <label
                                                onClick={() =>
                                                    setAddressOption(
                                                        "my_address",
                                                    )
                                                }
                                                className={`flex-1 cursor-pointer p-3 rounded border-2 transition-all flex items-center gap-3 ${addressOption === "my_address" ? "border-red-600 bg-red-50" : "border-gray-200 hover:border-gray-300"}`}
                                            >
                                                <input
                                                    type="radio"
                                                    checked={
                                                        addressOption ===
                                                        "my_address"
                                                    }
                                                    onChange={() => {}}
                                                    className="text-red-600 focus:ring-red-500"
                                                />
                                                <div className="font-semibold text-xs">
                                                    {deliveryType ===
                                                    "deliver_it"
                                                        ? "Deliver to my Address"
                                                        : "Ship it to My Address"}
                                                </div>
                                            </label>
                                            <label
                                                onClick={() =>
                                                    setAddressOption(
                                                        "different_address",
                                                    )
                                                }
                                                className={`flex-1 cursor-pointer p-3 rounded border-2 transition-all flex items-center gap-3 ${addressOption === "different_address" ? "border-red-600 bg-red-50" : "border-gray-200 hover:border-gray-300"}`}
                                            >
                                                <input
                                                    type="radio"
                                                    checked={
                                                        addressOption ===
                                                        "different_address"
                                                    }
                                                    onChange={() => {}}
                                                    className="text-red-600 focus:ring-red-500"
                                                />
                                                <div className="font-semibold text-xs">
                                                    {deliveryType ===
                                                    "deliver_it"
                                                        ? "Deliver it to different address"
                                                        : "Ship it to different address"}
                                                </div>
                                            </label>
                                        </div>

                                        {addressOption === "my_address" && (
                                            <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 mb-4">
                                                <p className="text-xs font-bold text-gray-500 uppercase mb-2">
                                                    Your Address on File:
                                                </p>
                                                <p className="text-sm font-medium text-gray-800">
                                                    {user.address ||
                                                        "No address on file. Please provide a different address."}
                                                </p>
                                            </div>
                                        )}

                                        {/* Address Type Selection */}
                                        <div className="pt-4 border-t border-gray-100">
                                            <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider mb-3 block">
                                                Confirm Address Type
                                            </label>
                                            <div className="flex gap-6">
                                                <label className="flex items-center gap-2 cursor-pointer group">
                                                    <input
                                                        type="radio"
                                                        name="address_type"
                                                        value="Business"
                                                        checked={
                                                            formData.address_type ===
                                                            "Business"
                                                        }
                                                        onChange={
                                                            handleInputChange
                                                        }
                                                        className="w-4 h-4 text-red-600 focus:ring-red-500 border-gray-300"
                                                    />
                                                    <span
                                                        className={`text-sm font-bold ${formData.address_type === "Business" ? "text-red-600" : "text-slate-600 group-hover:text-slate-900"}`}
                                                    >
                                                        Business Address
                                                    </span>
                                                </label>
                                                <label className="flex items-center gap-2 cursor-pointer group">
                                                    <input
                                                        type="radio"
                                                        name="address_type"
                                                        value="Residential"
                                                        checked={
                                                            formData.address_type ===
                                                            "Residential"
                                                        }
                                                        onChange={
                                                            handleInputChange
                                                        }
                                                        className="w-4 h-4 text-red-600 focus:ring-red-500 border-gray-300"
                                                    />
                                                    <span
                                                        className={`text-sm font-bold ${formData.address_type === "Residential" ? "text-red-600" : "text-slate-600 group-hover:text-slate-900"}`}
                                                    >
                                                        Residential Address
                                                    </span>
                                                </label>
                                            </div>
                                            {formData.address_type ===
                                                "Residential" && (
                                                <p className="mt-2 text-[10px] text-red-500 font-bold italic">
                                                    * Note: Delivery to
                                                    residential addresses may
                                                    involve additional handling
                                                    or restrictions.
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* Section 2: Different Address Details */}
                        {(deliveryType === "deliver_it" ||
                            deliveryType === "ship_it") &&
                            addressOption === "different_address" && (
                                <section className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                                    <div className="p-4 border-b border-gray-100 bg-gray-50 font-bold uppercase text-xs text-gray-800">
                                        2. Different Address Details
                                    </div>

                                    <div className="p-4 space-y-4">
                                        {/* Address Book Selector */}
                                        {userAddresses &&
                                            userAddresses.length > 0 && (
                                                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <div className="w-7 h-7 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400">
                                                            <FileText
                                                                size={14}
                                                            />
                                                        </div>
                                                        <label className="text-[10px] font-bold text-slate-800 uppercase tracking-tight">
                                                            Quick Select from
                                                            Address Book
                                                        </label>
                                                    </div>
                                                    <select
                                                        value={
                                                            selectedAddressId
                                                        }
                                                        onChange={
                                                            handleAddressSelect
                                                        }
                                                        className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-700 outline-none focus:ring-2 focus:ring-red-500/10 focus:border-red-500 transition-all shadow-sm"
                                                    >
                                                        <option value="">
                                                            - Select a saved
                                                            address -
                                                        </option>
                                                        {userAddresses.map(
                                                            (addr) => (
                                                                <option
                                                                    key={
                                                                        addr.id
                                                                    }
                                                                    value={
                                                                        addr.id
                                                                    }
                                                                >
                                                                    {
                                                                        addr.shop_name
                                                                    }{" "}
                                                                    -{" "}
                                                                    {
                                                                        addr.street_address
                                                                    }
                                                                    ,{" "}
                                                                    {addr.city}
                                                                </option>
                                                            ),
                                                        )}
                                                    </select>
                                                    <p className="mt-2 text-[10px] text-slate-400 font-medium italic">
                                                        * Selecting a saved
                                                        address will auto-fill
                                                        the form below.
                                                    </p>
                                                </div>
                                            )}

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 leading-tight">
                                            {/* Column 1: Contact Personnel */}
                                            <div className="space-y-3">
                                                <h3 className="text-[11px] font-black text-red-600 border-b pb-0.5 uppercase tracking-wider">
                                                    Contact Information
                                                </h3>

                                                <div className="space-y-3 pt-1">
                                                    <div>
                                                        <label className="text-xs text-gray-700 mb-1 block">
                                                            Shop Name
                                                        </label>
                                                        <input
                                                            type="text"
                                                            name="shop_name"
                                                            value={
                                                                formData.shop_name
                                                            }
                                                            onChange={
                                                                handleInputChange
                                                            }
                                                            className={`w-full border rounded px-3 py-1.5 text-sm focus:ring-1 focus:ring-blue-400 focus:border-blue-400 ${allErrors.shop_name ? "border-red-500" : "border-gray-300"}`}
                                                        />
                                                        {allErrors.shop_name && (
                                                            <p className="text-red-500 text-[10px] mt-1 font-bold ml-1">
                                                                {
                                                                    allErrors.shop_name
                                                                }
                                                            </p>
                                                        )}
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                        <div>
                                                            <label className="text-xs text-gray-700 mb-1 block">
                                                                Manager Name
                                                            </label>
                                                            <input
                                                                type="text"
                                                                name="manager_name"
                                                                value={
                                                                    formData.manager_name
                                                                }
                                                                onChange={
                                                                    handleInputChange
                                                                }
                                                                className={`w-full border rounded px-3 py-1.5 text-sm focus:ring-1 focus:ring-blue-400 focus:border-blue-400 ${allErrors.manager_name ? "border-red-500" : "border-gray-300"}`}
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="text-xs text-gray-700 mb-1 block">
                                                                Contact Number
                                                            </label>
                                                            <input
                                                                type="text"
                                                                name="contact_number"
                                                                value={
                                                                    formData.contact_number
                                                                }
                                                                onChange={
                                                                    handleInputChange
                                                                }
                                                                className={`w-full border rounded px-3 py-1.5 text-sm focus:ring-1 focus:ring-blue-400 focus:border-blue-400 ${allErrors.contact_number ? "border-red-500" : "border-gray-300"}`}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Column 2: Physical Address */}
                                            <div className="space-y-3">
                                                <h3 className="text-[11px] font-black text-red-600 border-b pb-0.5 uppercase tracking-wider">
                                                    Address Details
                                                </h3>

                                                <div className="space-y-3 pt-1">
                                                    <div>
                                                        <label className="text-xs text-gray-700 mb-1 block">
                                                            Street Address
                                                        </label>
                                                        <input
                                                            type="text"
                                                            name="street_address"
                                                            value={
                                                                formData.street_address
                                                            }
                                                            onChange={
                                                                handleInputChange
                                                            }
                                                            className={`w-full border rounded px-3 py-1.5 text-sm focus:ring-1 focus:ring-blue-400 focus:border-blue-400 ${allErrors.street_address ? "border-red-500" : "border-gray-300"}`}
                                                        />
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-3">
                                                        <div>
                                                            <label className="text-xs text-gray-700 mb-1 block">
                                                                City
                                                            </label>
                                                            <input
                                                                type="text"
                                                                name="city"
                                                                value={
                                                                    formData.city
                                                                }
                                                                onChange={
                                                                    handleInputChange
                                                                }
                                                                className={`w-full border rounded px-3 py-1.5 text-sm focus:ring-1 focus:ring-blue-400 focus:border-blue-400 ${allErrors.city ? "border-red-500" : "border-gray-300"}`}
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="text-xs text-gray-700 mb-1 block">
                                                                Province
                                                            </label>
                                                            <select
                                                                name="province"
                                                                value={
                                                                    formData.province
                                                                }
                                                                onChange={
                                                                    handleInputChange
                                                                }
                                                                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-1 focus:ring-blue-400 focus:border-blue-400"
                                                            >
                                                                <option value="">
                                                                    Select
                                                                </option>
                                                                <option value="ON">
                                                                    Ontario (ON)
                                                                </option>
                                                                <option value="QC">
                                                                    Quebec (QC)
                                                                </option>
                                                                <option value="BC">
                                                                    British
                                                                    Columbia
                                                                    (BC)
                                                                </option>
                                                                <option value="AB">
                                                                    Alberta (AB)
                                                                </option>
                                                                <option value="MB">
                                                                    Manitoba
                                                                    (MB)
                                                                </option>
                                                                <option value="SK">
                                                                    Saskatchewan
                                                                    (SK)
                                                                </option>
                                                            </select>
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <label className="text-xs text-gray-700 mb-1 block">
                                                            Post Code
                                                        </label>
                                                        <input
                                                            type="text"
                                                            name="post_code"
                                                            value={
                                                                formData.post_code
                                                            }
                                                            onChange={
                                                                handleInputChange
                                                            }
                                                            className={`w-full border rounded px-3 py-2 text-sm focus:ring-1 focus:ring-blue-400 focus:border-blue-400 ${allErrors.post_code ? "border-red-500" : "border-gray-300"}`}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="pt-4 mt-4 border-t text-sm font-semibold text-gray-700">
                                            <label className="flex items-center gap-2 cursor-pointer text-red-600">
                                                <input
                                                    type="checkbox"
                                                    checked={
                                                        formData.save_to_address_book
                                                    }
                                                    onChange={(e) =>
                                                        setFormData((prev) => ({
                                                            ...prev,
                                                            save_to_address_book:
                                                                e.target
                                                                    .checked,
                                                        }))
                                                    }
                                                    className="rounded text-red-600 focus:ring-red-500"
                                                />
                                                Save it to the Address book
                                            </label>
                                        </div>
                                    </div>
                                </section>
                            )}

                        {/* Section 3: Payment */}
                        <section className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                            <div className="p-4 border-b border-gray-100 bg-gray-50 uppercase text-xs font-bold text-gray-800">
                                {deliveryType === "store_pickup" ? "2" : "3"}.
                                Payment & Additional Info
                            </div>

                            <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <div>
                                        <label className="text-xs font-semibold text-gray-700 mb-1 block">
                                            Payment Method
                                        </label>
                                        <select
                                            value={paymentMethod}
                                            onChange={(e) =>
                                                setPaymentMethod(e.target.value)
                                            }
                                            className={`w-full border rounded px-3 py-1.5 text-sm focus:ring-1 focus:ring-blue-400 focus:border-blue-400 ${allErrors.payment_method ? "border-red-500" : "border-gray-300"}`}
                                        >
                                            <option value="">
                                                -Select Payment Type-
                                            </option>
                                            <option value="credit_card">
                                                Credit Card
                                            </option>
                                            <option value="debit_card">
                                                Debit Card
                                            </option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="text-xs font-semibold text-gray-700 mb-1 block">
                                            P.O. Number (Optional)
                                        </label>
                                        <input
                                            type="text"
                                            name="po_number"
                                            maxLength={15}
                                            value={formData.po_number || ""}
                                            onChange={handleInputChange}
                                            placeholder="Max 15 characters"
                                            className={`w-full border rounded px-3 py-1.5 text-sm focus:ring-1 focus:ring-blue-400 focus:border-blue-400 ${allErrors.po_number ? "border-red-500" : "border-gray-300"}`}
                                        />
                                        {allErrors.po_number && (
                                            <p className="text-red-500 text-[10px] mt-1 font-bold">
                                                {allErrors.po_number}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="relative">
                                        <div className="flex items-center gap-2 mb-1.5">
                                            <FileText
                                                size={16}
                                                className="text-gray-400"
                                            />
                                            <label className="text-xs font-bold text-gray-800 uppercase tracking-tight">
                                                Notes / Instructions
                                                <span className="ml-1 text-[9px] text-gray-400 font-medium normal-case">
                                                    (Optional)
                                                </span>
                                            </label>
                                        </div>
                                        <textarea
                                            name="notes"
                                            maxLength={100}
                                            value={formData.notes || ""}
                                            onChange={handleInputChange}
                                            rows={2}
                                            placeholder="Add any special instructions..."
                                            className={`w-full border rounded-sm px-3 py-2 text-xs focus:ring-2 focus:ring-red-100 focus:border-red-500 transition-all resize-none placeholder:text-gray-300 ${allErrors.notes ? "border-red-500" : "border-gray-200"}`}
                                        />
                                        <div className="absolute top-2 right-3">
                                            <span
                                                className={`text-[10px] font-bold px-2 py-1 rounded-full ${formData.notes?.length >= 90 ? "bg-red-50 text-red-600" : "bg-gray-50 text-gray-400"}`}
                                            >
                                                {formData.notes?.length || 0}
                                                /100
                                            </span>
                                        </div>
                                    </div>

                                    {/* Premium Info Box for Shipping Notes */}
                                    <div className="bg-blue-50/50 rounded-xl border border-blue-100 p-4 space-y-3">
                                        <div className="flex items-start gap-3">
                                            <div className="mt-0.5 p-1.5 bg-blue-100 rounded-lg text-blue-600">
                                                <Info size={14} />
                                            </div>
                                            <div className="space-y-3">
                                                <div className="flex items-start gap-2">
                                                    <Clock
                                                        size={12}
                                                        className="text-blue-500 mt-0.5 flex-shrink-0"
                                                    />
                                                    <p className="text-[11px] leading-relaxed text-blue-800/80 font-medium uppercase tracking-wide italic">
                                                        - Please allow{" "}
                                                        <span className="text-blue-900 font-bold underline">
                                                            1 additional day
                                                        </span>{" "}
                                                        for delivery if part is
                                                        coming from another
                                                        Ontario branch.
                                                    </p>
                                                </div>
                                                <div className="flex items-start gap-2">
                                                    <Clock
                                                        size={12}
                                                        className="text-blue-500 mt-0.5 flex-shrink-0"
                                                    />
                                                    <p className="text-[11px] leading-relaxed text-blue-800/80 font-medium uppercase tracking-wide italic">
                                                        - Please allow{" "}
                                                        <span className="text-blue-900 font-bold underline">
                                                            7 days
                                                        </span>{" "}
                                                        for delivery if part is
                                                        coming from another
                                                        branch located in a
                                                        different province.
                                                    </p>
                                                </div>
                                                <div className="flex items-start gap-2">
                                                    <Truck
                                                        size={12}
                                                        className="text-blue-500 mt-0.5 flex-shrink-0"
                                                    />
                                                    <p className="text-[11px] leading-relaxed text-blue-800/80 font-medium uppercase tracking-wide italic">
                                                        - Shipping charges are
                                                        additional and you will
                                                        get quote once you place
                                                        your order with your
                                                        shipping address.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {allErrors.notes && (
                                        <p className="text-red-500 text-xs mt-1 font-bold flex items-center gap-1">
                                            <AlertCircle size={12} />{" "}
                                            {allErrors.notes}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </section>

                        {/* Summary & Submit */}
                        <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="flex-1 space-y-2">
                                <div className="flex items-center justify-between max-w-[200px] text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                    <span>Subtotal</span>
                                    <span>${Number(subtotal).toFixed(2)}</span>
                                </div>
                                <div className="flex items-center justify-between max-w-[200px] text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b pb-2">
                                    <span>Tax ({tax_label})</span>
                                    <span>${Number(tax).toFixed(2)}</span>
                                </div>
                                <div>
                                    <span className="text-xs text-gray-500 uppercase font-bold tracking-wider">
                                        Estimated Total
                                    </span>
                                    <div className="text-3xl font-black text-gray-900 leading-tight">
                                        $
                                        {Number(total).toLocaleString(
                                            undefined,
                                            {
                                                minimumFractionDigits: 2,
                                            },
                                        )}{" "}
                                        <span className="text-sm text-gray-400 font-bold uppercase">
                                            USD
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="w-full md:w-auto">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full md:w-64 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded transition-all disabled:opacity-50 uppercase text-xs tracking-widest shadow-lg shadow-red-200"
                                >
                                    {processing
                                        ? "Processing..."
                                        : "PROCEED TO PAYMENT"}
                                </button>
                                <p className="text-center text-[10px] text-gray-400 font-bold mt-2 uppercase tracking-widest italic leading-none whitespace-nowrap">
                                    Secure Payment Gateway Integration
                                </p>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

Checkout.layout = (page) => <UserLayout children={page} />;

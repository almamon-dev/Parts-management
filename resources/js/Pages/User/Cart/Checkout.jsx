import React, { useState } from "react";
import UserLayout from "@/Layouts/UserLayout";
import { Head, usePage, router, Link } from "@inertiajs/react";
import { ChevronLeft } from "lucide-react";
import { toast } from "react-hot-toast";

export default function Checkout() {
    const { auth, cart, userAddresses, user, errors } = usePage().props;
    const {
        items: cartItems,
        subtotal,
        total,
    } = cart || { items: [], subtotal: 0, total: 0 };

    const [processing, setProcessing] = useState(false);
    const [deliveryType, setDeliveryType] = useState("brampton_pickup");
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
        if (deliveryType === "deliver" || deliveryType === "ship") {
            if (!addressOption) {
                toast.error("Please select an address option");
                return;
            }

            // Validation for "Select delivery address" option
            if (addressOption === "select_delivery" && !selectedAddressId) {
                toast.error("Please select a delivery address from the list");
                return;
            }

            // Validation for "New Address" option
            if (addressOption === "new_address") {
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

                // Validate address type
                if (!formData.address_type) {
                    newErrors.address_type =
                        "Please select an address type (Business or Residential)";
                }
            }
        }

        // Validate PO Number (optional but has max length)
        if (formData.po_number && formData.po_number.length > 15) {
            newErrors.po_number = "PO number cannot exceed 15 characters";
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

        if (deliveryType === "brampton_pickup") {
            shipping_address = "Store Pick Up";
            order_type = "Pick up";
        } else if (deliveryType === "deliver") {
            order_type = "Delivery";
            if (addressOption === "my_address") {
                shipping_address = user.address || "Default Address";
            } else if (addressOption === "select_delivery") {
                const addr = userAddresses.find(
                    (a) => a.id.toString() === selectedAddressId,
                );
                shipping_address = addr
                    ? `${addr.shop_name}, ${addr.street_address}, ${addr.city}, ${addr.province}, ${addr.post_code}`
                    : "";
            } else {
                shipping_address = `${formData.shop_name}, ${formData.manager_name}, ${formData.contact_number}, ${formData.street_address}, ${formData.city}, ${formData.province}, ${formData.post_code}`;
            }
        } else if (deliveryType === "ship") {
            order_type = "Ship";
            if (addressOption === "my_address") {
                shipping_address = user.address || "Default Address";
            } else if (addressOption === "select_delivery") {
                const addr = userAddresses.find(
                    (a) => a.id.toString() === selectedAddressId,
                );
                shipping_address = addr
                    ? `${addr.shop_name}, ${addr.street_address}, ${addr.city}, ${addr.province}, ${addr.post_code}`
                    : "";
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
            order_type: order_type,
            payment_method: paymentMethod,
        };

        // Only include address fields if delivery or ship is selected
        if (deliveryType === "deliver" || deliveryType === "ship") {
            if (addressOption === "new_address") {
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

            <div className="bg-[#F5F5F5] min-h-screen">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    {/* Header */}
                    <div className="flex items-center gap-3 mb-6">
                        <h1 className="text-xl font-semibold text-gray-900">
                            Checkout
                        </h1>
                    </div>

                    <form onSubmit={handleSubmit}>
                        {/* Left Section */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                {/* Comments Section */}
                                <div className="bg-white border border-gray-300 rounded p-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <label className="text-sm font-normal text-gray-900">
                                            Comments / Special Instructions:
                                        </label>
                                        <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                                            {charsLeft} letters. Letters left:{" "}
                                            {100 - charsLeft}
                                        </span>
                                    </div>
                                    <textarea
                                        name="notes"
                                        value={formData.notes}
                                        onChange={handleInputChange}
                                        maxLength={100}
                                        rows={4}
                                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-1 focus:ring-blue-400 focus:border-blue-400 resize-none"
                                        placeholder=""
                                    />
                                    {/* Important Notices */}
                                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded space-y-2">
                                        <div className="flex items-start gap-2">
                                            <div className="mt-0.5 flex-shrink-0">
                                                <svg
                                                    className="w-3.5 h-3.5 text-red-600"
                                                    fill="currentColor"
                                                    viewBox="0 0 20 20"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </div>
                                            <p className="text-xs text-red-700 leading-relaxed">
                                                <span className="font-semibold">
                                                    Pickup:
                                                </span>{" "}
                                                Please allow a minimum of 1 hour
                                                to process before coming for
                                                pickup.
                                            </p>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <div className="mt-0.5 flex-shrink-0">
                                                <svg
                                                    className="w-3.5 h-3.5 text-red-600"
                                                    fill="currentColor"
                                                    viewBox="0 0 20 20"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </div>
                                            <p className="text-xs text-red-700 leading-relaxed">
                                                This order will take an extra
                                                day for delivery if it is coming
                                                from another Ontario branch.
                                            </p>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <div className="mt-0.5 flex-shrink-0">
                                                <svg
                                                    className="w-3.5 h-3.5 text-red-600"
                                                    fill="currentColor"
                                                    viewBox="0 0 20 20"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </div>
                                            <p className="text-xs text-red-700 leading-relaxed">
                                                This order will take an extra 7
                                                days for delivery if it is
                                                coming from another branch
                                                located in a different province.
                                            </p>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <div className="mt-0.5 flex-shrink-0">
                                                <svg
                                                    className="w-3.5 h-3.5 text-red-600"
                                                    fill="currentColor"
                                                    viewBox="0 0 20 20"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </div>
                                            <p className="text-xs text-red-700 leading-relaxed font-semibold">
                                                We do not deliver to residential
                                                address.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Section */}
                            <div className="space-y-4">
                                {/* PO Number and Your Name */}
                                <div className="bg-white border border-gray-300 rounded p-4 space-y-3">
                                    <div>
                                        <label className="text-sm font-normal text-gray-900 mb-1 block">
                                            P.O. Number:{" "}
                                            <span className="text-gray-500">
                                                (12 max length)
                                            </span>
                                        </label>
                                        <input
                                            type="text"
                                            name="po_number"
                                            value={formData.po_number}
                                            onChange={handleInputChange}
                                            className={`w-full border rounded px-3 py-2 text-sm focus:ring-1 focus:ring-blue-400 focus:border-blue-400 ${allErrors.po_number ? "border-red-500" : "border-gray-300"}`}
                                            placeholder=""
                                        />
                                        {allErrors.po_number && (
                                            <p className="text-red-600 text-xs mt-1">
                                                {allErrors.po_number}
                                            </p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="text-sm font-normal text-gray-900 mb-1 block">
                                            Your Name:
                                        </label>
                                        <input
                                            type="text"
                                            value={
                                                user.first_name +
                                                " " +
                                                user.last_name
                                            }
                                            disabled
                                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-gray-100 text-gray-600"
                                        />
                                    </div>
                                </div>

                                {/* Delivery Section */}
                                <div className="bg-white border border-gray-300 rounded p-4">
                                    <label className="text-sm font-normal text-gray-900 mb-3 block">
                                        Delivery:
                                    </label>

                                    <div className="space-y-3">
                                        {/* Brampton Pickup */}
                                        <label className="flex items-start gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="delivery_type"
                                                value="brampton_pickup"
                                                checked={
                                                    deliveryType ===
                                                    "brampton_pickup"
                                                }
                                                onChange={(e) =>
                                                    setDeliveryType(
                                                        e.target.value,
                                                    )
                                                }
                                                className="mt-0.5 text-red-600 focus:ring-red-500"
                                            />
                                            <span className="text-sm text-gray-900">
                                                Store Pick Up
                                            </span>
                                        </label>

                                        {/* Deliver to */}
                                        <div>
                                            <label className="flex items-start gap-2 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name="delivery_type"
                                                    value="deliver"
                                                    checked={
                                                        deliveryType ===
                                                        "deliver"
                                                    }
                                                    onChange={(e) =>
                                                        setDeliveryType(
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="mt-0.5 text-red-600 focus:ring-red-500"
                                                />
                                                <span className="text-sm text-gray-900">
                                                    Deliver to
                                                </span>
                                            </label>

                                            {deliveryType === "deliver" && (
                                                <div className="ml-6 mt-2 space-y-2">
                                                    <label className="flex items-center gap-2 cursor-pointer">
                                                        <input
                                                            type="radio"
                                                            name="address_option"
                                                            value="my_address"
                                                            checked={
                                                                addressOption ===
                                                                "my_address"
                                                            }
                                                            onChange={(e) =>
                                                                setAddressOption(
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            className="text-red-600 focus:ring-red-500"
                                                        />
                                                        <span className="text-sm text-gray-900">
                                                            My Address
                                                        </span>
                                                    </label>

                                                    {userAddresses &&
                                                        userAddresses.length >
                                                            0 && (
                                                            <div>
                                                                <label className="flex items-start gap-2 cursor-pointer">
                                                                    <input
                                                                        type="radio"
                                                                        name="address_option"
                                                                        value="select_delivery"
                                                                        checked={
                                                                            addressOption ===
                                                                            "select_delivery"
                                                                        }
                                                                        onChange={(
                                                                            e,
                                                                        ) =>
                                                                            setAddressOption(
                                                                                e
                                                                                    .target
                                                                                    .value,
                                                                            )
                                                                        }
                                                                        className="mt-0.5 text-red-600 focus:ring-red-500"
                                                                    />
                                                                    <span className="text-sm text-gray-900">
                                                                        Select
                                                                        delivery
                                                                        address...
                                                                    </span>
                                                                </label>
                                                                {addressOption ===
                                                                    "select_delivery" && (
                                                                    <div className="ml-6 mt-2">
                                                                        <select
                                                                            value={
                                                                                selectedAddressId
                                                                            }
                                                                            onChange={
                                                                                handleAddressSelect
                                                                            }
                                                                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-1 focus:ring-blue-400 focus:border-blue-400"
                                                                        >
                                                                            <option value="">
                                                                                Select
                                                                                delivery
                                                                                address
                                                                            </option>
                                                                            {userAddresses.map(
                                                                                (
                                                                                    addr,
                                                                                ) => (
                                                                                    <option
                                                                                        key={
                                                                                            addr.id
                                                                                        }
                                                                                        value={
                                                                                            addr.id
                                                                                        }
                                                                                    >
                                                                                        {addr.shop_name ||
                                                                                            addr.street_address}
                                                                                    </option>
                                                                                ),
                                                                            )}
                                                                        </select>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )}

                                                    <label className="flex items-center gap-2 cursor-pointer">
                                                        <input
                                                            type="radio"
                                                            name="address_option"
                                                            value="new_address"
                                                            checked={
                                                                addressOption ===
                                                                "new_address"
                                                            }
                                                            onChange={(e) =>
                                                                setAddressOption(
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            className="text-red-600 focus:ring-red-500"
                                                        />
                                                        <span className="text-sm text-gray-900">
                                                            New Address
                                                        </span>
                                                    </label>
                                                </div>
                                            )}
                                        </div>

                                        {/* Ship it */}
                                        <div>
                                            <label className="flex items-start gap-2 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name="delivery_type"
                                                    value="ship"
                                                    checked={
                                                        deliveryType === "ship"
                                                    }
                                                    onChange={(e) =>
                                                        setDeliveryType(
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="mt-0.5 text-red-600 focus:ring-red-500"
                                                />
                                                <span className="text-sm text-gray-900">
                                                    Ship it
                                                </span>
                                            </label>

                                            {deliveryType === "ship" && (
                                                <div className="ml-6 mt-2 space-y-2">
                                                    <label className="flex items-center gap-2 cursor-pointer">
                                                        <input
                                                            type="radio"
                                                            name="address_option"
                                                            value="my_address"
                                                            checked={
                                                                addressOption ===
                                                                "my_address"
                                                            }
                                                            onChange={(e) =>
                                                                setAddressOption(
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            className="text-red-600 focus:ring-red-500"
                                                        />
                                                        <span className="text-sm text-gray-900">
                                                            My Address
                                                        </span>
                                                    </label>

                                                    {userAddresses &&
                                                        userAddresses.length >
                                                            0 && (
                                                            <div>
                                                                <label className="flex items-start gap-2 cursor-pointer">
                                                                    <input
                                                                        type="radio"
                                                                        name="address_option"
                                                                        value="select_delivery"
                                                                        checked={
                                                                            addressOption ===
                                                                            "select_delivery"
                                                                        }
                                                                        onChange={(
                                                                            e,
                                                                        ) =>
                                                                            setAddressOption(
                                                                                e
                                                                                    .target
                                                                                    .value,
                                                                            )
                                                                        }
                                                                        className="mt-0.5 text-red-600 focus:ring-red-500"
                                                                    />
                                                                    <span className="text-sm text-gray-900">
                                                                        Select
                                                                        delivery
                                                                        address...
                                                                    </span>
                                                                </label>
                                                                {addressOption ===
                                                                    "select_delivery" && (
                                                                    <div className="ml-6 mt-2">
                                                                        <select
                                                                            value={
                                                                                selectedAddressId
                                                                            }
                                                                            onChange={
                                                                                handleAddressSelect
                                                                            }
                                                                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-1 focus:ring-blue-400 focus:border-blue-400"
                                                                        >
                                                                            <option value="">
                                                                                Select
                                                                                delivery
                                                                                address
                                                                            </option>
                                                                            {userAddresses.map(
                                                                                (
                                                                                    addr,
                                                                                ) => (
                                                                                    <option
                                                                                        key={
                                                                                            addr.id
                                                                                        }
                                                                                        value={
                                                                                            addr.id
                                                                                        }
                                                                                    >
                                                                                        {addr.shop_name ||
                                                                                            addr.street_address}
                                                                                    </option>
                                                                                ),
                                                                            )}
                                                                        </select>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )}

                                                    <label className="flex items-center gap-2 cursor-pointer">
                                                        <input
                                                            type="radio"
                                                            name="address_option"
                                                            value="new_address"
                                                            checked={
                                                                addressOption ===
                                                                "new_address"
                                                            }
                                                            onChange={(e) =>
                                                                setAddressOption(
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            className="text-red-600 focus:ring-red-500"
                                                        />
                                                        <span className="text-sm text-gray-900">
                                                            New Address
                                                        </span>
                                                    </label>

                                                    {deliveryType ===
                                                        "ship" && (
                                                        <div className="text-xs text-red-600 italic mt-2">
                                                            Shipping charges are
                                                            additional and you
                                                            will get quote once
                                                            you place your order
                                                            with your shipping
                                                            address.
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* New Address Form */}
                                    {(deliveryType === "deliver" ||
                                        deliveryType === "ship") &&
                                        addressOption === "new_address" && (
                                            <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded space-y-3">
                                                <div>
                                                    <label className="text-sm text-gray-900 mb-2 block">
                                                        Address Type
                                                    </label>
                                                    <div className="flex gap-6">
                                                        <label className="flex items-center gap-2 cursor-pointer">
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
                                                                className="text-red-600 focus:ring-red-500"
                                                            />
                                                            <span className="text-sm text-gray-900">
                                                                Business
                                                            </span>
                                                        </label>
                                                        <label className="flex items-center gap-2 cursor-pointer">
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
                                                                className="text-red-600 focus:ring-red-500"
                                                            />
                                                            <span className="text-sm text-gray-900">
                                                                Residential
                                                            </span>
                                                        </label>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-2 gap-3">
                                                    <div>
                                                        <label className="text-xs text-gray-700 mb-1 block">
                                                            Company Name
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
                                                            className={`w-full border rounded px-2 py-1.5 text-sm focus:ring-1 focus:ring-blue-400 focus:border-blue-400 ${allErrors.shop_name ? "border-red-500" : "border-gray-300"}`}
                                                        />
                                                        {allErrors.shop_name && (
                                                            <p className="text-red-600 text-xs mt-1">
                                                                {
                                                                    allErrors.shop_name
                                                                }
                                                            </p>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <label className="text-xs text-gray-700 mb-1 block">
                                                            Phone Number
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
                                                            className={`w-full border rounded px-2 py-1.5 text-sm focus:ring-1 focus:ring-blue-400 focus:border-blue-400 ${allErrors.contact_number ? "border-red-500" : "border-gray-300"}`}
                                                        />
                                                        {allErrors.contact_number && (
                                                            <p className="text-red-600 text-xs mt-1">
                                                                {
                                                                    allErrors.contact_number
                                                                }
                                                            </p>
                                                        )}
                                                    </div>
                                                    <div className="col-span-2">
                                                        <label className="text-xs text-gray-700 mb-1 block">
                                                            Contact Person
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
                                                            className={`w-full border rounded px-2 py-1.5 text-sm focus:ring-1 focus:ring-blue-400 focus:border-blue-400 ${allErrors.manager_name ? "border-red-500" : "border-gray-300"}`}
                                                        />
                                                        {allErrors.manager_name && (
                                                            <p className="text-red-600 text-xs mt-1">
                                                                {
                                                                    allErrors.manager_name
                                                                }
                                                            </p>
                                                        )}
                                                    </div>
                                                    <div className="col-span-2">
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
                                                            className={`w-full border rounded px-2 py-1.5 text-sm focus:ring-1 focus:ring-blue-400 focus:border-blue-400 ${allErrors.street_address ? "border-red-500" : "border-gray-300"}`}
                                                        />
                                                        {allErrors.street_address && (
                                                            <p className="text-red-600 text-xs mt-1">
                                                                {
                                                                    allErrors.street_address
                                                                }
                                                            </p>
                                                        )}
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
                                                            className={`w-full border rounded px-2 py-1.5 text-sm focus:ring-1 focus:ring-blue-400 focus:border-blue-400 ${allErrors.province ? "border-red-500" : "border-gray-300"}`}
                                                        >
                                                            <option value="">
                                                                Select State /
                                                                Province
                                                            </option>
                                                            <option value="ON">
                                                                Ontario
                                                            </option>
                                                            <option value="QC">
                                                                Quebec
                                                            </option>
                                                            <option value="BC">
                                                                British Columbia
                                                            </option>
                                                            <option value="AB">
                                                                Alberta
                                                            </option>
                                                            <option value="MB">
                                                                Manitoba
                                                            </option>
                                                            <option value="SK">
                                                                Saskatchewan
                                                            </option>
                                                        </select>
                                                        {allErrors.province && (
                                                            <p className="text-red-600 text-xs mt-1">
                                                                {
                                                                    allErrors.province
                                                                }
                                                            </p>
                                                        )}
                                                    </div>
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
                                                            placeholder="Search..."
                                                            className={`w-full border rounded px-2 py-1.5 text-sm focus:ring-1 focus:ring-blue-400 focus:border-blue-400 ${allErrors.city ? "border-red-500" : "border-gray-300"}`}
                                                        />
                                                        {allErrors.city && (
                                                            <p className="text-red-600 text-xs mt-1">
                                                                {allErrors.city}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <div className="col-span-2">
                                                        <label className="text-xs text-gray-700 mb-1 block">
                                                            Postal Code
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
                                                            className={`w-full border rounded px-2 py-1.5 text-sm focus:ring-1 focus:ring-blue-400 focus:border-blue-400 ${allErrors.post_code ? "border-red-500" : "border-gray-300"}`}
                                                        />
                                                        {allErrors.post_code && (
                                                            <p className="text-red-600 text-xs mt-1">
                                                                {
                                                                    allErrors.post_code
                                                                }
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>

                                                {deliveryType === "deliver" &&
                                                    formData.address_type ===
                                                        "Residential" && (
                                                        <div className="text-xs text-red-600 italic">
                                                            Orders delivery in
                                                            residential address
                                                            will be cancelled
                                                            without any notice.
                                                        </div>
                                                    )}

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setFormData((prev) => ({
                                                            ...prev,
                                                            save_to_address_book: true,
                                                        }))
                                                    }
                                                    className="bg-red-600 hover:bg-red-700 text-white text-xs font-semibold px-4 py-2 rounded transition-colors uppercase"
                                                >
                                                    SAVE TO ADDRESS BOOK
                                                </button>
                                            </div>
                                        )}
                                </div>

                                {/* Payment Section */}
                                <div className="bg-white border border-gray-300 rounded p-4">
                                    <label className="text-sm font-normal text-gray-900 mb-3 block">
                                        Payment
                                    </label>
                                    <select
                                        value={paymentMethod}
                                        onChange={(e) =>
                                            setPaymentMethod(e.target.value)
                                        }
                                        className={`w-full border rounded px-3 py-2 text-sm focus:ring-1 focus:ring-blue-400 focus:border-blue-400 ${allErrors.payment_method ? "border-red-500" : "border-gray-300"}`}
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
                                    {allErrors.payment_method && (
                                        <p className="text-red-600 text-xs mt-1">
                                            {allErrors.payment_method}
                                        </p>
                                    )}
                                </div>

                                {/* Submit Button */}
                                <div>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed uppercase text-sm"
                                    >
                                        {processing
                                            ? "Processing..."
                                            : "PROCEED TO PAYMENT"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

Checkout.layout = (page) => <UserLayout children={page} />;

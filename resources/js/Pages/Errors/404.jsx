import React from "react";
import { Head, Link } from "@inertiajs/react";

export default function Error404() {
    // Back function
    const handleGoBack = () => {
        if (window.history.length > 1) {
            window.history.back();
        } else {
            // Jodi kono history na thake (direct link), tobe home-e niye jabe
            window.location.href = "/";
        }
    };

    return (
        <>
            <Head title="404 - Page Not Found" />

            <div className="min-h-screen bg-white flex items-center justify-center px-6">
                <div className="max-w-md w-full text-center">
                    {/* Minimalist Illustration */}
                    <div className="mb-8">
                        <h1 className="text-9xl font-extrabold text-indigo-600 tracking-tighter">
                            404
                        </h1>
                    </div>

                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                        You seem a bit lost
                    </h2>
                    <p className="text-gray-500 mb-10">
                        The page you are looking for doesn't exist. Click the
                        button below to go back to where you were.
                    </p>

                    <div className="flex flex-col gap-4">
                        {/* Eita user-ke ager page-e niye jabe */}
                        <button
                            onClick={handleGoBack}
                            className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-200"
                        >
                            <svg
                                className="w-5 h-5 mr-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                                />
                            </svg>
                            Go Back to Previous Page
                        </button>

                        {/* Emergency Home Link */}
                        <Link
                            href="/"
                            className="text-sm font-medium text-gray-400 hover:text-indigo-600 transition-colors"
                        >
                            Or return to Homepage
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}

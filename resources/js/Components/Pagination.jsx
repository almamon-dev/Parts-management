import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { router } from "@inertiajs/react";

const Pagination = ({ meta }) => {
    if (!meta) return null;

    const {
        current_page,
        last_page,
        per_page,
        from,
        to,
        total,
        prev_page_url,
        next_page_url,
        path,
    } = meta;

    const handlePerPageChange = (e) => {
        const value = e.target.value;
        const params = new URLSearchParams(window.location.search);
        params.set("per_page", value);
        params.set("page", 1);

        router.get(
            `${window.location.pathname}?${params.toString()}`,
            {},
            {
                preserveState: true,
                replace: true,
                preserveScroll: true,
            }
        );
    };

    const handlePageChange = (url) => {
        if (url) {
            router.get(
                url,
                {},
                {
                    preserveState: true,
                    replace: true,
                    preserveScroll: true,
                }
            );
        }
    };

    const getPageUrl = (page) => {
        const params = new URLSearchParams(window.location.search);
        params.set("page", page);
        params.set("per_page", per_page);
        return `${window.location.pathname}?${params.toString()}`;
    };

    const getPages = () => {
        const pages = [];
        const maxPagesToShow = typeof window !== 'undefined' && window.innerWidth < 640 ? 3 : 8;
        
        let start = Math.max(1, current_page - Math.floor(maxPagesToShow / 2));
        let end = Math.min(last_page, start + maxPagesToShow - 1);
        
        if (end === last_page) {
            start = Math.max(1, end - maxPagesToShow + 1);
        }

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }
        return pages;
    };

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between px-4 md:px-6 py-4 bg-white dark:bg-gray-900 border-t border-[#F1F5F9] dark:border-gray-800 font-sans gap-4 transition-colors duration-300">
            {/* Left side: Rows per page and range info */}
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6 w-full sm:w-auto">
                <div className="flex items-center gap-2">
                    <span className="text-[#94A3B8] dark:text-gray-500 text-[13px] whitespace-nowrap">
                        Rows:
                    </span>
                    <select
                        value={per_page}
                        onChange={handlePerPageChange}
                        className="appearance-none bg-slate-50 dark:bg-gray-800 border border-[#E2E8F0] dark:border-gray-700 rounded-lg pl-3 pr-8 py-1.5 text-[#64748B] dark:text-gray-300 text-[12px] focus:outline-none cursor-pointer min-w-[70px] transition-all hover:bg-slate-100 dark:hover:bg-gray-700"
                    >
                        {[5, 10, 20, 50].map((val) => (
                            <option key={val} value={val}>
                                {val < 10 ? `0${val}` : val}
                            </option>
                        ))}
                    </select>
                </div>
                <span className="text-[#94A3B8] dark:text-gray-500 text-[13px] font-medium whitespace-nowrap">
                    {from || 0}-{to || 0} <span className="text-slate-300 dark:text-gray-700 mx-1">/</span> {total}
                </span>
            </div>

            {/* Right side: Navigation buttons */}
            <div className="flex items-center gap-1.5 w-full sm:w-auto justify-center sm:justify-end">
                {/* Previous Button */}
                <button
                    onClick={() => handlePageChange(prev_page_url)}
                    disabled={!prev_page_url}
                    className={`w-9 h-9 flex items-center justify-center border border-[#E2E8F0] dark:border-gray-700 rounded-lg transition-all ${
                        !prev_page_url
                            ? "text-[#E2E8F0] dark:text-gray-800 cursor-not-allowed"
                            : "text-[#94A3B8] dark:text-gray-400 hover:bg-slate-50 dark:hover:bg-gray-800 hover:border-slate-300 active:scale-95"
                    }`}
                >
                    <ChevronLeft size={18} />
                </button>

                {/* Page Numbers */}
                <div className="flex items-center gap-1 mx-1">
                    {getPages().map((page) => (
                        <button
                            key={page}
                            onClick={() => handlePageChange(getPageUrl(page))}
                            className={`min-w-[36px] h-9 px-2 flex items-center justify-center font-bold text-[13px] rounded-lg border transition-all ${
                                current_page === page
                                    ? "bg-[#FF9F43] border-[#FF9F43] text-white shadow-lg shadow-[#FF9F43]/20"
                                    : "text-[#64748B] dark:text-gray-400 border-[#E2E8F0] dark:border-gray-700 hover:bg-slate-50 dark:hover:bg-gray-800 hover:border-slate-300 active:scale-95"
                            }`}
                        >
                            {page}
                        </button>
                    ))}
                </div>

                {/* Next Button */}
                <button
                    onClick={() => handlePageChange(next_page_url)}
                    disabled={!next_page_url}
                    className={`w-9 h-9 flex items-center justify-center border border-[#E2E8F0] dark:border-gray-700 rounded-lg transition-all ${
                        !next_page_url
                            ? "text-[#E2E8F0] dark:text-gray-800 cursor-not-allowed"
                            : "text-[#94A3B8] dark:text-gray-400 hover:bg-slate-50 dark:hover:bg-gray-800 hover:border-slate-300 active:scale-95"
                    }`}
                >
                    <ChevronRight size={18} />
                </button>
            </div>
        </div>
    );
};

export default Pagination;

import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { Printer } from "lucide-react";
import ProductLabel from "./ProductLabel";

const PrintLabelButton = ({ product, variant = "icon" }) => {
    const componentRef = useRef();

    // Direct Print Logic (Centered on A4)
    const handlePrint = useReactToPrint({
        contentRef: componentRef,
        documentTitle: "",
        pageStyle: `
            @page {
                size: A4 portrait;
                margin: 0 !important;
            }
            @media print {
                html, body {
                    margin: 0 !important;
                    padding: 0 !important;
                    height: 100% !important;
                    width: 100% !important;
                    display: flex !important;
                    justify-content: center !important;
                    align-items: center !important;
                    background: white !important;
                }
                body * {
                    visibility: hidden !important;
                }
                .print-label-container, 
                .print-label-container * {
                    visibility: visible !important;
                }
                .print-label-container {
                    position: relative !important;
                    visibility: visible !important;
                    margin: 0 !important;
                    padding: 20px 24px !important;
                    box-sizing: border-box !important;
                    border: 1.5px solid #000 !important;
                    border-radius: 10px !important;
                    background: white !important;
                    width: 4.2in !important;
                    height: 2.6in !important;
                }
            }
        `,
    });

    const labelContainerStyle = {
        position: "absolute",
        left: "-9999px",
        top: "0",
        visibility: "hidden",
    };

    if (variant === "button") {
        return (
            <>
                <div style={labelContainerStyle}>
                    <ProductLabel ref={componentRef} product={product} />
                </div>
                <button
                    onClick={handlePrint}
                    className="inline-flex items-center justify-center px-4 py-2 bg-[#FF9F43] text-white text-[13px] font-bold rounded-lg hover:bg-[#e68a30] transition-all duration-200 shadow-md shadow-orange-100"
                >
                    <Printer size={16} className="mr-2" /> Print Label
                </button>
            </>
        );
    }

    return (
        <>
            <div style={labelContainerStyle}>
                <ProductLabel ref={componentRef} product={product} />
            </div>
            <button
                onClick={handlePrint}
                className="inline-flex items-center justify-center w-8 h-8 text-slate-400 hover:text-[#FF9F43] hover:bg-white bg-transparent border border-transparent hover:border-slate-200 rounded-lg transition-all duration-200"
                title="Print Label"
            >
                <Printer size={15} />
            </button>
        </>
    );
};

export default PrintLabelButton;

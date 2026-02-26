import React, { useEffect, useRef } from "react";
import JsBarcode from "jsbarcode";

const ProductLabel = React.forwardRef(({ product }, ref) => {
    const barcodeRef = useRef(null);
    const fitment = product.fitments?.[0] || {};

    useEffect(() => {
        if (barcodeRef.current && product.pp_id) {
            try {
                JsBarcode(barcodeRef.current, product.pp_id, {
                    format: "CODE128",
                    width: 2.0,
                    height: 60,
                    displayValue: true,
                    fontSize: 16,
                    lineColor: "#000000",
                    font: "sans-serif",
                    textAlign: "center",
                    textPosition: "bottom",
                    textMargin: 4,
                    margin: 0,
                });
            } catch (e) {
                console.error("Barcode generation failed", e);
            }
        }
    }, [product.pp_id]);

    const yearRange = (() => {
        const from = fitment.year_from;
        const to = fitment.year_to;
        if (!from && !to) return "";
        if (from && to && String(from) === String(to)) return from;
        if (from && to) return `${from} - ${to}`;
        return from || to || "";
    })();

    const vehicleTitle =
        `${yearRange} ${fitment.make || ""} ${fitment.model || ""}`.trim();

    return (
        <div
            ref={ref}
            className="print-label-container"
            style={{
                width: "420px",
                height: "260px",
                padding: "20px 24px",
                backgroundColor: "white",
                color: "#000",
                fontFamily: "'Inter', sans-serif",
                display: "flex",
                flexDirection: "column",
                borderRadius: "10px",
                margin: "0 auto",
                boxSizing: "border-box",
                position: "relative",
                overflow: "hidden",
            }}
        >
            {/* Top Section */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                }}
            >
                {/* Barcode Area */}
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        marginLeft: "-12px",
                        marginTop: "-5px",
                    }}
                >
                    <svg ref={barcodeRef} style={{ width: "230px" }}></svg>
                </div>

                {/* Logo Area */}
                <div style={{ textAlign: "right", marginTop: "5px" }}>
                    <img
                        src="/img/logo.png"
                        alt="Parts Panel"
                        style={{ height: "45px", objectFit: "contain" }}
                    />
                </div>
            </div>

            {/* Vehicle Title Section */}
            <div style={{ marginTop: "15px" }}>
                <h2
                    style={{
                        fontSize: "17px",
                        fontWeight: "900",
                        margin: 0,
                        textTransform: "uppercase",
                        lineHeight: "1.1",
                        letterSpacing: "-0.01em",
                    }}
                >
                    {vehicleTitle || "VEHICLE INFO N/A"}
                </h2>
            </div>

            {/* Description Section */}
            <div
                style={{
                    marginTop: "8px",
                    fontSize: "13px",
                    fontWeight: "500",
                    textTransform: "uppercase",
                    lineHeight: "1.4",
                    color: "#000",
                    flexGrow: 1,
                    display: "-webkit-box",
                    WebkitLineClamp: "3",
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                }}
            >
                {product.description}
            </div>

            {/* Footer Section */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-end",
                    fontSize: "15px",
                    fontWeight: "500",
                    textTransform: "uppercase",
                    marginTop: "auto",
                    paddingBottom: "2px",
                }}
            >
                <div>
                    <span style={{ fontWeight: "400" }}>SKU: </span>
                    <span>{product.sku}</span>
                </div>
                <div>
                    <span style={{ fontWeight: "400" }}>LOC: </span>
                    <span>{product.location_id || "—"}</span>
                </div>
            </div>
        </div>
    );
});

export default ProductLabel;

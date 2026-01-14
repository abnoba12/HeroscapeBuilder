import React, { useEffect, useRef, useState } from "react";
import { Unit } from "../../../models/unit";
import { AddFileToUnit } from "../../../services/file-service";
import { getUnits } from "../../../services/unit-service";

const UploadStandardCard: React.FC = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const [unitData, setUnitData] = useState<Unit[]>([]);
    const [selectedUnit, setSelectedUnit] = useState<string>("");
    const [pdfFile, setPdfFile] = useState<File | null>(null);
    const [error, setError] = useState<string>("");
    const [status, setStatus] = useState<string>("");
    const [uploading, setUploading] = useState<boolean>(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        const fetchUnits = async () => {
            try {
                const units = await getUnits();
                setUnitData(units);
            } catch (err) {
                setError("Unable to load unit data.");
            } finally {
                setLoading(false);
            }
        };

        fetchUnits();
    }, []);

    useEffect(() => {
        async function initializeTooltips() {
            const bootstrap = await import("bootstrap");
            const tooltipTriggerList = Array.from(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
            tooltipTriggerList.forEach((tooltipTriggerEl: Element) => {
                new bootstrap.Tooltip(tooltipTriggerEl);
            });
        }

        if (!loading) {
            initializeTooltips();
        }
    }, [loading]);

    const sanitizeFileName = (name: string) => {
        return name.replace(/\s+/g, "_");
    };

    const handleUpload = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError("");
        setStatus("");

        if (!selectedUnit) {
            setError("Please select an army card.");
            return;
        }

        if (!pdfFile) {
            setError("Please select a PDF to upload.");
            return;
        }

        setUploading(true);

        try {
            const success = await AddFileToUnit(pdfFile, selectedUnit, "Standard_Army_Card", sanitizeFileName(pdfFile.name));
            if (success) {
                setStatus("PDF uploaded successfully.");
                setPdfFile(null);
                if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                }
            }
        } catch (uploadError) {
            setError("Failed to upload PDF. Please try again.");
        } finally {
            setUploading(false);
        }
    };

    if (loading) return <div className="loading"><img src="/Hexes.gif" alt="Loading..." className="img-fluid" /></div>;

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-12 col-lg-8">
                    <h2 className="mb-4">Upload Standard Army Card PDF</h2>
                    <form className="row g-3" onSubmit={handleUpload}>
                        <div className="col-12">
                            <label htmlFor="unit" className="form-label">
                                Load Unit Data
                                <span
                                    data-bs-toggle="tooltip"
                                    data-bs-html="true"
                                    title="Load up the data for an existing unit."
                                >
                                    <span className="q">[?]</span>
                                </span>
                            </label>
                            <select
                                id="unit"
                                className="form-select"
                                value={selectedUnit}
                                onChange={(e) => setSelectedUnit(e.target.value)}
                            >
                                <option value="">Select Unit</option>
                                {unitData
                                    .sort((a, b) => a.name.localeCompare(b.name))
                                    .map((unit) => {
                                        let label = unit.name;
                                        label = unit.creator !== "HEROSCAPE" ? `(${unit.creator}) ${label}` : label;
                                        label = unitData
                                            .map((u) => u.name)
                                            .filter((name) => name === unit.name)
                                            .length > 1
                                            ? `${label}-${unit.set?.name}`
                                            : label;

                                        return (
                                            <option key={unit.id} value={unit.id}>
                                                {label}
                                            </option>
                                        );
                                    })}
                            </select>
                        </div>
                        <div className="col-12">
                            <label htmlFor="pdfUpload" className="form-label">
                                Standard Army Card PDF <span className="text-danger">*</span>
                            </label>
                            <input
                                ref={fileInputRef}
                                id="pdfUpload"
                                type="file"
                                className="form-control"
                                accept="application/pdf"
                                onChange={(e) => setPdfFile(e.target.files?.[0] ?? null)}
                            />
                        </div>
                        {error && (
                            <div className="col-12">
                                <div className="alert alert-danger" role="alert">
                                    {error}
                                </div>
                            </div>
                        )}
                        {status && (
                            <div className="col-12">
                                <div className="alert alert-success" role="alert">
                                    {status}
                                </div>
                            </div>
                        )}
                        <div className="col-12">
                            <button className="btn btn-primary" type="submit" disabled={uploading}>
                                {uploading ? "Uploading..." : "Upload PDF"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UploadStandardCard;

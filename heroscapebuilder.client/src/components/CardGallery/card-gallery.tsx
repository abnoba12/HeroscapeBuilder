import { PDFDocument, pushGraphicsState, popGraphicsState, clip, rectangle, endPath } from 'pdf-lib';
import React, { useEffect, useState } from 'react';
import { UnitFile } from '../../models/unit-file';
import { blobCache } from '../../services/cache-manager';
import { getFilesByPurpose } from '../../services/file-service';
import ImageCache from "../../services/image-cache-service";
import "./card-gallery.scss";

interface CardGalleryProps {
    cardSize: string;
}

const CardGallery: React.FC<CardGalleryProps> = ({ cardSize }) => {
    const [files, setFiles] = useState<UnitFile[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
    const [gallerySize, setGallerySize] = useState<string>("thumbnail col-xl-2 col-lg-3 col-md-4");
    const [isDownloading, setIsDownloading] = useState<boolean>(false); // Track download state

    useEffect(() => {
        const fetchFiles = async () => {
            try {
                if (cardSize == "3x5") {
                    setGallerySize("thumbnail col-xxl-2 col-lg-3 col-lg-4");
                }

                const data = (await getFilesByPurpose(`${cardSize}_Army_Card`)).sort((a: UnitFile, b: UnitFile) => {
                    const leftName = a.unitName ?? a.fileName ?? a.filePath;
                    const rightName = b.unitName ?? b.fileName ?? b.filePath;

                    return leftName.localeCompare(rightName, undefined, { sensitivity: "base" });
                });
                setFiles(data);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch files');
                setLoading(false);
            }
        };

        fetchFiles();
    }, [cardSize]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    const handleCheckboxChange = (filePath: string) => {
        setSelectedFiles(prevSelectedFiles => {
            if (prevSelectedFiles.includes(filePath)) {
                return prevSelectedFiles.filter(f => f !== filePath);
            } else {
                return [...prevSelectedFiles, filePath];
            }
        });
    };

    const handleDownloadClick = async () => {
        if (selectedFiles.length === 0) {
            alert("Please select at least one card to download.");
            return;
        }

        try {
            setIsDownloading(true); // Start showing spinner
            await mergePDFs(selectedFiles, cardSize);
        } finally {
            setIsDownloading(false); // Stop showing spinner
        }
    };

    const mergePDFs = async (urls: string[], cardSize: string, debug = false) => {
        if (urls.length === 1) {
            if (debug) console.log('Only one PDF provided, downloading it directly...');
            const blob = await blobCache(urls[0], `pdf-cache_${urls[0]}`);
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = urls[0].split('/').pop()!;
            link.click();
            return;
        }

        const mergedPdf = await PDFDocument.create();
        const letterSize: [number, number] = [612, 792]; // Explicit tuple

        if (debug) console.log('Starting PDF merge process...');

        // 3x5 Logic
        if (cardSize === "3x5") {
            for (let i = 0; i < urls.length; i += 4) {
                if (debug) console.log(`Processing four PDFs: ${urls.slice(i, i + 4).join(", ")}`);

                const pdfs = [];
                for (let j = 0; j < 4; j++) {
                    if (urls[i + j]) {
                        const blob = await blobCache(urls[i + j], `pdf-cache_${urls[i + j]}`);
                        const pdfArrayBuffer = await blobToArrayBuffer(blob);

                        const pdf = await PDFDocument.load(pdfArrayBuffer);
                        pdfs.push(pdf);
                    } else {
                        pdfs.push(null); // Push null if there's no PDF for this slot
                    }
                }

                const pages = [];
                for (const pdf of pdfs) {
                    if (pdf) {
                        pages.push(await pdf.getPages());
                    } else {
                        pages.push([]);
                    }
                }

                // Layout on the first page
                const combinedPage1 = mergedPdf.addPage(letterSize);
                const positions1 = [
                    { x: letterSize[0] / 2, y: letterSize[1] / 2 }, // Bottom Right corner at center
                    { x: letterSize[0] / 2, y: letterSize[1] / 2 }, // Bottom Left corner at center
                    { x: letterSize[0] / 2, y: letterSize[1] / 2 }, // Top Right corner at center
                    { x: letterSize[0] / 2, y: letterSize[1] / 2 }  // Top Left corner at center
                ];

                for (let j = 0; j < 4; j++) {
                    if (pages[j][0]) {
                        const [embeddedPage] = await mergedPdf.embedPages([pages[j][0]]);
                        let drawX = positions1[j].x;
                        let drawY = positions1[j].y;

                        switch (j) {
                            case 0: // Bottom Right
                                drawX -= embeddedPage.width;
                                drawY -= embeddedPage.height;
                                break;
                            case 1: // Bottom Left
                                drawY -= embeddedPage.height;
                                break;
                            case 2: // Top Right
                                drawX -= embeddedPage.width;
                                break;
                            case 3: // Top Left
                                break;
                        }

                        combinedPage1.drawPage(embeddedPage, {
                            x: drawX,
                            y: drawY
                        });
                        if (debug) console.log(`Drew PDF ${j + 1} on the combined page 1.`);
                    }
                }

                // Layout on the second page
                const combinedPage2 = mergedPdf.addPage(letterSize);
                const positions2 = [
                    { x: letterSize[0] / 2, y: letterSize[1] / 2 }, // Bottom Left corner at center
                    { x: letterSize[0] / 2, y: letterSize[1] / 2 }, // Bottom Right corner at center
                    { x: letterSize[0] / 2, y: letterSize[1] / 2 }, // Top Left corner at center
                    { x: letterSize[0] / 2, y: letterSize[1] / 2 }  // Top Right corner at center
                ];

                for (let j = 0; j < 4; j++) {
                    if (pages[j][1]) {
                        const [embeddedPage] = await mergedPdf.embedPages([pages[j][1]]);
                        let drawX = positions2[j].x;
                        let drawY = positions2[j].y;

                        switch (j) {
                            case 0: // Bottom Left
                                drawY -= embeddedPage.height;
                                break;
                            case 1: // Bottom Right
                                drawX -= embeddedPage.width;
                                drawY -= embeddedPage.height;
                                break;
                            case 2: // Top Left
                                break;
                            case 3: // Top Right
                                drawX -= embeddedPage.width;
                                break;
                        }

                        combinedPage2.drawPage(embeddedPage, {
                            x: drawX,
                            y: drawY
                        });
                        if (debug) console.log(`Drew PDF ${j + 1} on the combined page 2.`);
                    }
                }
            }
        } else if (cardSize === "PC") {
            // 9-up BUTTED layout of trimmed cards (2.5" x 3.5") on US Letter
            // Each source page is center-cropped to 2.5x3.5 and placed with no gaps.
            // Duplex: flip on long edge => mirror columns on back.
            const TRIM_W_IN = 2.52;
            const TRIM_H_IN = 3.52;
            const PT_PER_IN = 72;

            const cellW = TRIM_W_IN * PT_PER_IN; // 180
            const cellH = TRIM_H_IN * PT_PER_IN; // 252

            const letterW = letterSize[0];
            const letterH = letterSize[1];

            const COLS = 3;
            const ROWS = 3;
            const PER_SHEET = COLS * ROWS;

            const gridW = COLS * cellW; // 540
            const gridH = ROWS * cellH; // 756

            const marginX = (letterW - gridW) / 2;
            const marginY = (letterH - gridH) / 2;

            for (let i = 0; i < urls.length; i += PER_SHEET) {
                if (debug) console.log(`Processing nine PDFs: ${urls.slice(i, i + PER_SHEET).join(", ")}`);

                const pdfs = [];
                for (let j = 0; j < PER_SHEET; j++) {
                    if (urls[i + j]) {
                        const blob = await blobCache(urls[i + j], `pdf-cache_${urls[i + j]}`);
                        const pdfArrayBuffer = await blobToArrayBuffer(blob);
                        const pdf = await PDFDocument.load(pdfArrayBuffer);
                        pdfs.push(pdf);
                    } else {
                        pdfs.push(null);
                    }
                }

                const pages = [];
                for (const pdf of pdfs) {
                    pages.push(pdf ? await pdf.getPages() : []);
                }

                // ---------- FRONT SHEET ----------
                const combinedFront = mergedPdf.addPage(letterSize);

                for (let j = 0; j < PER_SHEET; j++) {
                    if (!pages[j][0]) continue;

                    const [embeddedPage] = await mergedPdf.embedPages([pages[j][0]]);

                    const col = j % COLS;
                    const row = Math.floor(j / COLS);

                    // Cell position (butted grid), top row first
                    const cellX = marginX + col * cellW;
                    const cellY = letterH - marginY - (row + 1) * cellH;

                    // Compute where to place the *embedded page* so that its centered 2.5x3.5 region
                    // maps exactly into the cell.
                    const cx = embeddedPage.width / 2;
                    const cy = embeddedPage.height / 2;

                    // The bottom-left of the crop region in source coords:
                    const cropLeft = cx - cellW / 2;
                    const cropBottom = cy - cellH / 2;

                    // So we translate source so cropLeft/cropBottom lands at cellX/cellY:
                    const drawX = cellX - cropLeft;
                    const drawY = cellY - cropBottom;

                    // HARD clip on destination page (prevents any overlap no matter what)
                    combinedFront.pushOperators(
                        pushGraphicsState(),
                        rectangle(cellX, cellY, cellW, cellH),
                        clip(),
                        endPath()
                    );

                    combinedFront.drawPage(embeddedPage, { x: drawX, y: drawY });

                    combinedFront.pushOperators(popGraphicsState());

                    if (debug) console.log(`Drew FRONT for card ${j + 1} in slot ${j}.`);
                }

                // ---------- BACK SHEET ----------
                const combinedBack = mergedPdf.addPage(letterSize);

                for (let j = 0; j < PER_SHEET; j++) {
                    if (!pages[j][1]) continue;

                    const [embeddedPage] = await mergedPdf.embedPages([pages[j][1]]);

                    const col = j % COLS;
                    const row = Math.floor(j / COLS);

                    // Mirror columns for duplex "flip on long edge"
                    const mirroredCol = (COLS - 1) - col;

                    const cellX = marginX + mirroredCol * cellW;
                    const cellY = letterH - marginY - (row + 1) * cellH;

                    const cx = embeddedPage.width / 2;
                    const cy = embeddedPage.height / 2;

                    const cropLeft = cx - cellW / 2;
                    const cropBottom = cy - cellH / 2;

                    const drawX = cellX - cropLeft;
                    const drawY = cellY - cropBottom;

                    combinedBack.pushOperators(
                        pushGraphicsState(),
                        rectangle(cellX, cellY, cellW, cellH),
                        clip(),
                        endPath(),
                    );

                    combinedBack.drawPage(embeddedPage, { x: drawX, y: drawY });

                    combinedBack.pushOperators(popGraphicsState());

                    if (debug) console.log(`Drew BACK for card ${j + 1} (mirrored) in slot ${j}.`);
                }
            }
        } else {
            // standard logic
            for (let i = 0; i < urls.length; i += 2) {
                if (debug) console.log(`Processing pair: ${urls[i]} and ${urls[i + 1] ? urls[i + 1] : 'N/A'}`);
                const blob1 = await blobCache(urls[i], `pdf-cache_${urls[i]}`);
                const pdfArrayBuffer1 = await blobToArrayBuffer(blob1);
                const blob2 = await blobCache(urls[i + 1], `pdf-cache_${urls[i+1]}`);
                const pdfArrayBuffer2 = await blobToArrayBuffer(blob2);

                const pdf1 = await PDFDocument.load(pdfArrayBuffer1);
                const pdf2 = i + 1 < urls.length ? await PDFDocument.load(pdfArrayBuffer2) : null;

                const pages1 = await pdf1.getPages();
                const pages2 = pdf2 ? await pdf2.getPages() : [];

                if (debug) console.log(`PDF 1 has ${pages1.length} pages.`);
                if (pdf2 && debug) {
                    console.log(`PDF 2 has ${pages2.length} pages.`);
                }

                for (let j = 0; j < Math.max(pages1.length, pages2.length); j++) {
                    const combinedPage = mergedPdf.addPage(letterSize);
                    if (debug) console.log('Created a new combined page.');

                    let embeddedPage1 = null;
                    let embeddedPage2 = null;

                    if (pages1[j]) {
                        if (debug) console.log('Embedding page from PDF 1...');
                        [embeddedPage1] = await mergedPdf.embedPages([pages1[j]]);
                        if (debug) console.log('Embedded page from PDF 1:', embeddedPage1);
                    } else if (debug) {
                        console.log('No page available from PDF 1 for this iteration.');
                    }

                    if (pages2[j]) {
                        if (debug) console.log('Embedding page from PDF 2...');
                        [embeddedPage2] = await mergedPdf.embedPages([pages2[j]]);
                        if (debug) console.log('Embedded page from PDF 2:', embeddedPage2);
                    } else if (debug) {
                        console.log('No page available from PDF 2 for this iteration.');
                    }

                    if (embeddedPage1 && embeddedPage2) {
                        const combinedHeight = embeddedPage1.height + embeddedPage2.height;
                        const startY = (letterSize[1] - combinedHeight) / 2;

                        combinedPage.drawPage(embeddedPage1, {
                            x: (letterSize[0] - embeddedPage1.width) / 2,
                            y: startY + embeddedPage2.height,
                        });
                        if (debug) console.log('Drew embedded page from PDF 1 onto the combined page.');

                        combinedPage.drawPage(embeddedPage2, {
                            x: (letterSize[0] - embeddedPage2.width) / 2,
                            y: startY,
                        });
                        if (debug) console.log('Drew embedded page from PDF 2 onto the combined page.');
                    } else if (embeddedPage1) {
                        combinedPage.drawPage(embeddedPage1, {
                            x: (letterSize[0] - embeddedPage1.width) / 2,
                            y: (letterSize[1] - embeddedPage1.height) / 2,
                        });
                        if (debug) console.log('Drew embedded page from PDF 1 onto the combined page.');
                    } else if (embeddedPage2) {
                        combinedPage.drawPage(embeddedPage2, {
                            x: (letterSize[0] - embeddedPage2.width) / 2,
                            y: (letterSize[1] - embeddedPage2.height) / 2,
                        });
                        if (debug) console.log('Drew embedded page from PDF 2 onto the combined page.');
                    }
                }
            }
        }

        // Save and download the merged PDF
        const mergedPdfBytes = await mergedPdf.save();
        const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `HeroscapeBuilder-${cardSize}.pdf`;
        link.click();
    };

    const blobToArrayBuffer = (blob: Blob): Promise<ArrayBuffer> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as ArrayBuffer);
            reader.onerror = reject;
            reader.readAsArrayBuffer(blob);
        });
    };

    const getDisplayName = (card: UnitFile) => {
        return card.unitName?.trim() || card.fileName || card.filePath.split('/').pop() || 'PDF Thumbnail';
    };

    return (
        <div className="card-gallery">
            <div className="row">
                <div className="col-12 text-center">
                    <button id="download" className="btn btn-primary" onClick={handleDownloadClick} disabled={isDownloading}>
                        {isDownloading ? (
                            <>
                                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                &nbsp;Generating PDF...
                            </>
                        ) : (
                            'Download PDF for Print'
                        )}
                    </button>
                </div>
            </div>
            <div className="row pdf-gallery">
                {files.map((card, index) => {
                    const displayName = getDisplayName(card);
                    return (
                        <div key={card.id || index} className={gallerySize}>
                            <div className="checkbox-wrapper">
                                <input
                                    type="checkbox"
                                    className="make-pdf"
                                    onChange={() => handleCheckboxChange(card.filePath)}
                                />
                                <label className="label-make-pdf">Add to PDF</label>
                            </div>
                            <a className="thumbnail-image-link" href={card.filePath} target="_blank" rel="noopener noreferrer">
                                <ImageCache
                                    className="img-fluid"
                                    src={card.thumb}
                                    alt={`${displayName} PDF Thumbnail`}
                                    cacheKey={card.thumb}
                                />
                                {/*<img*/}
                                {/*    className="img-fluid"*/}
                                {/*    src={card.thumb}*/}
                                {/*    alt="PDF Thumbnail"*/}
                                {/*/>*/}
                            </a>
                            <div className="unit-name" title={displayName}>{displayName}</div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default CardGallery;

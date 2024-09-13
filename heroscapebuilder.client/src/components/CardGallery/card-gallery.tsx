import "./card-gallery.scss";
import React, { useEffect, useState } from 'react';
import { getFilesByPurpose } from '../../services/file-service';
import { UnitFile } from '../../models/unit-file';
import ImageCache from '../../services/image-cache';
import { blobCache } from '../../services/cache-manager';
import { PDFDocument } from 'pdf-lib';
import axios from 'axios';

interface CardGalleryProps {
    cardSize: string;
}

const CardGallery: React.FC<CardGalleryProps> = ({ cardSize }) => {
    const [files, setFiles] = useState<UnitFile[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
    const [gallerySize, setGallerySize] = useState<string>("thumbnail col-xl-2 col-lg-3 col-md-4");

    useEffect(() => {
        const fetchFiles = async () => {
            try {
                if (cardSize == "3x5") {
                    setGallerySize("thumbnail col-xxl-2 col-lg-3 col-lg-4");
                }

                const data = await getFilesByPurpose(`${cardSize}_Army_Card`);
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

        await mergePDFs(selectedFiles, cardSize, true);
    };

    const mergePDFs = async (urls: string[], cardSize: string, debug = false) => {
        if (urls.length === 1) {
            if (debug) console.log('Only one PDF provided, downloading it directly...');
            const blob = await blobCache(`pdf-cache_${urls[0]}`, async () => {
                const response = await axios.get(urls[0], { responseType: 'blob' });
                return response.data;
            });
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
                        const blob = await blobCache(`pdf-cache_${urls[i + j]}`, async () => {
                            const response = await axios.get(urls[i + j], { responseType: 'blob' });
                            return response.data;
                        });
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
        } else {
            // 4x6 or standard logic
            for (let i = 0; i < urls.length; i += 2) {
                if (debug) console.log(`Processing pair: ${urls[i]} and ${urls[i + 1] ? urls[i + 1] : 'N/A'}`);
                const blob1 = await blobCache(`pdf-cache_${urls[i]}`, async () => {
                    const response = await axios.get(urls[i], { responseType: 'blob' });
                    return response.data;
                });
                const pdfArrayBuffer1 = await blobToArrayBuffer(blob1);
                const blob2 = await blobCache(`pdf-cache_${urls[i]}`, async () => {
                    const response = await axios.get(urls[i + 1], { responseType: 'blob' });
                    return response.data;
                });
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

    return (
        <div className="card-gallery">
            <div className="row">
                <div className="col-12 text-center">
                    <button id="download" className="btn btn-primary" onClick={handleDownloadClick}>Download PDF for Print</button>
                </div>
            </div>
            <div className="row pdf-gallery">
                {files.map((card, index) => (
                    <div key={card.id || index} className={gallerySize} >
                        <div className="checkbox-wrapper">
                            <input
                                type="checkbox"
                                className="make-pdf"
                                onChange={() => handleCheckboxChange(card.filePath)}
                            />
                            <label className="label-make-pdf">Add to PDF</label>
                        </div>
                        <a href={card.filePath}>
                            {/*<ImageCache*/}
                            {/*    className="img-fluid"*/}
                            {/*    src={card.thumb}*/}
                            {/*    alt="PDF Thumbnail"*/}
                            {/*    cacheKey={card.thumb}*/}
                            {/*/>*/}
                            <img
                                className="img-fluid"
                                src={card.thumb}
                                alt="PDF Thumbnail"
                            />
                        </a>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CardGallery;

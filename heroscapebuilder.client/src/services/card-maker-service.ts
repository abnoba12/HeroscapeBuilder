import { jsPDF } from "jspdf";
import { PDFDocument } from "pdf-lib";
import { callAddFontArialbd } from '../assets/fonts/arial-bold';
import { callAddFontArial } from '../assets/fonts/arial-normal';
import { callAddFontImpact } from '../assets/fonts/impact-normal';
import { UnitFormData } from '../models/unit-form-data';
import { addPageTwoStandard } from '../services/CardMakerCore/Standard/add-page-two-standard';
import { addPageOne3x5 } from "./CardMakerCore/3x5/add-page-one-3x5";
import { addPageTwo3x5 } from "./CardMakerCore/3x5/add-page-two-3x5";
import { addPageOne4x6 } from "./CardMakerCore/4x6/add-page-one-4x6";
import { addPageTwo4x6 } from "./CardMakerCore/4x6/add-page-two-4x6";
import { addPageOneStandard } from './CardMakerCore/Standard/add-page-one-standard';

export async function generateIndexCard(doc: jsPDF, formData: UnitFormData, size = "4x6") {
    try {
        if (size == "4x6") {
            await addPageOne4x6(formData, doc);
            await addPageTwo4x6(formData, doc);
        } else if (size == "3x5") {
            await addPageOne3x5(formData, doc);
            await addPageTwo3x5(formData, doc);
        } else if (size == "Standard") {
            switch (formData.general) {
                case "Aquilla":
                    await addPageOneStandard(formData, doc, 1, 2, 0.05);
                    await addPageTwoStandard(formData, doc, 2);
                    break;
                case "Einar":
                    await addPageOneStandard(formData, doc, 0, 1);
                    await addPageTwoStandard(formData, doc, 1.5);
                    break;
                case "Jandar":
                    await addPageOneStandard(formData, doc, 0, 1);
                    await addPageTwoStandard(formData, doc, 1.5, -1);
                    break;
                case "Ullar":
                    await addPageOneStandard(formData, doc, 0, 1);
                    await addPageTwoStandard(formData, doc);
                    break;
                case "Utgar":
                    await addPageOneStandard(formData, doc);
                    await addPageTwoStandard(formData, doc);
                    break;
                case "Valkrill":
                    await addPageOneStandard(formData, doc, 0, -2);
                    await addPageTwoStandard(formData, doc, 0, -2);
                    break;
                case "Vydar":
                    await addPageOneStandard(formData, doc, 0, 2.5);
                    await addPageTwoStandard(formData, doc, 0, 0.5);
                    break;
                default:
                    await addPageOneStandard(formData, doc);
                    await addPageTwoStandard(formData, doc);
                    break;
            }
        }
        return doc;
    } catch (error) {
        alert(`Error generating PDF for ${formData.name}, ${error}`);
        throw error;
    }
}

export function initializePDF(size = "4x6"): jsPDF {
    var doc: jsPDF | undefined;
    if (size == "4x6") {
        // Define custom page size
        const pageWidth = 6.25 * 72; // 1 inch = 72 points, 450
        const pageHeight = 4.25 * 72; //306

        doc = new jsPDF({
            orientation: 'landscape',
            unit: 'pt',
            format: [pageWidth, pageHeight] // Set custom page size
        });
    } else if (size == "3x5") {
        // Define custom page size
        const pageWidth = 3.25 * 72; // 1 inch = 72 points
        const pageHeight = 5.25 * 72;

        doc = new jsPDF({
            orientation: 'portrait',
            unit: 'pt',
            format: [pageWidth, pageHeight] // Set custom page size
        });
    } else if (size == "Standard") {
        const pageWidth = 128 * 2.83465; //mm to points
        const pageHeight = 121.5 * 2.83465; //mm to points

        doc = new jsPDF({
            orientation: 'landscape',
            unit: 'pt',
            format: [pageWidth, pageHeight] // Set custom page size
        });
    }

    if (!doc) {
        throw "Unable to inialize JS PDF library";
    }

    // Call the function to register the font
    callAddFontImpact.call(doc);
    callAddFontArial.call(doc);
    callAddFontArialbd.call(doc);

    return doc;
}

export function savePDF(doc: jsPDF, filename: string) {
    return new Promise<void>((resolve, reject) => {
        try {
            // Get the PDF as a Blob
            const pdfBlob = doc.output('blob');
            // Create a download link
            const link = document.createElement('a');
            link.href = URL.createObjectURL(pdfBlob);
            link.download = filename;
            // Append the link to the document
            document.body.appendChild(link);
            // Programmatically click the link to trigger the download
            link.click();
            // Clean up
            document.body.removeChild(link);
            URL.revokeObjectURL(link.href);
            resolve();
        } catch (e) {
            var message = `Error saving file ${filename}`;
            console.error(message, e);
            reject(e);
        }
    });
}

export async function mergePDFs(pdfBlobs: any) {
    const mergedPdf = await PDFDocument.create();

    for (const pdfBlob of pdfBlobs) {
        const pdf = await PDFDocument.load(await pdfBlob.arrayBuffer());
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
    }

    const mergedPdfBytes = await mergedPdf.save();
    return mergedPdfBytes;
}

export function saveMergedPDF(pdfBytes: BlobPart, filename: string) {
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
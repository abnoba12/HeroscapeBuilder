import jsPDF from "jspdf";
import { UnitFormData } from "../../../models/unit-form-data";
import { base64Cache } from "../../cache-manager";
import { DownloadImage, getSizeToMax, loadImage } from "../../image-service";
import { CenterTextInArea, SizeAndCenterText } from "../helpers/text-helper";

export async function addPageTwoPC(formData: UnitFormData, doc: jsPDF) {
    const BASE_IMAGE_PATH = `${import.meta.env.VITE_BASE_IMAGE_PATH}`;

    doc.addPage();

    const drawOutlines = false;
    if (drawOutlines) {
        doc.setLineWidth(1);
        doc.setDrawColor(0, 0, 255);
    }

    const whiteRGB: [number, number, number] = [255, 255, 255];
    const blackRGB: [number, number, number] = [0, 0, 0];

    const unitImageAdvancedSrc = formData.uploadedFiles.find(x => x.filePurpose === "Card_Advanced_Image")?.data;
    const unitAdvanceImg = await loadImage(unitImageAdvancedSrc);
    doc.addImage(unitAdvanceImg, 'PNG', 17, 35, 165, 160);

    // Load the General's image
    const stdImgSrc = `${BASE_IMAGE_PATH}/card-blanks/${formData.general}/${formData.general}_Back_PC.png`
    const stdImg = await base64Cache(stdImgSrc, `${formData.general}_Back_PC.png`);

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Add the General's image to the second page
    doc.addImage(stdImg, 'PNG', 0, 0, pageWidth, pageHeight);

    // Set font for the first page
    doc.setFont('impact', 'normal');
    doc.setTextColor(...whiteRGB); // Set text color to white

    if (formData.general == 'Revna') {
        doc.setTextColor(...blackRGB); // Set text color to black
    } else {
        doc.setTextColor(...whiteRGB); // Set text color to white
    }  

    SizeAndCenterText(doc, formData.name?.toUpperCase(), 12, 54, 17, 125, 16, -1, 2, drawOutlines);

    const statsX = 37;
    const statsY = 249
    const statsXGap = 41;

    doc.setTextColor(...whiteRGB);
    doc.setFontSize(10);
    doc.setFont('arial', 'bold');
    doc.text(formData.basicMove?.toString() || '', statsX, statsY, { align: 'center' });
    doc.text(formData.basicRange?.toString() || '', statsX + (statsXGap * 1), statsY, { align: 'center' });
    doc.text(formData.basicAttack?.toString() || '', statsX + (statsXGap * 2), statsY, { align: 'center' });
    doc.text(formData.basicDefense?.toString() || '', statsX + (statsXGap * 3), statsY, { align: 'center' });

    if (drawOutlines) doc.rect(statsX, statsY, 1, 100);

    if (formData.creator) {
        const creatorImgSrc = `/assets/img/logos/${formData.creator}.png`;
        const creatorImg = await loadImage(await DownloadImage(creatorImgSrc));

        const creatorImgMaxWidth = 153;
        const creatorImgMaxHeight = 12;
        const size = getSizeToMax(creatorImgMaxWidth, creatorImgMaxHeight, creatorImg);

        const creatorX = 23;
        const creatorY = 193;
        const padcreatorX = size?.wPadding ? creatorX + size.wPadding : creatorX;
        const padcreatorY = size?.hPadding ? creatorY + size.hPadding : creatorY;

        if (drawOutlines) doc.rect(padcreatorX, padcreatorY, size?.width || 0, size?.height || 0);

        // Add the new image to the first page                    
        doc.addImage(creatorImg, 'PNG', padcreatorX, padcreatorY, size?.width || 0, size?.height || 0);
    }

    doc.setFontSize(8);
    const setText = `${formData.set?.name}\r\n${formData.unitNumbers} of ${formData.set?.unitsInSet}`;
    CenterTextInArea(doc, setText, 23, 208, 153, 24, 0, 6, drawOutlines, undefined);
}

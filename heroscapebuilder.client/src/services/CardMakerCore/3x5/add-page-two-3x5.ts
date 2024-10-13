import jsPDF from "jspdf";
import { UnitFormData } from "../../../models/unit-form-data";
import { createHTMLImageElementFromBase64, getSizeToMax, loadImage } from "../../image-service";
import { fetchImageWithCache } from "../../image-cache-service";
import { CenterTextInArea, SizeAndCenterText } from "../helpers/text-helper";

export async function addPageTwo3x5(formData: UnitFormData, doc: jsPDF) {
    doc.addPage();

    const drawOutlines = false;
    if (drawOutlines) {
        doc.setLineWidth(1);
        doc.setDrawColor(0, 0, 255);
    }

    var whiteRGB: [number, number, number] = [255, 255, 255];
    //var blackRGB: [number, number, number] = [0, 0, 0];

    const unitImageAdvancedSrc = formData.uploadedFiles.find(x => x.filePurpose === "Card_Advanced_Image")?.data;
    const unitAdvanceImg = await loadImage(unitImageAdvancedSrc);
    doc.addImage(unitAdvanceImg, 'PNG', 8, 148, 217, 217);

    // Load the General's image
    const stdImgSrc = `https://dnqjtsaxybwrurmucsaa.supabase.co/storage/v1/object/public/card_blanks/${formData.general}/${formData.general}Back_3x5.png`
    const stdImg = await fetchImageWithCache(stdImgSrc, `${formData.general}Back_3x5.png`);

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Add the Standard's image to the second page
    doc.addImage(stdImg, 'PNG', 0, 0, pageWidth, pageHeight);

    // Set font for the first page
    doc.setFont('impact', 'normal');
    doc.setTextColor(...whiteRGB); // Set text color to white

    SizeAndCenterText(doc, formData.name?.toUpperCase(), 20, 42, 18, 120, 40, -3, 2, drawOutlines);

    const statsX = 193;
    const statsY = 42.5
    const statsXGap = 8.5;
    const statsYGap = 16.65;
    doc.setFontSize(8);
    doc.setFont('arial', 'bold');
    doc.text(formData.basicMove?.toString() || '', statsX + statsXGap, statsY + (statsYGap * 1), { align: 'center' });
    doc.text(formData.basicRange?.toString() || '', statsX + statsXGap, statsY + (statsYGap * 2), { align: 'center' });
    doc.text(formData.basicAttack?.toString() || '', statsX + statsXGap, statsY + (statsYGap * 3), { align: 'center' });
    doc.text(formData.basicDefense?.toString() || '', statsX + statsXGap, statsY + (statsYGap * 4), { align: 'center' });

    if (drawOutlines) doc.rect(statsX, statsY, 1, 100);

    if (formData.creator) {
        var creatorImgSrc = `/cardGenerator/assets/images/logos/${formData.creator}.png`;
        const creatorImg = await createHTMLImageElementFromBase64(await fetchImageWithCache(creatorImgSrc, `${formData.creator}.png`));

        const creatorImgMaxWidth = 153;
        const creatorImgMaxHeight = 12;
        var size = getSizeToMax(creatorImgMaxWidth, creatorImgMaxHeight, creatorImg);

        const creatorX = 16;
        const creatorY = 83;
        const padcreatorX = size?.wPadding ? creatorX + size.wPadding : creatorX;
        const padcreatorY = size?.hPadding ? creatorY + size.hPadding : creatorY;

        if (drawOutlines) doc.rect(padcreatorX, padcreatorY, size?.width || 0, size?.height || 0);

        // Add the new image to the first page                    
        doc.addImage(creatorImg, 'PNG', padcreatorX, padcreatorY, size?.width || 0, size?.height || 0);
    }

    doc.setFontSize(8);
    var setText = `${formData.set}\r\n${formData.unitNumbers} of ${formData.set?.unitsInSet}`;
    CenterTextInArea(doc, setText, 16, 98, 153, 34, 0, 6, drawOutlines, undefined);
}

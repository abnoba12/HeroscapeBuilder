import jsPDF from "jspdf";
import { UnitFormData } from "../../../models/unit-form-data";
import { createHTMLImageElementFromBase64, getSizeToMax, loadImage } from "../../image-service";
import { fetchImageWithCache } from "../../image-cache-service";
import { CenterTextInArea, SizeAndCenterText } from "../helpers/text-helper";

export async function addPageTwo4x6(formData: UnitFormData, doc: jsPDF) {
    doc.addPage();

    const drawOutlines = false;
    if (drawOutlines) {
        doc.setLineWidth(1);
        doc.setDrawColor(0, 0, 255);
    }

    var whiteRGB: [number, number, number] = [255, 255, 255];
    //var blackRGB: [number, number, number] = [0, 0, 0];

    const unitImageBasicSrc = formData.uploadedFiles.find(x => x.filePurpose === "Card_Basic_Image")?.data;
    const unitBasicImg = await loadImage(unitImageBasicSrc);
    doc.addImage(unitBasicImg, 'PNG', 16, 17.5, 417.5, 271);

    // Load the General's image
    const stdImgSrc = `https://dnqjtsaxybwrurmucsaa.supabase.co/storage/v1/object/public/card_blanks/${formData.general}/${formData.general}Back_4x6.png`;
    const stdImg = await fetchImageWithCache(stdImgSrc, `${formData.general}Back_4x6.png`);

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Add the Standard's image to the second page
    doc.addImage(stdImg, 'PNG', 0, 0, pageWidth, pageHeight);

    // Set font for the second page
    doc.setFont('impact', 'normal');
    doc.setTextColor(...whiteRGB); // Set text color to white

    SizeAndCenterText(doc, formData.name.toUpperCase(), 14, 45, 20, 97, 27, -2, 2, drawOutlines);



    var statsX = 385;
    var statsY = 136.5
    var statsXGap = 27.5;
    var statsYGap = 23.25;

    if (formData.general == "Revna") {
        statsY = 150
        statsYGap = 19.25;
    }

    doc.setFontSize(10);
    doc.setFont('arial', 'bold');
    doc.text(formData.basicMove?.toString() || '', statsX + statsXGap, statsY + (statsYGap * 1), { align: 'center' });
    doc.text(formData.basicRange?.toString() || '', statsX + statsXGap, statsY + (statsYGap * 2), { align: 'center' });
    doc.text(formData.basicAttack?.toString() || '', statsX + statsXGap, statsY + (statsYGap * 3), { align: 'center' });
    doc.text(formData.basicDefense?.toString() || '', statsX + statsXGap, statsY + (statsYGap * 4), { align: 'center' });

    if (formData.creator) {
        // Load the hitbox image
        var creatorImgSrc = `/src/assets/img/logos/${formData.creator}.png`;
        const creatorImg = await createHTMLImageElementFromBase64(await fetchImageWithCache(creatorImgSrc, `${formData.creator}.png`));

        const creatorImgMaxWidth = 76;
        const creatorImgMaxHeight = 12;
        var size = getSizeToMax(creatorImgMaxWidth, creatorImgMaxHeight, creatorImg);

        const creatorX = 261;
        const creatorY = 212;
        const padcreatorX = size?.wPadding ? creatorX + size.wPadding : creatorX;
        const padcreatorY = size?.hPadding ? creatorY + size.hPadding : creatorY;

        if (drawOutlines) doc.rect(padcreatorX, padcreatorY, size?.width || 0, size?.height || 0);

        // Add the new image to the first page                    
        doc.addImage(creatorImg, 'PNG', padcreatorX, padcreatorY, size?.width || 0, size?.height || 0);
    }

    doc.setFontSize(8);
    var setText = `${formData.set}\r\n${formData.unitNumbers} of ${formData.set?.unitsInSet}`;
    CenterTextInArea(doc, setText, 261, 224, 76, 58, 0, 6, drawOutlines, undefined);
}

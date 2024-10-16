import { SizeAndCenterText, CenterTextInArea } from "../helpers/text-helper";
import { loadImage, getSizeToMax, createHTMLImageElementFromBlob } from "../../image-service";
import { UnitFormData } from "../../../models/unit-form-data";
import jsPDF from "jspdf";
import { base64Cache } from "../../cache-manager";

export async function addPageTwoStandard(formData: UnitFormData, doc: jsPDF, GlobalAdjustX = 0, GlobalAdjustY = 0, GlobalYGapAdjust = 0) {
    doc.addPage();

    const drawOutlines = false;
    if (drawOutlines) {
        doc.setLineWidth(1);
        doc.setDrawColor(0, 0, 255);
    }

    var whiteRGB: [number, number, number] = [211, 212, 205];
    var blackRGB: [number, number, number] = [33, 35, 32];

    const unitImageBasicSrc = formData.uploadedFiles.find(x => x.filePurpose === "Card_Basic_Image")?.data;
    const unitBasicImg: HTMLImageElement = await loadImage(unitImageBasicSrc);
    doc.addImage(unitBasicImg, 'PNG', 15 + GlobalAdjustX, 35 + GlobalAdjustY, 334, 242);

    // Load the General's image
    const stdImgSrc = `https://dnqjtsaxybwrurmucsaa.supabase.co/storage/v1/object/public/card_blanks/${formData.general}/${formData.general}Back_EW.png`;
    const stdImg = await base64Cache(stdImgSrc, `${formData.general}Back_EW.png`);

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Add the Standard's image to the second page
    doc.addImage(stdImg, 'PNG', 0, 0, pageWidth, pageHeight);

    // Set font for the second page
    doc.setFont('impact', 'normal');
    doc.setTextColor(...whiteRGB); // Set text color to white

    SizeAndCenterText(doc, formData.name?.toUpperCase(), 14, 84 + GlobalAdjustX, 51 + GlobalAdjustY, 72, 24, -2, 2, drawOutlines);

    const statsX = 233 + GlobalAdjustX;
    const statsY = 178 + GlobalAdjustY;
    const statsXGap = 29;
    const statsYGap = 23.5 + GlobalYGapAdjust;
    doc.setFontSize(8);
    doc.setFont('arial', 'bold');
    doc.text(formData.basicMove?.toString() || '0', statsX + statsXGap, statsY + (statsYGap * 1), { align: 'center' });
    doc.text(formData.basicRange?.toString() || '0', statsX + statsXGap, statsY + (statsYGap * 2), { align: 'center' });
    doc.text(formData.basicAttack?.toString() || '0', statsX + statsXGap, statsY + (statsYGap * 3), { align: 'center' });
    doc.text(formData.basicDefense?.toString() || '0', statsX + statsXGap, statsY + (statsYGap * 4), { align: 'center' });

    doc.setTextColor(...blackRGB); // Set text color to black
    if (formData.creator) {
        const creatorImgSrc = `/src/assets/img/logos/${formData.creator}_dark.png`;
        const response = await fetch(creatorImgSrc);
        const creatorImg = await createHTMLImageElementFromBlob(await response.blob());

        const creatorImgMaxWidth = 76;
        const creatorImgMaxHeight = 8;
        const size = getSizeToMax(creatorImgMaxWidth, creatorImgMaxHeight, creatorImg);

        const creatorX = 250 + GlobalAdjustX;
        const creatorY = 310 + GlobalAdjustY;

        if (drawOutlines) {
            doc.rect(creatorX, creatorY, size?.width || 0, size?.height || 0);
        }

        // Draw the rotated image using the angle parameter in jsPDF
        doc.addImage(creatorImg, 'PNG', creatorX, creatorY, size?.width || 0, size?.height || 0, undefined, 'NONE', 30); // 30 degrees rotation
    }

    doc.setFontSize(6);
    var setText = `${formData.set?.name}\r\n${formData.unitNumbers} of ${formData.set?.unitsInSet}`;
    CenterTextInArea(doc, setText, 80, 240 + GlobalAdjustX, 80 + GlobalAdjustY, 65, 0, 6, drawOutlines, undefined);
}

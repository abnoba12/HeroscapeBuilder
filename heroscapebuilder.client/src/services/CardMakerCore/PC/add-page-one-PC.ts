import jsPDF from "jspdf";
import { UnitFormData } from "../../../models/unit-form-data";
import { base64Cache } from "../../cache-manager";
import { getSizeToMax, loadImage } from "../../image-service";
import { SizeAndCenterAbilities, SizeAndCenterText } from "../helpers/text-helper";

export async function addPageOnePC(formData: UnitFormData, doc: jsPDF) {
    try {
        const BASE_IMAGE_PATH = `${import.meta.env.VITE_BASE_IMAGE_PATH}`;

        if (doc.getNumberOfPages() != 1) {
            doc.addPage();
        }

        const drawOutlines = false;
        if (drawOutlines) {
            doc.setLineWidth(1);
            doc.setDrawColor(0, 0, 255);
        }

        const whiteRGB: [number, number, number] = [255, 255, 255];
        const blackRGB: [number, number, number] = [0, 0, 0];

        const unitImageAdvancedSrc = formData.uploadedFiles.find(x => x.filePurpose === "Card_Advanced_Image")?.data;
        const unitAdvanceImg = await loadImage(unitImageAdvancedSrc);
        doc.addImage(unitAdvanceImg, 'PNG', 18, 35, 83, 83);

        // Load the General's image
        const generalImgSrc = `${BASE_IMAGE_PATH}/card-blanks/${formData.general}/${formData.general}_Front_PC.png`
        const generalImg = await base64Cache(generalImgSrc, `${formData.general}_Front_PC.png`);

        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();

        // Add the General's image to the first page
        doc.addImage(generalImg, 'PNG', 0, 0, pageWidth, pageHeight);

        // Set font for the first page
        doc.setFont('impact', 'normal');

        if (formData.general == 'Revna') {
            doc.setTextColor(...blackRGB); // Set text color to black
        } else {
            doc.setTextColor(...whiteRGB); // Set text color to white
        }       

        SizeAndCenterText(doc, formData.name?.toUpperCase(), 12, 54, 18, 98, 15, -1, 2, drawOutlines);

        doc.setFontSize(14);
        doc.text(formData.points?.toString() || '', 169.5, 33, { align: 'center' });

        // Load the hitbox image
        const hitboxImgSrc = formData.uploadedFiles.find(x => x.filePurpose === "Card_Hitbox_Image")?.data;
        const hitboxImg = await loadImage(hitboxImgSrc);

        const hitboxImgMaxWidth = 24;
        const hitboxImgMaxHeight = 24;
        const size = getSizeToMax(hitboxImgMaxWidth, hitboxImgMaxHeight, hitboxImg);

        const hitboxX = 156;
        const hitboxY = 108;
        const padHitboxX = size?.wPadding ? hitboxX + size.wPadding : hitboxX;
        const padHitboxY = size?.hPadding ? hitboxY + size.hPadding : hitboxY;

        if (drawOutlines) doc.rect(padHitboxX, padHitboxY, size?.width || 0, size?.height || 0);

        // Add the new image to the first page                    
        doc.addImage(hitboxImg, 'PNG', padHitboxX, padHitboxY, size?.width || 0, size?.height || 0);

        const metaFontSize = 8;
        const metaX = 110;
        const metaY = 41;
        const metaWidth = 61;
        const metaHeight = 10;
        const metaYGap = 11;

        doc.setTextColor(...blackRGB);
        SizeAndCenterText(doc, formData.race?.toUpperCase() || '', metaFontSize, metaX, metaY, metaWidth, metaHeight, -1.5, 0, drawOutlines, "left");
        SizeAndCenterText(doc, `${formData.rarity?.toUpperCase()} ${formData.type?.toUpperCase()}`, metaFontSize, metaX, metaY + (metaYGap * 1), metaWidth, metaHeight, -1.5, 0, drawOutlines, "left");
        SizeAndCenterText(doc, formData.role?.toUpperCase() || '', metaFontSize, metaX, metaY + (metaYGap * 2), metaWidth, metaHeight, -1.5, 0, drawOutlines, "left");
        SizeAndCenterText(doc, formData.personality?.toUpperCase() || '', metaFontSize, metaX, metaY + (metaYGap * 3), metaWidth, metaHeight, -1.5, 0, drawOutlines, "left");
        SizeAndCenterText(doc, formData.planet?.toUpperCase() || '', metaFontSize, metaX, metaY + (metaYGap * 4), metaWidth, metaHeight, -1.5, 0, drawOutlines, "left");
        SizeAndCenterText(doc, `${formData.sizeCategory?.toUpperCase()} ${formData.size?.toString()}`, metaFontSize + 3, metaX, metaY + (metaYGap * 5), metaWidth, metaHeight, -1.5, 0, drawOutlines, "left");

        const statsX = 35;
        const statsY = 249
        const statsXGap = 36;
        const lifeXGap = -8;
        const lifeYGap = 1;

        doc.setTextColor(...whiteRGB);
        doc.setFontSize(10);
        doc.setFont('arial', 'bold');
        doc.text(formData.advMove?.toString() || '', statsX, statsY, { align: 'center' });
        doc.text(formData.advRange?.toString() || '', statsX + (statsXGap * 1), statsY, { align: 'center' });
        doc.text(formData.advAttack?.toString() || '', statsX + (statsXGap * 2), statsY, { align: 'center' });
        doc.text(formData.advDefense?.toString() || '', statsX + (statsXGap * 3), statsY, { align: 'center' });
        doc.setFontSize(12);
        doc.setFont('arial', 'bold');
        doc.text(formData.life?.toString() || '', statsX + (statsXGap * 4) + lifeXGap, statsY + lifeYGap, { align: 'center' });

        if (drawOutlines) doc.rect(statsX, statsY, 1, 100);

        // Add text area constraints
        const paddingX = 5;
        const paddingY = 3;
        const textX = 16 + paddingX; // X coordinate for the text area
        const textY = 126 + paddingY; // Y coordinate for the text area
        const textWidth = 166 - (paddingX * 2); // Width of the text area
        const textHeight = 108 - (paddingY * 2); // Height of the text area
        const maxAbilityNameFontSize = 12;
        const maxAbilityTextFontSize = 9.5;
        const abilitySpacing = 0.25;

        doc.setTextColor(...blackRGB); // Set text color to black        
        await SizeAndCenterAbilities(doc, formData, textX, textY, textWidth, textHeight, maxAbilityNameFontSize, maxAbilityTextFontSize, abilitySpacing, drawOutlines);
    } catch (e) {
        const message = `Error building page one for ${formData.name}`;
        console.error(message, e);
        throw e;
    }
}
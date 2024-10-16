import jsPDF from "jspdf";
import { UnitFormData } from "../../../models/unit-form-data";
import { getSizeToMax, loadImage } from "../../image-service";
import { SizeAndCenterAbilities, SizeAndCenterText } from "../helpers/text-helper";
import { base64Cache } from "../../cache-manager";

export async function addPageOne3x5(formData: UnitFormData, doc: jsPDF) {
    try {
        if (doc.getNumberOfPages() != 1) {
            doc.addPage();
        }

        const debug = false;
        if (debug) {
            doc.setLineWidth(1);
            doc.setDrawColor(0, 0, 255);
        }

        var whiteRGB: [number, number, number] = [255, 255, 255];
        var blackRGB: [number, number, number] = [0, 0, 0];

        const unitImageAdvancedSrc = formData.uploadedFiles.find(x => x.filePurpose === "Card_Advanced_Image")?.data;
        const unitAdvanceImg = await loadImage(unitImageAdvancedSrc);
        doc.addImage(unitAdvanceImg, 'PNG', 13, 63, 109, 109);

        // Load the General's image
        const generalImgSrc = `https://dnqjtsaxybwrurmucsaa.supabase.co/storage/v1/object/public/card_blanks/${formData.general}/${formData.general}Front_3x5.png`
        const generalImg = await base64Cache(generalImgSrc, `${formData.general}Front_3x5.png`);

        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();

        // Add the General's image to the first page
        doc.addImage(generalImg, 'PNG', 0, 0, pageWidth, pageHeight);

        // Set font for the first page
        doc.setFont('impact', 'normal');
        doc.setTextColor(...whiteRGB); // Set text color to white

        SizeAndCenterText(doc, formData.name?.toUpperCase(), 20, 42, 18, 120, 40, -3, 2, debug);

        // Load the hitbox image
        var hitboxImgSrc = formData.uploadedFiles.find(x => x.filePurpose === "Card_Hitbox_Image")?.data;
        const hitboxImg = await loadImage(hitboxImgSrc);

        const hitboxImgMaxWidth = 38;
        const hitboxImgMaxHeight = 38;
        var size = getSizeToMax(hitboxImgMaxWidth, hitboxImgMaxHeight, hitboxImg);

        const hitboxX = 175;
        const hitboxY = 19;
        const padHitboxX = size?.wPadding ? hitboxX + size.wPadding : hitboxX;
        const padHitboxY = size?.hPadding ? hitboxY + size.hPadding : hitboxY;

        if (debug) doc.rect(padHitboxX, padHitboxY, size?.width || 0, size?.height || 0);

        // Add the new image to the first page                    
        doc.addImage(hitboxImg, 'PNG', padHitboxX, padHitboxY, size?.width || 0, size?.height || 0);

        var metaFontSize = 9;
        var metaX = 122.5;
        var metaY = 65;
        var metaWidth = 61;
        var metaHeight = 15;
        var metaYGap = 18.18;
        SizeAndCenterText(doc, formData.race?.toUpperCase() || '', metaFontSize, metaX, metaY, metaWidth, metaHeight, -1.5, 0, debug, "left");
        SizeAndCenterText(doc, `${formData.rarity?.toUpperCase()} ${formData.type?.toUpperCase()}`, metaFontSize, metaX - 3, metaY + (metaYGap * 1), metaWidth, metaHeight, -1.5, 0, debug, "left");
        SizeAndCenterText(doc, formData.role?.toUpperCase() || '', metaFontSize, metaX - 5, metaY + (metaYGap * 2), metaWidth, metaHeight, -1.5, 0, debug, "left");
        SizeAndCenterText(doc, formData.personality?.toUpperCase() || '', metaFontSize, metaX - 5.5, metaY + (metaYGap * 3), metaWidth, metaHeight, -1.5, 0, debug, "left");
        SizeAndCenterText(doc, formData.planet?.toUpperCase() || '', metaFontSize, metaX - 4, metaY + (metaYGap * 4), metaWidth, metaHeight, -1.5, 0, debug, "left");
        SizeAndCenterText(doc, `${formData.sizeCategory?.toUpperCase()} ${formData.size?.toString()}`, metaFontSize + 3, metaX - 0.5, metaY + (metaYGap * 5), metaWidth, metaHeight, -1.5, 0, debug, "left");

        var statsX = 201.5;
        var statsY = 78
        var statsXGap = 8.5;
        var statsYGap = 16.65;
        var lifeYGap = 1.5
        var pointsYGap = -0.5

        if (formData.general == "Revna") {
            statsY = 82;
            statsYGap = 13.1;
            lifeYGap = 7;
            pointsYGap = 3
        }

        doc.setFontSize(10);
        doc.setFont('arial', 'bold');
        doc.text(formData.life?.toString() || '', statsX, statsY, { align: 'center' });

        doc.setFontSize(8);
        doc.setFont('arial', 'bold');
        doc.text(formData.advMove?.toString() || '', statsX + statsXGap, statsY + (statsYGap * 1) + lifeYGap, { align: 'center' });
        doc.text(formData.advRange?.toString() || '', statsX + statsXGap, statsY + (statsYGap * 2) + lifeYGap, { align: 'center' });
        doc.text(formData.advAttack?.toString() || '', statsX + statsXGap, statsY + (statsYGap * 3) + lifeYGap, { align: 'center' });
        doc.text(formData.advDefense?.toString() || '', statsX + statsXGap, statsY + (statsYGap * 4) + lifeYGap, { align: 'center' });

        if (formData.general == "Jandar") {
            doc.setTextColor(...blackRGB); // Set text color to black
        }
        doc.text(formData.points?.toString() || '', statsX, statsY + (statsYGap * 5) + pointsYGap + lifeYGap, { align: 'center' });

        if (debug) doc.rect(statsX, statsY, 1, 100);

        // Add text area constraints
        const paddingX = 5;
        const paddingY = 3;
        const textX = 14 + paddingX; // X coordinate for the text area
        const textY = 170 + paddingY; // Y coordinate for the text area
        const textWidth = 206 - (paddingX * 2); // Width of the text area
        const textHeight = 192 - (paddingY * 2); // Height of the text area
        let maxAbilityNameFontSize = 12;
        let maxAbilityTextFontSize = 9.5;
        let abilitySpacing = 1;

        doc.setTextColor(...blackRGB); // Set text color to black        
        await SizeAndCenterAbilities(doc, formData, textX, textY, textWidth, textHeight, maxAbilityNameFontSize, maxAbilityTextFontSize, abilitySpacing, debug);
    } catch (e) {
        var message = `Error building page one for ${formData.name}`;
        console.error(message, e);
        throw e;
    }
}
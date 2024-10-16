import jsPDF from "jspdf";
import { UnitFormData } from "../../../models/unit-form-data";
import { createHTMLImageElementFromBase64, getSizeToMax, loadImage } from "../../image-service";
import { SizeAndCenterAbilities, SizeAndCenterText } from "../helpers/text-helper";
import { base64Cache } from "../../cache-manager";

export async function addPageOne4x6(formData: UnitFormData, doc: jsPDF) {
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

        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();

        const unitImageAdvancedSrc = formData.uploadedFiles.find(x => x.filePurpose === "Card_Advanced_Image")?.data;
        const unitAdvanceImg = await loadImage(unitImageAdvancedSrc);
        doc.addImage(unitAdvanceImg, 'PNG', 259, 17, 174.5, 177.5);

        // Load the General's image
        const generalImgSrc = `https://dnqjtsaxybwrurmucsaa.supabase.co/storage/v1/object/public/card_blanks/${formData.general}/${formData.general}Front_4x6.png`
        const generalImg = await base64Cache(generalImgSrc, `${formData.general}Front_4x6.png`);

        // Add the General's image to the first page
        doc.addImage(generalImg, 'PNG', 0, 0, pageWidth, pageHeight);

        // Set font for the first page
        doc.setFont('impact', 'normal');
        doc.setTextColor(...whiteRGB); // Set text color to white

        SizeAndCenterText(doc, formData.name?.toUpperCase(), 14, 45, 20, 97, 27, -2, 2, debug);

        if (debug) doc.rect(45, 20, 97, 27);

        SizeAndCenterText(doc, formData.race?.toUpperCase() || '', 6.75, 47.5, 52.5, 46, 12, -1.5, 0, debug);
        SizeAndCenterText(doc, formData.role?.toUpperCase() || '', 6.75, 98.5, 52.5, 46, 12, -1.5, 0, debug);
        SizeAndCenterText(doc, formData.personality?.toUpperCase() || '', 6.75, 47.5, 68.5, 46, 12, -1.5, 0, debug);
        SizeAndCenterText(doc, formData.planet?.toUpperCase() || '', 6.75, 98.5, 68.5, 46, 12, -1.5, 0, debug);


        var statsX = 385;
        var statsY = 136
        var statsXGap = 27.5;
        var statsYGap = 23.25;
        var lifeYGap = 0
        var pointsYGap = 0

        if (formData.general == "Revna") {
            statsY = 146
            statsYGap = 19.25;
            lifeYGap = 5;
            pointsYGap = -3
        }

        doc.setFontSize(14);
        doc.setFont('arial', 'bold');
        doc.text(formData.life?.toString() || '', statsX, statsY, { align: 'center' });
        doc.setFontSize(10);
        doc.setFont('arial', 'bold');
        doc.text(formData.advMove?.toString() || '', statsX + statsXGap, statsY + (statsYGap * 1) + lifeYGap, { align: 'center' });
        doc.text(formData.advRange?.toString() || '', statsX + statsXGap, statsY + (statsYGap * 2) + lifeYGap, { align: 'center' });
        doc.text(formData.advAttack?.toString() || '', statsX + statsXGap, statsY + (statsYGap * 3) + lifeYGap, { align: 'center' });
        doc.text(formData.advDefense?.toString() || '', statsX + statsXGap, statsY + (statsYGap * 4) + lifeYGap, { align: 'center' });

        // if (drawOutlines) doc.rect(statsX, 160.5, 1, 230.5 - 160.5);

        if (formData.general == "Jandar") {
            doc.setTextColor(...blackRGB); // Set text color to black
        }

        doc.text(formData.points?.toString() || '', statsX, statsY + (statsYGap * 5) + lifeYGap + pointsYGap, { align: 'center' });

        // Load the unit type image
        var unitTypeImgSrc = `https://dnqjtsaxybwrurmucsaa.supabase.co/storage/v1/object/public/card_blanks/${formData.rarity}${formData.type}.png`;
        const unitTypeImg = await createHTMLImageElementFromBase64(await base64Cache(unitTypeImgSrc, `${formData.rarity}${formData.type}.png`));

        const unitTypeImgWidth = 48;
        const aspectRatio = unitTypeImg.height / unitTypeImg.width;
        const unitTypeImgHeight = unitTypeImgWidth * aspectRatio;
        const unitTypeImgX = 149;
        const unitTypeImgY = 15;

        if (debug) doc.rect(unitTypeImgX, unitTypeImgY, unitTypeImgWidth, unitTypeImgHeight);

        // Add the new image to the first page                    
        doc.addImage(unitTypeImg, 'PNG', unitTypeImgX, unitTypeImgY, unitTypeImgWidth, unitTypeImgHeight);

        // Load the unit size image
        var unitSizeImgSrc = `https://dnqjtsaxybwrurmucsaa.supabase.co/storage/v1/object/public/card_blanks/${formData.sizeCategory}.png`;
        const unitSizeImg = await createHTMLImageElementFromBase64(await base64Cache(unitSizeImgSrc, `${formData.sizeCategory}.png`));

        const unitSizeImgWidth = 48;
        const unitSizeAspectRatio = unitSizeImg.height / unitSizeImg.width;
        const unitsizeImgHeight = unitSizeImgWidth * unitSizeAspectRatio;
        const unitsizeX = 199;
        const unitsizeY = 18

        if (debug) doc.rect(unitsizeX, unitsizeY, unitSizeImgWidth, unitsizeImgHeight);

        // Add the new image to the first page                    
        doc.addImage(unitSizeImg, 'PNG', unitsizeX, unitsizeY, unitSizeImgWidth, unitsizeImgHeight);

        doc.setFontSize(10);
        doc.setFont('impact', 'normal');
        doc.setTextColor(...blackRGB); // Set text color to black
        doc.text(formData.size?.toString() || '', 223, 35.25, { align: 'center' });

        // Load the hitbox image
        var hitboxImgSrc = formData.uploadedFiles.find(x => x.filePurpose === "Card_Hitbox_Image")?.data;
        const hitboxImg = await loadImage(hitboxImgSrc);

        const hitboxImgMaxWidth = 70;
        const hitboxImgMaxHeight = 72;
        var size = getSizeToMax(hitboxImgMaxWidth, hitboxImgMaxHeight, hitboxImg);

        const hitboxX = 265;
        const hitboxY = 211;
        const padHitboxX = size?.wPadding ? hitboxX + size.wPadding : hitboxX;
        const padHitboxY = size?.hPadding ? hitboxY + size.hPadding : hitboxY;

        if (debug) doc.rect(padHitboxX, padHitboxY, size?.width || 0, size?.height || 0);

        // Add the new image to the first page                    
        doc.addImage(hitboxImg, 'PNG', padHitboxX, padHitboxY, size?.width || 0, size?.height || 0);

        // Add text area constraints
        const textX = 23; // X coordinate for the text area
        const textY = 87; // Y coordinate for the text area
        const textWidth = 221; // Width of the text area
        const textHeight = 200; // Height of the text area
        let maxAbilityNameFontSize = 12;
        let maxAbilityTextFontSize = 9.5;
        let abilitySpacing = 1;
        await SizeAndCenterAbilities(doc, formData, textX, textY, textWidth, textHeight, maxAbilityNameFontSize, maxAbilityTextFontSize, abilitySpacing, debug);
    } catch (e) {
        var message = `Error building page one for ${formData.name}`;
        console.error(message, e);
        throw e;
    }
}
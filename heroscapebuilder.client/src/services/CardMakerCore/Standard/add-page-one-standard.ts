import jsPDF from "jspdf";
import { UnitFormData } from "../../../models/unit-form-data";
import { loadImage, getSizeToMax } from "../../image-service.js";
import { SizeAndCenterAbilities, SizeAndCenterText } from "../helpers/text-helper.js"
import { base64Cache } from "../../cache-manager.js";

export async function addPageOneStandard(formData: UnitFormData, doc: jsPDF, GlobalAdjustX = 0, GlobalAdjustY = 0, GlobalYGapAdjust = 0) {
    try {
        if (doc.getNumberOfPages() != 1) {
            doc.addPage();
        }

        const debug = false;
        if (debug) {
            doc.setLineWidth(1);
            doc.setDrawColor(0, 0, 255);
        }

        var whiteRGB: [number, number, number] = [211, 212, 205];
        var blackRGB: [number, number, number] = [33, 35, 32];

        // var coverX = 105; //174;
        // var coverY = 14;
        // var coverWidth = 253 //115;
        // var coverHeight = 253;
        // const unitImageAdvancedCoverSrc = `https://dnqjtsaxybwrurmucsaa.supabase.co/storage/v1/object/public/card_blanks/${formData.general}/${formData.general}Cover.png`;
        //https://dnqjtsaxybwrurmucsaa.supabase.co/storage/v1/object/public/card_blanks/UniqueSquad.png
        // const unitAdvanceImgCover = await loadImage(unitImageAdvancedCoverSrc);
        // doc.addImage(unitAdvanceImgCover, 'PNG', coverX, coverY, coverWidth, coverHeight);

        const unitImageAdvancedSrc = formData.uploadedFiles.find(x => x.filePurpose === "Card_Advanced_Image")?.data;
        const unitAdvanceImg:HTMLImageElement = await loadImage(unitImageAdvancedSrc);

        const unitAdvanceImgMaxWidth = 256; //110;
        const unitAdvanceImgMaxHeight = 256;
        var unitAdvSize = getSizeToMax(unitAdvanceImgMaxWidth, unitAdvanceImgMaxHeight, unitAdvanceImg);

        const unitAdvX = 104 + GlobalAdjustX; //180;
        const unitAdvY = 11 + GlobalAdjustY;
        const padunitAdvX = unitAdvSize?.wPadding ? unitAdvX + unitAdvSize.wPadding : unitAdvX;
        const padunitAdvY = unitAdvSize?.hPadding ? unitAdvY + unitAdvSize.hPadding : unitAdvY;

        // Add the new image to the first page                    
        doc.addImage(unitAdvanceImg, 'PNG', padunitAdvX, padunitAdvY, unitAdvSize?.width || 0, unitAdvSize?.height || 0);

        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();

        // const unitImageAdvancedSrc = formData.unitImageAdvanced;
        // const unitAdvanceImg = await loadImage(unitImageAdvancedSrc);
        // doc.addImage(unitAdvanceImg, 'PNG', 173, 14, 117, 253);

        // Load the General's image
        const generalImgSrc = `https://dnqjtsaxybwrurmucsaa.supabase.co/storage/v1/object/public/card_blanks/${formData.general}/${formData.general}Front_EW.png`;
        const generalImg = await base64Cache(generalImgSrc, `${formData.general}Front_EW.png`);

        // Add the General's image to the first page
        doc.addImage(generalImg, 'PNG', 0, 0, pageWidth, pageHeight);

        // if (debug) doc.rect(coverX, coverY, coverWidth, coverHeight);
        if (debug) doc.rect(padunitAdvX, padunitAdvY, unitAdvSize?.width || 0, unitAdvSize?.height || 0);

        // Set font for the first page
        doc.setFont('impact', 'normal');
        doc.setTextColor(...whiteRGB); // Set text color to white

        SizeAndCenterText(doc, formData.name?.toUpperCase(), 14, 84 + GlobalAdjustX, 51 + GlobalAdjustY, 72, 24, -2, 2, debug);

        var metaFontSize = 6;
        var metaX = 20 + GlobalAdjustX;
        var metaY = 136.5 + GlobalAdjustY;
        var metaWidth = 50;
        var metaHeight = 10;
        var metaYGap = 12.1 + GlobalYGapAdjust;
        SizeAndCenterText(doc, formData.race?.toUpperCase() || "", metaFontSize, metaX, metaY, metaWidth, metaHeight, -1.5, 0, debug, "right");
        SizeAndCenterText(doc, `${formData.rarity?.toUpperCase()} ${formData.type?.toUpperCase()}`, metaFontSize, metaX + 1, metaY + (metaYGap * 1), metaWidth, metaHeight, -1.5, 0, debug, "right");
        SizeAndCenterText(doc, formData.role?.toUpperCase() || "", metaFontSize, metaX + 2, metaY + (metaYGap * 2), metaWidth, metaHeight, -1.5, 0, debug, "right");
        SizeAndCenterText(doc, formData.personality?.toUpperCase() || "", metaFontSize, metaX + 2, metaY + (metaYGap * 3), metaWidth, metaHeight, -1.5, 0, debug, "right");
        SizeAndCenterText(doc, `${formData.sizeCategory?.toUpperCase()} ${formData.size}`, metaFontSize + 3, metaX + 1, metaY + (metaYGap * 4), metaWidth, metaHeight, -1.5, 0, debug, "right");

        doc.setFontSize(10);
        const statsX = 235 + GlobalAdjustX;
        const statsY = 177 + GlobalAdjustY;
        const statsXGap = 29;
        const statsYGap = 23.4 + GlobalYGapAdjust;
        doc.setFont('arial', 'bold');
        doc.text((formData.life?.toString() || '0'), statsX, statsY - 2.5, { align: 'center' });

        doc.setFontSize(8);
        doc.setFont('arial', 'bold');
        doc.text((formData.advMove?.toString() || '0'), statsX + statsXGap, statsY + (statsYGap * 1), { align: 'center' });
        doc.text((formData.advRange?.toString() || '0'), statsX + statsXGap, statsY + (statsYGap * 2), { align: 'center' });
        doc.text((formData.advAttack?.toString() || '0'), statsX + statsXGap, statsY + (statsYGap * 3), { align: 'center' });
        doc.text((formData.advDefense?.toString() || '0'), statsX + statsXGap, statsY + (statsYGap * 4), { align: 'center' });

        if (formData.general == "Jandar") {
            doc.setTextColor(...blackRGB); // Set text color to black
        }
        doc.text((formData.points?.toString() || '0'), statsX, statsY + (statsYGap * 5) + 1, { align: 'center' });

        if (debug) doc.rect(statsX, statsY, 1, 100);

        // Load the hitbox image
        var hitboxImgSrc = formData.uploadedFiles.find(x => x.filePurpose === "Card_Hitbox_Image")?.data;
        const hitboxImg = await loadImage(hitboxImgSrc);

        const hitboxImgMaxWidth = 53;
        const hitboxImgMaxHeight = 60;
        var size = getSizeToMax(hitboxImgMaxWidth, hitboxImgMaxHeight, hitboxImg);

        const hitboxX = 293 + GlobalAdjustX;
        const hitboxY = 140 + GlobalAdjustY;
        const padHitboxX = size?.wPadding ? hitboxX + size.wPadding : hitboxX;
        const padHitboxY = size?.hPadding ? hitboxY + size.hPadding : hitboxY;

        if (debug) doc.rect(padHitboxX, padHitboxY, size?.width || 0, size?.height || 0);

        // Add the new image to the first page                    
        doc.addImage(hitboxImg, 'PNG', padHitboxX, padHitboxY, size?.width || 0, size?.height || 0);

        doc.setTextColor(...blackRGB); // Set text color to black
        // Add text area constraints
        const textX = 81 + GlobalAdjustX; // X coordinate for the text area
        const textY = 85 + GlobalAdjustY; // Y coordinate for the text area
        const textWidth = 90; // Width of the text area
        const textHeight = 217; // Height of the text area
        let maxAbilityNameFontSize = 9;
        let maxAbilityTextFontSize = 7.5;
        let abilitySpacing = 0.75;

        await SizeAndCenterAbilities(doc, formData, textX, textY, textWidth, textHeight, maxAbilityNameFontSize, maxAbilityTextFontSize, abilitySpacing, debug);
    } catch (e) {
        var message = `Error building page one for ${formData.name}`;
        console.error(message, e);
        throw e;
    }
}
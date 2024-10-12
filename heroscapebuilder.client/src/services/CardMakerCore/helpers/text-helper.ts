import jsPDF, { TextOptionsLight } from "jspdf";
import { UnitFormData } from "../../../models/unit-form-data";
import { Ability } from "../../../models/ability";

const lineHeightOffset = 1.15;

export function SizeAndCenterText(doc: jsPDF, text: string, fontSize: number, areaX: number, areaY: number, areaWidth: number, areaHeight: number, yOffset = 0, padding = 0, drawOutlines = false, align = "center") {
    try {
        SizeText(doc, text, fontSize, areaWidth, areaHeight, padding = 0);
        CenterTextInArea(doc, text, areaX, areaY, areaWidth, areaHeight, yOffset, padding, drawOutlines, align);
    } catch (e) {
        var message = `Error sizing text: ${text}`;
        console.error(message, e);
        throw e;
    }
}

export function SizeText(doc: jsPDF, text: string, fontSize: number, areaWidth: number, areaHeight: number, padding = 0) {
    try {
        var notFit = true;
        while (notFit) {
            doc.setFontSize(fontSize);
            const words = text.split(" ");
            const wrappedText = doc.splitTextToSize(text, areaWidth - padding);
            const lineHeight = fontSize * lineHeightOffset; // You might need to adjust this value based on your font size
            const textHeight = wrappedText.length * lineHeight;

            //Too large, reduce the font size by 0.1pt
            if (textHeight > areaHeight) {
                fontSize -= 0.1;
            } else {
                //Heigh fits now check the width.
                for (let i = 0; i < words.length; i++) {
                    var textWidth = doc.getTextWidth(words[i]);
                    if (textWidth > areaWidth - padding) {
                        fontSize -= 0.1;
                    } else {
                        notFit = false;
                    }
                }
            }

        }
    } catch (e) {
        var message = `Error sizing text: ${text}`;
        console.error(message, e);
        throw e;
    }
}

export function CenterTextInArea(doc: jsPDF, text: string, areaX: number, areaY: number, areaWidth: number, areaHeight: number, yOffset = 0, padding = 0, drawOutlines = false, align: "center" | "left" | "right" | "justify" | undefined) {
    try {
        // console.log(`text: ${text}, areaX: ${areaX}, areaY: ${areaY}, areaWidth: ${areaWidth}, areaHeight: ${areaHeight}, padding: ${padding}`);

        const wrappedText = doc.splitTextToSize(text, areaWidth - padding); // Adjust width to account for padding

        // Calculate the height of the text block
        const fontSize = doc.getFontSize();
        const lineHeight = fontSize * lineHeightOffset; // You might need to adjust this value based on your font size
        const lines = wrappedText.length;
        const textTotalHeight = lines * lineHeight;
        const textMiddleY = textTotalHeight / 2;
        const areaMiddleY = areaHeight / 2;
        const shiftTextDownBy = areaMiddleY - textMiddleY;

        var textY = areaY + lineHeight + shiftTextDownBy + yOffset;

        // // Calculate the starting positions to center the text
        const areaCenterX = areaX + (areaWidth / 2);

        // console.log(`lineHeight: ${lineHeight}, textHeight: ${textTotalHeight}, topOffset: ${topOffset}, textY: ${textY}`);

        if (drawOutlines) {
            // Draw the rectangle (for visualization)
            doc.setLineWidth(1);

            doc.setDrawColor(255, 0, 0); //Bottom of text
            doc.rect(areaCenterX, textY, 20, .1);

            // doc.setDrawColor(0, 255, 0); //Green center of area
            // doc.rect(areaX, areaCenterY, areaWidth, .1);

            doc.setDrawColor(0, 0, 255); //Blue Area outline
            doc.rect(areaX, areaY, areaWidth, areaHeight);
        }

        var xPlacement = areaCenterX;
        if (align == "left") {
            xPlacement = areaX;
        }
        if (align == "right") {
            xPlacement = areaX + areaWidth;
        }
        if (!align) {
            align = 'center';
        }
        doc.text(wrappedText, xPlacement, textY, { align: align as "center" | "left" | "right" | "justify" | undefined } as TextOptionsLight);
    } catch (e) {
        var message = `Error centering text: ${text}`;
        console.error(message, e);
        throw e;
    }
}

export async function SizeAndCenterAbilities(doc: jsPDF, formData: UnitFormData, constraintsX: number, constraintsY: number, constraintsWidth: number, constraintsHeight: number, nameMaxFontSize: number, textMaxFontSize: number, abilitySpacing = 1, debug = false) {
    try {
        if (debug) console.log(`Unit: ${formData.name}`);
        // Draw border
        if (debug) doc.rect(constraintsX, constraintsY, constraintsWidth, constraintsHeight);
        let currentY: number = constraintsY;

        formData.abilities = combineAbilityText(formData.abilities, formData.condenseAbilities);

        const fontSizeReductionIncriment = 0.01;
        var write = false;
        while (true) {
            currentY = constraintsY; // Reset currentY to the start of the text area

            for (let i = 0; i < formData.abilities.length; i++) {
                const ability = formData.abilities[i];

                if (debug) doc.setDrawColor(Math.floor(Math.random() * 256), Math.floor(Math.random() * 256), Math.floor(Math.random() * 256));

                // Add an empty line before each new ability name for visual separation
                if (i > 0) {
                    currentY += ((nameMaxFontSize * lineHeightOffset) * abilitySpacing);
                }

                // Ability Name
                doc.setFont('impact', 'normal');
                doc.setFontSize(nameMaxFontSize);
                let abilityNameLines = doc.splitTextToSize(ability.abilityName?.toUpperCase() || "", constraintsWidth);
                const abilityNameHeight = abilityNameLines.length * (nameMaxFontSize * lineHeightOffset);
                if (write) {
                    doc.text(abilityNameLines, constraintsX, currentY + (nameMaxFontSize * lineHeightOffset), { align: 'left' });
                    if (debug) doc.rect(constraintsX, currentY, constraintsWidth, abilityNameHeight);
                    if (debug) console.log(`Writing the ability: ${ability.abilityName?.toUpperCase()}`);
                }
                currentY += abilityNameHeight;

                // Ability Text
                doc.setFont('arial', 'bold');
                doc.setFontSize(textMaxFontSize);
                let abilityTextLines = doc.splitTextToSize(ability.ability || "", constraintsWidth);
                const abilityTextHeight = abilityTextLines.length * (textMaxFontSize * lineHeightOffset);
                if (write) {
                    doc.text(abilityTextLines, constraintsX, currentY + (textMaxFontSize * lineHeightOffset), { align: 'left' });
                    if (debug) doc.rect(constraintsX, currentY, constraintsWidth, abilityTextHeight);
                }
                currentY += abilityTextHeight;
            }
            if (write) break;

            const constraintBottom = (constraintsY + constraintsHeight);
            currentY = currentY;
            if (currentY > constraintBottom) {
                nameMaxFontSize = nameMaxFontSize - fontSizeReductionIncriment;
                textMaxFontSize = textMaxFontSize - fontSizeReductionIncriment;
                if (debug) console.log(`Text is too large. Shrinking fonts, Name: ${nameMaxFontSize}pt, Text: ${textMaxFontSize}pt. Text Bottom: ${currentY}, Constraints Bottom: ${constraintBottom}`);
            } else {
                if (debug) console.log(`Found proper size. Text Bottom: ${currentY}, Constraints Bottom: ${constraintBottom}, difference: ${constraintBottom - currentY}`);
                write = true;
            }
        }
    } catch (e) {
        var message = `Error sizing and centering ability text.`;
        console.error(message, e);
        throw e;
    }
}

function combineAbilityText(abilities: Ability[], condense: boolean) {
    const commonAbilities = ["flying", "disengage", "counter strike", "stealth flying", "slither", "double attack", "lava resistant"];

    //Turn stealth flying into its composite abilities "flying" and "disengage".
    if (condense && abilities.map(x => x.abilityName?.toLowerCase()).includes("stealth flying")) {
        abilities = abilities.filter(ability => ability.abilityName?.toLowerCase() !== "stealth flying");
        abilities.push({
            abilityName: "Flying, Disengage",
            ability: "",
            id: 0,
            armyCardId: 0
        })
    }

    // Turn any common ability into just its name and remove the ability text
    if (condense) {
        for (let i = 0; i < abilities.length; i++) {
            if (commonAbilities.includes(abilities[i].abilityName?.toLowerCase() || '')) {
                abilities[i].ability = undefined;
            }
        }
    }

    let nonEmptyText = abilities.filter(item => item.ability);
    let emptyText = abilities.filter(item => !item.ability);

    // Combine names of empty text objects
    if (emptyText.length > 0) {
        let combinedNames = emptyText.map(item => item.abilityName).join(", ");

        // Add the new object with combined names to the array
        nonEmptyText.unshift({
            abilityName: combinedNames,
            ability: "",
            id: 0,
            armyCardId: 0
        });
    }

    return nonEmptyText;
}

export function toStandardCase(text: string) {
    return text.toLowerCase().replace(/\b\w/g, function (char) {
        return char.toUpperCase();
    });
}
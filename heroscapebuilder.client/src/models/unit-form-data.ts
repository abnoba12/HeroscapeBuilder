import { Unit } from "./unit";
import { UnitFormFile } from "./unit-form-file";

export interface UnitFormData extends Omit<Unit, 'slug'> {
    /** The single points value printed on the card. */
    points?: number;

    condenseAbilities: boolean;

    uploadedFiles: UnitFormFile[];
}

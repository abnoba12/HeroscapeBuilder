import { Unit } from "./unit";
import { UnitFormFile } from "./unit-form-file";

export interface UnitFormData extends Unit {
    condenseAbilities: boolean;

    uploadedFiles: UnitFormFile[];
}

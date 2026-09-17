export interface UnitFile {
    id: number;
    fileName: string;
    filePurpose: string;
    filePath: string;
    thumb: string;
    unitName?: string | null;
    creator?: string | null;
    createdAt: Date;
}

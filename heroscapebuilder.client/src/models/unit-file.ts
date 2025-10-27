export interface UnitFile {
    id: number;
    fileName: string;
    filePurpose: string;
    filePath: string;
    thumb: string;
    unitName?: string | null;
    createdAt: Date;
}

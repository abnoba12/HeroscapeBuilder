import { saveAs } from 'file-saver';
import JSZip from "jszip";
import { UnitFile } from '../models/unit-file';
import { blobCache, GetAPIDataWithCache } from './cache-manager';
import { debounce } from './debounce';
import { getToken, hasRole } from './authService';
import AxiosSingletonService from './AxiosSingletonService';

const api = AxiosSingletonService.getInstance();

export const getFilesByPurpose = debounce(async (purpose:string) => {
    try {
        return await GetAPIDataWithCache<UnitFile[]>(`/File/GetFilesByPurpose?purpose=${purpose}`, `/File?purpose=${purpose}`, 240);
    } catch (error) {
        console.error('Error fetching files:', error);
        throw error;
    }
});

// Function to read the CSV file
export function readCSVFile(file: Blob) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            resolve(event.target?.result);
        };
        reader.onerror = (error) => {
            reject(error);
        };
        reader.readAsText(file);
    });
}

function getMimeType(filename: string | undefined) {
    if (!filename) {
        return 'application/octet-stream'; // Fallback if filename is undefined
    }

    const extension = filename.split('.').pop()?.toLowerCase();

    const mimeTypes: Record<string, string> = {
        'jpg': 'image/jpeg',
        'jpeg': 'image/jpeg',
        'png': 'image/png',
        'gif': 'image/gif',
        'svg': 'image/svg+xml',
        // Add other MIME types as needed
    };

    // Ensure extension is not undefined before accessing mimeTypes
    return extension ? mimeTypes[extension] || 'application/octet-stream' : 'application/octet-stream';
}


// Function to read the ZIP file
export async function readZipFile(file: any) {
    try {
        const zip = new JSZip();
        const zipContent = await zip.loadAsync(file);
        const files: Record<string, Blob> = {}; // Explicitly define the type of `files`

        for (const filepath of Object.keys(zipContent.files)) {
            const filename = filepath.split('/').pop(); // Get the file name without directory

            // Skip if filename is undefined or empty
            if (!filename) continue;

            const fileContent = await zipContent.files[filepath].async('blob');
            const mimeType = getMimeType(filename);
            const typedBlob = new Blob([fileContent], { type: mimeType });

            files[filename] = typedBlob; // Safely use filename as an index
        }

        return files;
    } catch (e) {
        const message = `Error reading zip file ${file}`;
        console.error(message, e);
        throw e;
    }
}

// Function to download all files as a zip file
export async function downloadAllAsZip(files: any, zipName: any) {
    const zip = new JSZip();

    for (const file of files) {
        const fileName = file.split('/').pop();
        const blob = await blobCache(fileName, `pdf-cache_${fileName}`);
        zip.file(fileName, blob);
    }

    const content = await zip.generateAsync({ type: 'blob' });
    saveAs(content, zipName);
}

export async function AddFileToUnit(file: Blob, armyCardId: string, filePurpose: string, fileName: string) {
    if (hasRole("Admin")) {
        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await api.put(`/File/AddFileToUnit`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    "Authorization": `Bearer ${getToken()}`
                },
                params: {
                    armyCardId,
                    filePurpose,
                    fileName
                }
            });

            console.log(`Uploaded ${filePurpose} file successfully:`, response.data);
        } catch (error) {
            console.error("Error uploading file:", error);
        }
    }
}


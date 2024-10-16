import { saveAs } from 'file-saver';
import JSZip from "jszip";
import { UnitFile } from '../models/unit-file';
import { blobCache, GetAPIDataWithCache } from './cache-manager';

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api`;

export const getFilesByPurpose = async (purpose:string) => {
    try {
        return await GetAPIDataWithCache<UnitFile[]>(`${API_BASE_URL}/File/GetFilesByPurpose?purpose=${purpose}`, `/File?purpose=${purpose}`, 240);
    } catch (error) {
        console.error('Error fetching files:', error);
        throw error;
    }
};

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

    var content = await zip.generateAsync({ type: 'blob' });
    saveAs(content, zipName);
}

/**
 * Requires 
 * 'https://cdn.jsdelivr.net/npm/aws-sdk/dist/aws-sdk.min.js'
 * Initializes the AWS S3 connection
 * @param {*} k The key
 * @param {*} s The secret
 * @returns 
 */
//export function setAWS(k: string, s: string) {
//    AWS.config.update({
//        accessKeyId: k,
//        secretAccessKey: s,
//        region: 'us-west-1',
//    });
//    return new AWS.S3({
//        endpoint: 'https://dnqjtsaxybwrurmucsaa.supabase.co/storage/v1/s3',
//        s3ForcePathStyle: true, // Needed for S3-compatible storage
//        signatureVersion: 'v4', // Ensure the signature version is compatible
//    });
//}

/**
 * Saves the provided file to the AWS S3 file storage
 * @param {*} s3 Use the SetAWS function to initialize the AWS S3 connection
 * @param {*} fileInput The file input element. EX: $("#hitbox")[0]
 * @param {*} path Full path on where to store the file inside of S3
 * @returns 
 */
//export function saveFileToS3(s3: AWS.S3, file: File, path: string) {
//    return new Promise((resolve, reject) => {
//        if (file.size === 0) {
//            alert('Please select a file to upload.');
//            return reject('Please select a file to upload.');
//        }

//        const fileName = file.name.trim().replace(/\s+/g, "_");
//        const bucketName = path;

//        s3.putObject({
//            Bucket: bucketName,
//            Key: fileName,
//            Body: file,
//            ContentType: file.type, // Specify the MIME type
//        }, (err) => {
//            if (err) {
//                reject(`Error uploading file: ${err}`);
//            } else {
//                // Construct the URL of the uploaded file
//                const fileUrl = `https://${s3.endpoint.hostname}/storage/v1/object/public/${bucketName}/${fileName}`;
//                resolve(fileUrl);
//            }
//        });
//    });
//}

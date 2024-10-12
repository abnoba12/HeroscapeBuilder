
export async function loadImage(data: Blob | undefined): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        if (!data) {
            return reject('unable to load image. Image must be specified');
        }

        const reader = new FileReader();

        // Event listener for when the FileReader finishes reading the Blob
        reader.onloadend = () => {
            const base64data = reader.result as string;

            const img = new Image();
            img.src = base64data; // Assign base64 data to img.src
            img.onload = () => {
                resolve(img);
            };
            img.onerror = (err) => {
                console.error('Error loading image element:', err); // Log any errors with loading the image
                reject('Error loading image element');
            };
        };

        // Event listener for any errors during file reading
        reader.onerror = (error) => {
            console.error('Error converting blob to base64:', error); // Log any FileReader errors
            reject('Error converting blob to base64');
        };

        // Convert the Blob to a data URL (base64 encoded string)
        reader.readAsDataURL(data);
    });
}

export async function createHTMLImageElementFromBlob(blob: Blob): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        const reader = new FileReader();

        // Convert the Blob to Base64
        reader.onloadend = () => {
            img.src = reader.result as string;

            // Ensure the image is fully loaded before resolving
            img.onload = () => {
                if (img.width && img.height) {
                    resolve(img);
                } else {
                    reject('Image did not load correctly.');
                }
            };

            img.onerror = () => reject('Error loading image.');
        };

        reader.onerror = () => reject('Error reading Blob.');

        reader.readAsDataURL(blob); // Convert Blob to Base64
    });
}


export function getSizeToMax(maxWidth: number, maxHeight: number, image: HTMLImageElement) {
    try {
        var heightAdj = maxHeight / image.height;
        var widthAdj = maxWidth / image.width;

        if ((image.width * heightAdj) <= maxWidth) {
            return { height: image.height * heightAdj, width: image.width * heightAdj, wPadding: (maxWidth - (image.width * heightAdj)) / 2 };
        } else if ((image.height * widthAdj) <= maxHeight) {
            return { height: image.height * widthAdj, width: image.width * widthAdj, hPadding: (maxHeight - (image.height * widthAdj)) / 2 };
        }
    } catch (e) {
        var message = `Error determining max size for ${image.name}`;
        console.error(message, e);
        throw e;
    }
}

export const FileToBase64 = (file: File | undefined): Promise<string> => {
    return new Promise((resolve, reject) => {
        if (!file) {
            return resolve('');
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            resolve(reader.result as string);
        };
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
    });
};

// Convert Blob to Base64
export const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
};

// Convert Base64 to Blob
export const base64ToBlob = (base64: string): Blob => {
    const byteString = atob(base64.split(',')[1]);
    const mimeString = base64.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
};
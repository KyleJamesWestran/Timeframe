export const convertImageToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });
};

export const base64ToImage = (base64) => {
    return base64.startsWith("data:image") ? base64 : `data:image/png;base64,${base64}`;
};

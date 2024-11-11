import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

interface CloudinaryResponse {
    url: string;
    secure_url: string;
    public_id: string;
    [key: string]: any; // You can add more specific properties here if needed
}

const uploadOnCloudinary = async (localFilePath: string | undefined): Promise<CloudinaryResponse | null> => {
    try {
        if (!localFilePath) return null;

        // Upload the file to Cloudinary
        const response: CloudinaryResponse = await cloudinary.uploader.upload(localFilePath, {
            resource_type: 'auto',
        });

        // Remove the locally saved temporary file after uploading to Cloudinary
        fs.unlinkSync(localFilePath);

        return response;
    } catch (error) {
        // Remove the temporary file if upload fails
        if (localFilePath) fs.unlinkSync(localFilePath);
        return null;
    }
};

export { uploadOnCloudinary };

"use server";

import { mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "fs";
import crypto from 'crypto';
import { basename, extname } from "path";

export const fileMultiPartUploadAction = async (formData: FormData) => {

    const file = formData.get('file') as File;
    if (file) {
        const key = crypto.createHash('sha256').update(file.name + Date.now()).digest('hex');
        mkdirSync(`uploads/temp/${key}`, { recursive: true });
        writeFileSync(`uploads/temp/${key}/manifest.json`, JSON.stringify({
            key: crypto.createHash('sha256').update(file.name + Date.now()).digest('hex'),
            size: file.size,
            filename: file.name,
            contentType: file.type,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        }));
        return { success: true, key };
    }
    return { success: false };
}

export const partUploadAction = async (formData: FormData) => {
    const file = formData.get('file') as File;
    const key = formData.get('key') as string;
    const part = formData.get('part') as string;
    if (file && key && part) {
        writeFileSync(`uploads/temp/${key}/${part}.part`, Buffer.from(await file.arrayBuffer()));
    }
    return { success: true };
}

export const completeUploadAction = async ({
    key,
}: {
    key: string;
}) => {
    const manifest = JSON.parse(readFileSync(`uploads/temp/${key}/manifest.json`, 'utf8'));
    const fileName = basename(manifest.filename, extname(manifest.filename)) + `-${key}.${extname(manifest.filename)}`;
    console.log(fileName);
    const parts = readdirSync(`uploads/temp/${key}`).filter((file) => file.endsWith('.part'));
    for (const part of parts) {
        const buffer = readFileSync(`uploads/temp/${key}/${part}`);
        writeFileSync(`uploads/${fileName}`, buffer, { flag: 'a' });
    }
    rmSync(`uploads/temp/${key}`, { recursive: true });
    return { success: true, fileName };
}
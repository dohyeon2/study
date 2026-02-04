"use server";

import crypto from 'crypto';
import { mkdirSync } from "fs";
import { readdir, readFile, rm, stat, writeFile } from "fs/promises";
import { basename, extname } from "path";

export const fileMultiPartUploadAction = async ({
    name,
    size,
    type,
}: {
    name: string;
    size: number;
    type: string;
}) => {

    const key = crypto.createHash('sha256').update(name + Date.now()).digest('hex');
    mkdirSync(`uploads/temp/${key}`, { recursive: true });
    writeFile(`uploads/temp/${key}/manifest.json`, JSON.stringify({
        key,
        size: size,
        filename: name,
        type: type,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    }));
    return { success: true, key };
}

export const partUploadAction = async (formData: FormData) => {
    const file = formData.get('file') as File;
    const key = formData.get('key') as string;
    const part = formData.get('part') as string;

    if (file && key && part) {
        writeFile(`uploads/temp/${key}/${part}.part`, Buffer.from(await file.arrayBuffer()));
    }
    return { success: true };
}

export const completeUploadAction = async ({ key }: { key: string }) => {
    const manifest = JSON.parse(
        await readFile(`uploads/temp/${key}/manifest.json`, "utf8")
    );

    const ext = extname(manifest.filename);
    const base = basename(manifest.filename, ext);
    const fileName = `${base}-${key}${ext}`;

    const parts = (await readdir(`uploads/temp/${key}`))
        .filter((file) => file.endsWith(".part"))
        .sort((a, b) => Number(a.split(".")[0]) - Number(b.split(".")[0]));

    const size = (
        await Promise.all(
            parts.map((part) =>
                stat(`uploads/temp/${key}/${part}`)
            )
        )
    ).reduce((acc, s) => acc + s.size, 0);

    if (size !== manifest.size) {
        throw new Error("Upload failed");
    }

    // ⚠️ writeFile + flag:'a'도 비동기지만
    // 내부적으로는 여전히 디스크 write가 직렬화됨
    for (const part of parts) {
        const buffer = await readFile(`uploads/temp/${key}/${part}`);
        await writeFile(`uploads/${fileName}`, buffer, { flag: "a" });
    }

    await rm(`uploads/temp/${key}`, { recursive: true, force: true });

    return { success: true, fileName };
}
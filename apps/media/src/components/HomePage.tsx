'use client';

import { completeUploadAction, fileMultiPartUploadAction, partUploadAction } from '@/services/file';
import { Button, Listbox, ListboxItem, PressEvent } from '@heroui/react';
import React, { useRef, useState } from 'react';
import toast from 'react-hot-toast';

export const HomePage: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [isPending, setIsPending] = useState(false);

    const handleFileSelect = (e: PressEvent) => {
        const fileInput = fileInputRef.current;
        if (fileInput) {
            fileInput.click();
        }
    }

    return (
        <>
            <Listbox>
                <ListboxItem>slot</ListboxItem>
            </Listbox>
            <form action={(formData) => {
                setIsPending(true);
                toast.promise(async () => {
                    const result = await fileMultiPartUploadAction(formData);
                    const file = formData.get('file') as File;
                    if (!file) {
                        throw new Error('File not selected');
                    }

                    const splitParts = Math.ceil(file.size / 1024 / 1024 / 5);
                    if (!result.success) {
                        throw new Error('Upload failed');
                    }
                    for (let i = 0; i < splitParts; i++) {
                        const part = file.slice(i * 1024 * 1024 * 5, (i + 1) * 1024 * 1024 * 5);
                        const data = new FormData();
                        data.append('file', part);
                        data.append('key', result.key || '');
                        data.append('part', i.toString());
                        const partResult = await partUploadAction(data);
                        if (!partResult.success) {
                            throw new Error('Upload failed');
                        }
                    }
                    const completeResult = await completeUploadAction({
                        key: result.key || '',
                    });
                    if (!completeResult.success) {
                        throw new Error('Upload failed');
                    }
                    return completeResult.fileName;
                }, {
                    loading: 'Uploading...',
                    success: 'Uploaded successfully',
                    error: 'Upload failed',
                });
                setIsPending(false);
            }} className='grid gap-2'>
                <Button type='button' onPress={handleFileSelect} startContent={<span>📎</span>} isLoading={isPending} variant='ghost' >
                    <span>{file?.name || 'No file selected'}</span>
                </Button>
                <input name='file' ref={fileInputRef} type="file" className="hidden" onChange={(e) => e.target.files?.item(0) && setFile(e.target.files.item(0))} />
                <Button type='submit' isLoading={isPending}  >
                    <span>Upload</span>
                </Button>
            </form></>
    );
};

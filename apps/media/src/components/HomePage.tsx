'use client';

import { completeUploadAction, fileMultiPartUploadAction, partUploadAction } from '@/services/file';
import { Button, Listbox, ListboxItem, PressEvent, Progress } from '@heroui/react';
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
            <form
                onSubmit={async (e) => {
                    e.preventDefault();
                    const formData = new FormData(e.target as HTMLFormElement);
                    if (isPending) {
                        return;
                    }
                    try {
                        const file = formData.get('file') as File;
                        if (!file.name) {
                            throw new Error('파일이 선택되지 않았습니다.');
                        }
                        const result = await fileMultiPartUploadAction({
                            name: file.name,
                            size: file.size,
                            type: file.type,
                        });

                        const chunkSize = 1024 * 512;

                        const splitParts = Math.ceil(file.size / chunkSize);
                        if (!result.success) {
                            throw new Error('Upload failed');
                        }
                        let totalProgress = 0;
                        await Promise.all(Array.from({ length: splitParts }).map(async (_, i) => {
                            const part = file.slice(i * chunkSize, (i + 1) * chunkSize);
                            const data = new FormData();
                            data.append('file', part);
                            data.append('key', result.key || '');
                            data.append('part', i.toString());
                            const partResult = await partUploadAction(data);
                            if (!partResult.success) {
                                throw new Error('Upload failed');
                            }

                            totalProgress += part.size;
                            toast.loading(<div className='grid gap-2'>
                                <span>Uploading...</span>
                                <Progress value={Math.floor(totalProgress / file.size * 100)} size='sm' valueLabel />
                            </div>, {
                                id: 'uploading',
                            });

                        }));
                        const completeResult = await completeUploadAction({
                            key: result.key || '',
                        });
                        if (!completeResult.success) {
                            throw new Error('Upload failed');
                        }

                        if (fileInputRef.current) {
                            fileInputRef.current.value = '';
                        }
                    }
                    catch (error) {
                        toast.error('Upload failed');
                    } finally {
                        setIsPending(false);
                        toast.dismiss('uploading');
                    }

                }}
                className='grid gap-2'>
                <Button type='button' onPress={handleFileSelect} startContent={<span>📎</span>} isLoading={isPending} variant='ghost' >
                    <span>{file?.name || 'No file selected'}</span>
                </Button>
                <input name='file' ref={fileInputRef} type="file" className="hidden" onChange={(e) => {
                    e.target.files?.item(0) && setFile(e.target.files.item(0));
                }} />
                <Button type='submit' isLoading={isPending}  >
                    <span>Upload</span>
                </Button>
            </form></>
    );
};

'use client';

import { HeroUIProvider } from '@heroui/react';
import React, { PropsWithChildren } from 'react';
import { Toaster } from 'react-hot-toast';



export const Providers: React.FC<PropsWithChildren> = ({ children }) => {
    return (
        <HeroUIProvider>
            {children}
            <Toaster />
        </HeroUIProvider>
    );
};

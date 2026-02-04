'use client';

import { HeroUIProvider } from '@heroui/react';
import React, { PropsWithChildren } from 'react';



export const Providers: React.FC<PropsWithChildren> = ({ children }) => {
    return (
        <HeroUIProvider>
            {children}
        </HeroUIProvider>
    );
};

import React, { type PropsWithChildren } from 'react';
import { createImportMap } from '../server/vendor';


export const Html: React.FC<PropsWithChildren> = (props) => {
    return (
        <html>
            <head>
                <title>Todo</title>
                <script type="importmap">
                    {createImportMap()}
                </script>
            </head>
            <body>
                {props.children}
                <script type="module" src="/dist/bootstrap.js"></script>
            </body>
        </html>
    );
};

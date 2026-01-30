import React, { type PropsWithChildren } from 'react';

export const Html: React.FC<PropsWithChildren> = (props) => {
    return (
        <html>
            <head>
                <title>Todo</title>
            </head>
            <body>
                {props.children}
                <script type="module" src="/dist/bootstrap.js"></script>
            </body>
        </html>
    );
};

import type { FC } from 'react';
import { App } from './App';

export const Html: FC = () => {
    return (
        <html>
            <head>
                <title>Todo</title>
            </head>
            <body>
                <div id="root">
                    <App />
                </div>
                <script type="module" src="/main.js"></script>
            </body>
        </html>
    );
}
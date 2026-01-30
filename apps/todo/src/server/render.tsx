import { renderToReadableStream } from "react-dom/server";

export const render = async () => {
    const { App } = await import('../app/App?v=' + Date.now());
    const { Html } = await import('../app/HTML?v=' + Date.now());
    return renderToReadableStream(<Html>
        <App />
    </Html>);
};
import { hydrateRoot } from 'react-dom/client';
import { App } from './app/App';

const main = () => {
    hydrateRoot(document.getElementById('root') as HTMLElement, <App />);
}

main();
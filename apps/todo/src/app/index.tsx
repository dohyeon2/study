import { renderToReadableStream } from 'react-dom/server';
import { Html } from './Html';

export async function appHandler() {
  const stream = await renderToReadableStream(<Html />);

  return stream;
}
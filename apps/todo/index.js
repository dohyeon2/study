import { watch } from 'fs';
import esbuild from 'esbuild';
import { spawn } from 'child_process';

let existingProcess = null;

const build = () => {
    const define = {
        'process.env.NODE_ENV': `'"${process.env.NODE_ENV}"'`,
    };

    esbuild.buildSync({
        entryPoints: ['./src/server.ts'],
        outfile: './dist/server.cjs',
        bundle: true,
        format: 'cjs',
        platform: 'node',
        target: 'esnext',
        external: ["esbuild"],
        publicPath: "/",

    });
    esbuild.buildSync({
        entryPoints: ['./src/main.tsx'],
        outfile: './dist/client/main.js',

        bundle: true,          // ⭐ 핵심
        format: 'esm',         // ⭐ browser용
        platform: 'browser',
        target: 'es2020',

        sourcemap: true,       // (선택) 디버깅용
        define,
        publicPath: "/",
    });
}

const start = () => {
    if (existingProcess) {
        existingProcess.kill('SIGINT', () => {
            console.log('Server is shutting down');
        });
    }
    build();
    const process = spawn('node', ['./dist/server.cjs']);
    existingProcess = process;
    process.stdout.on('data', (data) => {
        console.log(data.toString());
    });
    process.stderr.on('data', (data) => {
        console.error(data.toString());
    });
    process.on('close', (code) => {
        console.log(`Server process exited with code ${code}`);
    });
}

if (process.env.NODE_ENV === 'development') {
    watch('./src/', {
        recursive: true
    }, (event) => {
        if (event === 'change') {
            start();
        }
    });
}

start();
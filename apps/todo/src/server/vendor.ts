import { build } from "esbuild";
import { readFileSync } from "node:fs";

const packageJson = JSON.parse(readFileSync('./package.json', 'utf-8'));

const subPath: Record<string, string[]> = {
    'react-dom': [
        'react-dom/client',
    ],
}

const dependencies = Object.keys(packageJson.dependencies);

const resolveDependency = (dependency: string) => {
    if (dependency === 'ws') {
        return null;
    }
    try {
        return import.meta.resolve(dependency);
    } catch (error) {
        return null;
    }
}

export const bundleVendor = async () => {
    const result = await build({
        entryPoints: dependencies.reduce((acc, dependency) => {
            const resolvedDependency = resolveDependency(dependency)?.replace('file://', '');
            if (resolvedDependency) {
                acc = ({
                    ...acc,
                    [dependency]: resolvedDependency,
                })
            }

            if (subPath[dependency]) {
                for (const sub of subPath[dependency]) {
                    const resolvedSub = resolveDependency(sub)?.replace('file://', '');
                    if (resolvedSub) {
                        acc = ({
                            ...acc,
                            [sub]: resolvedSub,
                        })
                    }
                }
            }
            return acc;
        }, {}),
        bundle: true,
        outdir: './dist/vendor/',
        platform: 'browser',
        format: 'esm',
        minify: true,
        conditions: ['browser', 'development'],
        mainFields: ['module', 'browser', 'main'],
    });
}

export const createImportMap = () => {
    const importMap = {
        imports: {} as Record<string, string>,
    }
    for (const dependency of dependencies) {
        importMap.imports[dependency] = `/dist/vendor/${dependency}.js`;
        if (subPath[dependency]) {
            for (const sub of subPath[dependency]) {
                importMap.imports[sub] = `/dist/vendor/${sub}.js`;
            }
        }
    }
    return JSON.stringify(importMap, null, 2);
}
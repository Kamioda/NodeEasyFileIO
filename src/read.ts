import { readFileSync, existsSync } from 'node:fs';

export function readFile(path: string): string {
    if (!existsSync(path)) throw new Error(`${path}: File is not exists`);
    return readFileSync(path, 'utf-8');
}

export function readCSV(path: string): string[][] {
    const LineSplitResult = readFile(path).split(/\r\n|\n|\r/g);
    return LineSplitResult.length === 1 ? [LineSplitResult[0].split(',')] : LineSplitResult.map(val => val.split(','));
}

export function readJson<ReturnType = object>(path: string): ReturnType {
    return JSON.parse(readFile(path)) as ReturnType;
}

export function readProperties<ReturnType = object>(path: string): ReturnType {
    const fileTexts = readFile(path).split(/\r\n|\n|\r/g);
    const Ret = {};
    fileTexts.forEach(i => {
        if (i.charAt(0) === '#') return;
        const data = i.split('=');
        Ret[data[0]] = data.slice(1).join('=');
    });
    return Ret as ReturnType;
}

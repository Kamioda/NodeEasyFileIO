import { writeFileSync, existsSync, mkdirSync } from 'node:fs';
import IO from './NewLine';

export function writeFile(path: string, content?: string | NodeJS.ArrayBufferView, overwrite?: boolean) {
    const dir = path.substring(0, path.lastIndexOf('/') + 1);
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
    if (existsSync(path) && !overwrite) throw new Error(`${path}: File already exists`);
    writeFileSync(path, content ?? '', 'utf-8');
}

export function writeCSV(path: string, content: string[], overwrite?: boolean);
export function writeCSV(path: string, content: string[][], overwrite?: boolean);
export function writeCSV(path: string, content: string[] | string[][], overwrite?: boolean) {
    if (Array.isArray(content[0])) {
        const data = (content as string[][]).map(i => i.join(','));
        writeFile(path, data.join(IO.NewLine), overwrite);
    } else {
        const data = content as string[];
        writeFile(path, data.join(','), overwrite);
    }
}

export function writeJson(path: string, content: object, overwrite?: boolean) {
    /* c8 ignore next */
    writeFile(path, JSON.stringify(content), overwrite);
}

export function writeProperties(path: string, content: object, overwrite?: boolean) {
    const Keys = Object.keys(content);
    if (Keys.some(i => typeof content[i] === 'object'))
        throw new Error('The data type of one or more keys is an object.');
    const TextContent = Keys.map(i => `${i}=${content[i]}`).join(IO.NewLine);
    writeFile(path, TextContent, overwrite);
}

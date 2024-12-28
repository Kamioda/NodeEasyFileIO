import { readFileSync, existsSync, writeFileSync, mkdirSync } from 'node:fs';
import IO from './NewLine';

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

export enum OverwriteMode {
    None = 0,
    Append = 1,
    AppendNewLine = 2,
    Replace = 3,
}

export function writeFile(
    path: string,
    content?: string | NodeJS.ArrayBufferView | null,
    overwrite: OverwriteMode = OverwriteMode.None
) {
    if (path.indexOf('\\') >= 0) return writeFile(path.replace(/\\/g, '/'), content, overwrite);
    const dir = path.substring(0, path.lastIndexOf('/') + 1);
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
    switch (overwrite) {
        case OverwriteMode.None:
            if (existsSync(path)) throw new Error(`${path}: File is already exists.`);
            writeFileSync(path, content ?? '', 'utf-8');
            break;
        case OverwriteMode.Append: {
            if (content == null) return;
            if (!existsSync(path)) return writeFile(path, content, OverwriteMode.None);
            writeFileSync(path, readFile(path) + content, 'utf-8');
            break;
        }
        case OverwriteMode.AppendNewLine: {
            if (!existsSync(path)) return writeFile(path, content, OverwriteMode.None);
            const current = readFile(path);
            if (current === '') return writeFile(path, content, OverwriteMode.Replace);
            writeFileSync(
                path,
                current + IO.NewLine + (content ?? ''),
                'utf-8'
            );
            break;
        }
        case OverwriteMode.Replace:
            writeFileSync(path, content ?? '', 'utf-8');
            break;
        /* v8 ignore start */
        default:
            throw new Error('Invalid overwrite mode.');
        /* v8 ignore end */
    }
}

export function writeCSV(path: string, content: string[], overwrite?: OverwriteMode);
export function writeCSV(path: string, content: string[][], overwrite?: OverwriteMode);
export function writeCSV(path: string, content: string[] | string[][], overwrite: OverwriteMode = OverwriteMode.None) {
    if (Array.isArray(content[0])) {
        const data = (content as string[][]).map(i => i.join(','));
        writeFile(path, data.join(IO.NewLine), overwrite);
    } else {
        const data = content as string[];
        writeFile(path, data.join(','), overwrite);
    }
}

export function writeJson(path: string, content: object, overwrite: OverwriteMode = OverwriteMode.None) {
    switch (overwrite) {
        case OverwriteMode.None:
            if (existsSync(path)) throw new Error(`${path}: File is already exists.`);
            writeFile(path, JSON.stringify(content), overwrite);
            break;
        case OverwriteMode.Append: {
            const current = existsSync(path) ? readJson(path) : {};
            writeFile(path, JSON.stringify({ ...current, ...content }), OverwriteMode.Replace);
            break;
        }
        case OverwriteMode.AppendNewLine:
            return writeJson(path, content, OverwriteMode.Append);
        case OverwriteMode.Replace:
            writeFile(path, JSON.stringify(content), overwrite);
            break;
        /* v8 ignore start */
        default:
            throw new Error('Invalid overwrite mode.');
        /* v8 ignore end */
    }
}

export function writeProperties(path: string, content: object, overwrite: OverwriteMode = OverwriteMode.None) {
    const Keys = Object.keys(content);
    if (Keys.some(i => typeof content[i] === 'object'))
        throw new Error('The data type of one or more keys is an object.');
    switch (overwrite) {
        case OverwriteMode.None:
            if (existsSync(path)) throw new Error(`${path}: File is already exists.`);
            writeFile(path, Keys.map(i => `${i}=${content[i]}`).join(IO.NewLine), overwrite);
            break;
        case OverwriteMode.Append: {
            const current = existsSync(path) ? readProperties(path) : {};
            const newRecord = { ...current, ...content };
            writeFile(path, Object.keys(newRecord).map(i => `${i}=${newRecord[i]}`).join(IO.NewLine), OverwriteMode.Replace);
            break;
        }
        case OverwriteMode.AppendNewLine:
            return writeProperties(path, content, OverwriteMode.Append);
        case OverwriteMode.Replace: {
            writeFile(path, Keys.map(i => `${i}=${content[i]}`).join(IO.NewLine), overwrite);
            break;
        }
        /* v8 ignore start */
        default:
            throw new Error('Invalid overwrite mode.');
        /* v8 ignore end */
    }
}

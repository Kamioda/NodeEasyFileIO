import { readFile, readCSV, readJson, readProperties, writeFile, writeCSV, writeJson, writeProperties, OverwriteMode } from '.';
import { existsSync, readFileSync, rmSync } from 'node:fs';
import IO from './NewLine';

describe('read test', () => {
    it('Read Text File/OK', () => {
        expect(readFile('./readtestdata/test.txt')).toBe('Hello World!');
    });

    it('Read Text File/File is not found', () => {
        expect(() => readFile('./readtestdata/hello.txt')).toThrow('./readtestdata/hello.txt: File is not exists');
    });

    it('Read CSV 1', () => {
        const expects = [['Hello', 'World!']];
        const ReadResult = readCSV('./readtestdata/test1.csv');
        expects.forEach((arr, pIndex) => {
            arr.forEach((val, sIndex) => {
                expect(ReadResult[pIndex][sIndex]).toBe(val);
            });
        });
    });

    it('Read CSV 2', () => {
        const expects = [
            ['Hello', 'World!'],
            ['Hello', 'Tokyo'],
        ];
        const ReadResult = readCSV('./readtestdata/test2.csv');
        expects.forEach((arr, pIndex) => {
            arr.forEach((val, sIndex) => {
                expect(ReadResult[pIndex][sIndex]).toBe(val);
            });
        });
    });

    it('Read JSON File', () => {
        expect(readJson('./readtestdata/test.json')).toStrictEqual({
            id: 'helloworld',
            name: 'Hello World!',
            url: 'https://www.kamioda.tokyo/',
        });
    });

    it('Read Properties File', () => {
        expect(readProperties('./readtestdata/test.properties')).toStrictEqual({
            id: 'helloworld',
            name: 'Hello World!',
            url: 'https://www.kamioda.tokyo/',
        });
    });
});

describe('write test', () => {
    beforeAll(() => {
        if (existsSync('./writetestdata')) rmSync('./writetestdata', { recursive: true });
    });
    describe('no additional tests', () => {
        it('Create New Directory', () => {
            writeFile('./writetestdata/hello.txt');
            expect(existsSync('./writetestdata/hello.txt')).toBeTruthy();
            writeFile('./writetestdata/dir1/dir2/hello.txt');
            expect(existsSync('./writetestdata/dir1/dir2/hello.txt')).toBeTruthy();
        });
    
        it('Create Text File/New', () => {
            const content = 'Hello World!';
            writeFile('./writetestdata/test1a.txt', content);
            expect(readFileSync('./writetestdata/test1a.txt', 'utf-8')).toBe(content);
        });
    
        it('Create Text File/Exists', () => {
            const contentA = 'Hello World!';
            const contentB = 'HelloWorld!';
            writeFile('./writetestdata/test2.txt', contentA);
            expect(() => writeFile('./writetestdata/test2.txt', contentB)).toThrow(
                './writetestdata/test2.txt: File already exists'
            );
            expect(readFileSync('./writetestdata/test2.txt', 'utf-8')).toBe(contentA);
            expect(() => writeFile('./writetestdata/test2.txt', contentB, OverwriteMode.None)).toThrow(
                './writetestdata/test2.txt: File already exists'
            );
            expect(readFileSync('./writetestdata/test2.txt', 'utf-8')).toBe(contentA);
            writeFile('./writetestdata/test2.txt', contentB, OverwriteMode.Replace);
            expect(readFileSync('./writetestdata/test2.txt', 'utf-8')).toBe(contentB);
        });
    
        it('Create CSV 1', () => {
            const content = ['Hello', 'World!'];
            writeCSV('./writetestdata/test1.csv', content);
            expect(readFileSync('./writetestdata/test1.csv', 'utf-8')).toBe(content.join(','));
        });
    
        it('Create CSV 2', () => {
            const content = [
                ['Hello', 'World!'],
                ['Hello', 'Tokyo'],
            ];
            writeCSV('./writetestdata/test2.csv', content);
            expect(readFileSync('./writetestdata/test2.csv', 'utf-8')).toBe(content.map(i => i.join(',')).join(IO.NewLine));
        });
    
        it('Create JSON File', () => {
            const obj = {
                id: 'helloworld',
                name: 'Hello World!',
                url: 'https://www.kamioda.tokyo/',
            };
            writeJson('./writetestdata/test.json', obj);
            const text = readFileSync('./writetestdata/test.json', 'utf-8');
            expect(JSON.parse(text)).toStrictEqual(obj);
        });
    
        it('Create Properties File/OK', () => {
            const obj = {
                id: 'helloworld',
                name: 'Hello World!',
                url: 'https://www.kamioda.tokyo/',
            };
            writeProperties('./writetestdata/test.properties', obj);
            const text = Object.keys(obj)
                .map(i => `${i}=${obj[i]}`)
                .join(IO.NewLine);
            expect(readFileSync('./writetestdata/test.properties', 'utf-8')).toBe(text);
        });
    
        it('Create Properties File/Error', () => {
            const obj = {
                id: 'helloworld',
                name: 'Hello World!',
                url: {
                    kamioda: 'https://www.kamioda.tokyo/',
                    meigetsu: 'https://www.meigetsu.jp/',
                },
            };
            expect(() => writeProperties('./writetestdata/test.properties', obj)).toThrow(
                'The data type of one or more keys is an object.'
            );
        });
    });
    describe('write additional tests', () => {
        it('Create Text File/Append', () => {
            const contentA = 'Hello';
            const contentB = ' World!';
            writeFile('./writetestdata/test3.txt', contentA);
            writeFile('./writetestdata/test3.txt', contentB, OverwriteMode.Append);
            expect(readFileSync('./writetestdata/test3.txt', 'utf-8')).toBe(contentA + contentB);
        });
    
        it('Create CSV with Append Mode', () => {
            const contentA = ['Hello', 'World!'];
            const contentB = ['Hello', 'Tokyo'];
            writeCSV('./writetestdata/test3.csv', contentA);
            writeCSV('./writetestdata/test3.csv', contentB, OverwriteMode.Append);
            expect(readFileSync('./writetestdata/test3.csv', 'utf-8')).toBe(contentA.join(',') + contentB.join(','));
        });
    
        it('Create JSON File with Append Mode', () => {
            const objA = { id: 'helloworld' };
            const objB = { id: 'HelloWorld', name: 'Hello World!', url: 'https://www.kamioda.tokyo/' };
            writeJson('./writetestdata/test3.json', objA);
            writeJson('./writetestdata/test3.json', objB, OverwriteMode.Append);
            const text = readFileSync('./writetestdata/test3.json', 'utf-8');
            expect(JSON.parse(text)).toStrictEqual(objB);
        });
    
        it('Create Properties File with Append Mode', () => {
            const objA = { id: 'helloworld' };
            const objB = { name: 'Hello World!', url: 'https://www.kamioda.tokyo/' };
            writeProperties('./writetestdata/test3.properties', objA);
            writeProperties('./writetestdata/test3.properties', objB, OverwriteMode.Append);
            const text = Object.keys({ ...objA, ...objB })
                .map(i => `${i}=${{ ...objA, ...objB }[i]}`)
                .join(IO.NewLine);
            expect(readFileSync('./writetestdata/test3.properties', 'utf-8')).toBe(text);
        });
    });    
});

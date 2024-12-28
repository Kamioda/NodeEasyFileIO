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

        it('Create Text File/Path is Windows Format', () => {
            const content = 'Hello World!';
            writeFile('./writetestdata\\test1b.txt', content);
            expect(readFileSync('./writetestdata/test1b.txt', 'utf-8')).toBe(content);
        });
    
        it('Create Text File/Exists', () => {
            const contentA = 'Hello World!';
            const contentB = 'HelloWorld!';
            writeFile('./writetestdata/test2.txt', contentA);
            expect(() => writeFile('./writetestdata/test2.txt', contentB)).toThrow(
                './writetestdata/test2.txt: File is already exists'
            );
            expect(readFileSync('./writetestdata/test2.txt', 'utf-8')).toBe(contentA);
            expect(() => writeFile('./writetestdata/test2.txt', contentB, OverwriteMode.None)).toThrow(
                './writetestdata/test2.txt: File is already exists'
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
        it('Write Text File/Append', () => {
            const contentA = 'Hello';
            const contentB = ' World!';
            writeFile('./writetestdata/test3.txt', contentA);
            writeFile('./writetestdata/test3.txt', contentB, OverwriteMode.Append);
            expect(readFileSync('./writetestdata/test3.txt', 'utf-8')).toBe(contentA + contentB);
        });

        it('Write Text File/Append/No Content', () => {
            const content = 'Hello World!';
            writeFile('./writetestdata/test3a.txt', content);
            writeFile('./writetestdata/test3a.txt', null, OverwriteMode.Append);
            expect(readFileSync('./writetestdata/test3a.txt', 'utf-8')).toBe(content);
        });

        it('Write Text File/Append New Line', () => {
            const contentA = 'Hello';
            const contentB = ' World!';
            writeFile('./writetestdata/test4.txt', contentA);
            writeFile('./writetestdata/test4.txt', contentB, OverwriteMode.AppendNewLine);
            expect(readFileSync('./writetestdata/test4.txt', 'utf-8')).toBe(contentA + IO.NewLine + contentB);
        });

        it('Write Text File/Append New Line/No Content', () => {
            const content = 'Hello World!';
            writeFile('./writetestdata/test4a.txt', content);
            writeFile('./writetestdata/test4a.txt', null, OverwriteMode.AppendNewLine);
            expect(readFileSync('./writetestdata/test4a.txt', 'utf-8')).toBe(content + IO.NewLine);
        });

        it('Write Text File/Append/No File', () => {
            const content = 'Hello World!';
            writeFile('./writetestdata/test5.txt', content, OverwriteMode.Append);
            expect(readFileSync('./writetestdata/test5.txt', 'utf-8')).toBe(content);
        });

        it('Write Text File/Append/Empty File', () => {
            writeFile('./writetestdata/test6.txt');
            const content = 'Hello World!';
            writeFile('./writetestdata/test6.txt', content, OverwriteMode.Append);
            expect(readFileSync('./writetestdata/test6.txt', 'utf-8')).toBe(content);
        });

        it('Write Text File/AppendNewLine/No File', () => {
            const content = 'Hello World!';
            writeFile('./writetestdata/test7.txt', content, OverwriteMode.AppendNewLine);
            expect(readFileSync('./writetestdata/test7.txt', 'utf-8')).toBe(content);
        });

        it('Write Text File/AppendNewLine/Empty File', () => {
            writeFile('./writetestdata/test8.txt');
            const content = 'Hello World!';
            writeFile('./writetestdata/test8.txt', content, OverwriteMode.AppendNewLine);
            expect(readFileSync('./writetestdata/test8.txt', 'utf-8')).toBe(content);
        });
    
        it('Write CSV with Append Mode', () => {
            const contentA = ['Hello', 'World!'];
            const contentB = ['Hello', 'Tokyo'];
            writeCSV('./writetestdata/test3.csv', contentA);
            writeCSV('./writetestdata/test3.csv', contentB, OverwriteMode.Append);
            expect(readFileSync('./writetestdata/test3.csv', 'utf-8')).toBe(contentA.join(',') + contentB.join(','));
        });
    
        it('Write JSON File with Append Mode', () => {
            const objA = { id: 'helloworld' };
            const objB = { id: 'HelloWorld', name: 'Hello World!', url: 'https://www.kamioda.tokyo/' };
            writeJson('./writetestdata/test3.json', objA);
            writeJson('./writetestdata/test3.json', objB, OverwriteMode.Append);
            const text = readFileSync('./writetestdata/test3.json', 'utf-8');
            expect(JSON.parse(text)).toStrictEqual(objB);
        });
    
        it('Write Properties File with Append Mode', () => {
            const objA = { id: 'helloworld' };
            const objB = { name: 'Hello World!', url: 'https://www.kamioda.tokyo/' };
            writeProperties('./writetestdata/test3.properties', objA);
            writeProperties('./writetestdata/test3.properties', objB, OverwriteMode.Append);
            const expectedObj = {
                id: 'helloworld',
                name: 'Hello World!',
                url: 'https://www.kamioda.tokyo/',
            };
            const text = Object.keys(expectedObj)
                .map(i => `${i}=${expectedObj[i]}`)
                .join(IO.NewLine);
            expect(readFileSync('./writetestdata/test3.properties', 'utf-8')).toBe(text);
        });
    });
    describe('overwrite tests', () => {
        it('Overwrite Text File', () => {
            const contentA = 'Hello World!';
            const contentB = 'Hello Tokyo!';
            writeFile('./writetestdata/test9.txt', contentA);
            writeFile('./writetestdata/test9.txt', contentB, OverwriteMode.Replace);
            expect(readFileSync('./writetestdata/test9.txt', 'utf-8')).toBe(contentB);
        });

        it('Overwrite Text File/No Content', () => {
            const content = 'Hello World!';
            writeFile('./writetestdata/test10.txt', content);
            writeFile('./writetestdata/test10.txt', null, OverwriteMode.Replace);
            expect(readFileSync('./writetestdata/test10.txt', 'utf-8')).toBe('');
        });

        it('Overwrite CSV File', () => {
            const contentA = ['Hello', 'World!'];
            const contentB = ['Hello', 'Tokyo'];
            writeCSV('./writetestdata/test10.csv', contentA);
            writeCSV('./writetestdata/test10.csv', contentB, OverwriteMode.Replace);
            expect(readFileSync('./writetestdata/test10.csv', 'utf-8')).toBe(contentB.join(','));
        });

        it('Overwrite JSON File', () => {
            const objA = { id: 'helloworld' };
            const objB = { name: 'Hello Tokyo!', url: 'https://www.kamioda.tokyo/' };
            writeJson('./writetestdata/test11.json', objA);
            writeJson('./writetestdata/test11.json', objB, OverwriteMode.Replace);
            const text = readFileSync('./writetestdata/test11.json', 'utf-8');
            expect(JSON.parse(text)).toStrictEqual(objB);
        });

        it('Overwrite Properties File', () => {
            const objA = { id: 'helloworld' };
            const objB = { name: 'Hello Tokyo!', url: 'https://www.kamioda.tokyo/' };
            writeProperties('./writetestdata/test12.properties', objA);
            writeProperties('./writetestdata/test12.properties', objB, OverwriteMode.Replace);
            const expectedObj = {
                name: 'Hello Tokyo!',
                url: 'https://www.kamioda.tokyo/',
            };
            const text = Object.keys(expectedObj)
                .map(i => `${i}=${expectedObj[i]}`)
                .join(IO.NewLine);
            expect(readFileSync('./writetestdata/test12.properties', 'utf-8')).toBe(text);
        });
    });
    
});

import { writeFile, writeCSV, writeJson, writeProperties } from '../dist/esm/index.js';
import test from 'ava';
import { readFileSync, existsSync, rmSync } from 'node:fs';
import IO from '../dist/esm/NewLine.js';

test.before('Init environment', () => {
    if (existsSync('./writetestdata')) rmSync('./writetestdata', { recursive: true });
});

test.after('Cleanup', () => {
    if (existsSync('./writetestdata')) rmSync('./writetestdata', { recursive: true });
});

test('Create New Directory', t => {
    writeFile('./writetestdata/hello.txt');
    t.true(existsSync('./writetestdata/hello.txt'));
    writeFile('./writetestdata/dir1/dir2/hello.txt');
    t.true(existsSync('./writetestdata/dir1/dir2/hello.txt'));
});

test('Create Text File/New', t => {
    const content = 'Hello World!';
    writeFile('./writetestdata/test1a.txt', content);
    t.is(readFileSync('./writetestdata/test1a.txt', 'utf-8'), content);

    const data = readFileSync('./writetestdata/test1a.txt');
    writeFile('./writetestdata/test1b.txt', data);
    t.deepEqual(readFileSync('./writetestdata/test1b.txt'), data);
});

test('Create Text File/Exists', t => {
    const contentA = 'Hello World!';
    const contentB = 'HelloWorld!';
    writeFile('./writetestdata/test2.txt', contentA);
    t.throws(() => writeFile('./writetestdata/test2.txt', contentB));
    t.is(readFileSync('./writetestdata/test2.txt', 'utf-8'), contentA);
    t.throws(() => writeFile('./writetestdata/test2.txt', contentB, false));
    t.is(readFileSync('./writetestdata/test2.txt', 'utf-8'), contentA);
    writeFile('./writetestdata/test2.txt', contentB, true);
    t.is(readFileSync('./writetestdata/test2.txt', 'utf-8'), contentB);
});

test('Create CSV 1', t => {
    const content = ['Hello', 'World!'];
    writeCSV('./writetestdata/test1.csv', content);
    t.is(readFileSync('./writetestdata/test1.csv', 'utf-8'), content.join(','));
});

test('Create CSV 2', t => {
    const content = [
        ['Hello', 'World!'],
        ['Hello', 'Tokyo'],
    ];
    writeCSV('./writetestdata/test2.csv', content);
    t.is(readFileSync('./writetestdata/test2.csv', 'utf-8'), content.map(i => i.join(',')).join(IO.NewLine));
});

test('Create JSON File', t => {
    const obj = {
        id: 'helloworld',
        name: 'Hello World!',
        url: 'https://www.kamioda.tokyo/',
    };
    writeJson('./writetestdata/test.json', obj);
    const text = readFileSync('./writetestdata/test.json', 'utf-8');
    t.deepEqual(JSON.parse(text), obj);
});

test('Create Properties File/OK', t => {
    const obj = {
        id: 'helloworld',
        name: 'Hello World!',
        url: 'https://www.kamioda.tokyo/',
    };
    writeProperties('./writetestdata/test.properties', obj);
    const text = Object.keys(obj)
        .map(i => `${i}=${obj[i]}`)
        .join(IO.NewLine);
    t.is(readFileSync('./writetestdata/test.properties', 'utf-8'), text);
});

test('Create Properties File/Error', t => {
    const obj = {
        id: 'helloworld',
        name: 'Hello World!',
        url: {
            kamioda: 'https://www.kamioda.tokyo/',
            meigetsu: 'https://www.meigetsu.jp/',
        },
    };
    t.throws(() => writeProperties('./writetestdata/test.properties', obj));
});

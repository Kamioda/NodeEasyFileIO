import { readFile, readCSV, readJson, readProperties } from '../dist/main/index.js';
import test from 'ava';

test('Read Text File/OK', t => {
    const expect = 'Hello World!';
    t.is(readFile('./readtestdata/test.txt'), expect);
});

test('Read Text File/File is not found', t => {
    t.throws(() => readFile('./readtestdata/hello.txt'));
});

test('Read CSV 1', t => {
    const expect = [['Hello', 'World!']];
    const ReadResult = readCSV('./readtestdata/test1.csv');
    expect.forEach((arr, pIndex) => {
        arr.forEach((val, sIndex) => {
            t.is(ReadResult[pIndex][sIndex], val);
        });
    });
});

test('Read CSV 2', t => {
    const expect = [
        ['Hello', 'World!'],
        ['Hello', 'Tokyo'],
    ];
    const ReadResult = readCSV('./readtestdata/test2.csv');
    expect.forEach((arr, pIndex) => {
        arr.forEach((val, sIndex) => {
            t.is(ReadResult[pIndex][sIndex], val);
        });
    });
});

test('Read JSON File', t => {
    const expect = {
        id: 'helloworld',
        name: 'Hello World!',
        url: 'https://www.kamioda.tokyo/',
    };
    t.deepEqual(readJson('./readtestdata/test.json'), expect);
});

test('Read Properties File', t => {
    const expect = {
        id: 'helloworld',
        name: 'Hello World!',
        url: 'https://www.kamioda.tokyo/',
    };
    t.deepEqual(readProperties('./readtestdata/test.properties'), expect);
});

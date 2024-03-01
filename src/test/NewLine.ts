import IO from '../main/NewLine';
import test from 'ava';

test('New Line Test', t => {
    t.is(IO.NewLine, process.platform === 'win32' ? '\r\n' : '\n');
});
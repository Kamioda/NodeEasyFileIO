import IO from './NewLine';

test('New Line Test', () => {
    expect(IO.NewLine).toBe(process.platform === 'win32' ? '\r\n' : '\n');
});

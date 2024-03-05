const IO = {
    get NewLine() {
        return process.platform === 'win32' ? '\r\n' : '\n';
    },
};

export default IO;

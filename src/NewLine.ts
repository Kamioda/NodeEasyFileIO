const IO = {
    get NewLine() {
        /* c8 ignore next */
        return process.platform === 'win32' ? '\r\n' : '\n';
    },
};

export default IO;

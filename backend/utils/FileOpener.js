const open = require('open');

class FileOpener {
    constructor() {
        this.opener = this.getCommandLine();
    }
    getCommandLine() {
        switch (process.platform) { 
            case 'darwin' : return 'open';
            case 'win32' : return 'start';
            case 'win64' : return 'start';
            default : return 'xdg-open';
        }
    }
    openFile = async (filePath) => {
        // const exec = require('child_process').exec;
        console.log(`Opening: ${filePath}`);
        await open(filePath);
    }
}

module.exports = new FileOpener();
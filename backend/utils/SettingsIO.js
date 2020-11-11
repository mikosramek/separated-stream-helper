const fs = require('fs');
const path = require('path');

const BASE_FOLDER = path.join(require('os').homedir() + '/.ca.mikosramek.stream-helper/');

class SettingsIO {

  async getSettings(filename) {
    const settingsExist = this.checkForFile(filename);
    if (settingsExist) {
      try {
        const settings = await this.getFileContents(filename);
        if (Object.entries(settings).length > 0) return settings;
        else return false;
      }
      catch (error) {
        throw error;
      }
    }
    else {
      return null;
    }
  }

  writeFileSettings(filename, settings) {
    fs.writeFile(
      BASE_FOLDER + filename,
      JSON.stringify(settings, null, 2),
      (err) => {
        if (err) throw err;
      }
    );
  }

  checkForFolder() {
    const folderExists = fs.existsSync(BASE_FOLDER);
    if (!folderExists) {
      fs.mkdirSync(BASE_FOLDER, (err) => {
        if (err) throw err;
      });
    }
  }

  createBaseFile(filename) {
    fs.writeFileSync(
      BASE_FOLDER + filename,
      JSON.stringify({}),
      'utf-8',
      (err) => {
        if (err) throw err;
      }
    );
  }

  checkForFile(filename) {
    const fileExists = fs.existsSync(BASE_FOLDER + filename);
    if (!fileExists) {
      this.createBaseFile(filename);
      return false;
    }
    return true;
  }

  getFileContents(filename) {
    return new Promise((res, rej) => {
      fs.readFile(BASE_FOLDER + filename, 'utf-8', (err, data) => {
        if (err) rej(err);
        res(JSON.parse(data));
      })
    });
  }
}

module.exports = new SettingsIO();

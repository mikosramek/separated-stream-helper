const { exec } = require("child_process");

class TextToSpeech {
    say(words) {
        console.log('Saying: ', words);
        exec(`espeak -s 225 -p 75 "${words}"`, (error, stdout, stderr) => {
            if (error) {
                console.log(`error: ${error.message}`);
                return;
            }
            if (stderr) {
                console.log(`stderr: ${stderr}`);
                return;
            }
        });
    }
}

module.exports = new TextToSpeech();
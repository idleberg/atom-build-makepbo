'use babel';

import {exec} from 'child_process';
import os from 'os';

export function provideBuilder() {

  return class MakepboProvider {
    constructor(cwd) {
      this.cwd = cwd;
    }

    getNiceName() {
      return 'MakePBO';
    }

    isEligible() {
      if (os.platform() === 'win32') {
        exec('where makepbo', function(error, stdout, stderr) {
            if (error !== null) {
                console.log('[build-innosetup] makepbo.exe is not in your PATH environment variable');
                return false;
            }
        });
        return true;
      }
      // not on Windows, sorry
      return false;
    }

    settings() {

      const errorMatch = [
        // 'Error on line (?<line>\\d+) in (?<file>.*\\.iss): (?<message>.+)\\r?\\nCompile aborted\\.'
      ];


      return [
        {
          name: 'MakePbo',
          exec: 'makepbo.exe',
          args: [ '-L', '-B', '-G', '{FILE_ACTIVE_PATH}', '{FILE_ACTIVE_NAME}' ],
          cwd: '{FILE_ACTIVE_PATH}',
          sh: false,
          keymap: 'alt-cmd-b',
          atomCommandName: 'MakePbo:compile',
          errorMatch: errorMatch
        }
      ];
    }
  }
}

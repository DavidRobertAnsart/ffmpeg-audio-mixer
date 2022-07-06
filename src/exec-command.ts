import { execSync } from 'child_process';

import { throwError } from './throw-error';

export function execCommand(command: string) {
    return new Promise<string>((resolve, reject) => {
        try {
            resolve(
                execSync(`${command} -hide_banner -loglevel error`, {
                    stdio: 'pipe',
                    encoding: 'utf-8',
                }),
            );
        } catch (e) {
            reject(throwError(e));
        }
    });
}

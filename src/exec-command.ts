import { spawn } from 'child_process';

export function execCommand(command: string, args: string[]): Promise<void>;
export function execCommand(command: string, args: string[], outputStream: false): Promise<void>;
export function execCommand(
    command: string,
    args: string[],
    outputStream: true,
): NodeJS.ReadableStream;
export function execCommand(
    command: string,
    args: string[],
    outputStream?: boolean,
): Promise<void> | NodeJS.ReadableStream {
    const process = spawn(command, args);
    process.stderr.setEncoding('utf-8');

    // Temporary
    process.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
    });

    const execPromise = new Promise<void>((resolve, reject) => {
        let processHasError = false;
        process.on('error', () => {
            processHasError = true;
            reject(new Error('FFmpeg is not available.'));
        });
        process.on('close', (code, signal) => {
            if (!processHasError && signal !== null) {
                reject(new Error(`FFmpeg was killed with signal ${signal}`));
            } else if (!processHasError && code !== 0) {
                reject(new Error(`FFmpeg exited with code ${code}`));
            } else if (!processHasError) {
                resolve();
            }
        });
    });

    if (outputStream) {
        execPromise.catch((e) => {
            throw e;
        });
        return process.stdout;
    } else {
        return execPromise;
    }
}

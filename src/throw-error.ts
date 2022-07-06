import type { SpawnSyncReturns } from 'child_process';

const isSpawnSyncError = (error: unknown): error is SpawnSyncReturns<string> =>
    typeof error === 'object' &&
    error !== null &&
    Object.prototype.hasOwnProperty.call(error, 'status');

export function throwError(error: unknown) {
    if (isSpawnSyncError(error)) {
        if (error.status === 127) {
            return new Error('FFmpeg is not available.');
        } else {
            return new Error(error.stderr || 'An unknown error happened.');
        }
    } else {
        return new Error('An unknown error happened.');
    }
}

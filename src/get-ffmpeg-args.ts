import type { InputOptions, OutputOptions } from './tune.types';

export type Output =
    | {
          kind: 'file';
          fileName: string;
      }
    | {
          kind: 'stream';
          fileFormat: string;
      };

export function getFfmpegArgs(inputs: InputOptions[], options: OutputOptions, output: Output) {
    const args: string[] = [];

    // [1] Global options.
    args.push('-hide_banner', '-loglevel', 'error');

    // [2] Overwrite for file outputs.
    if (output.kind === 'file') {
        args.push('-y');
    }

    // [3] Add inputs.
    for (const input of inputs) {
        args.push('-i', input.inputFile);
    }

    // [4] Add complex filter.
    const complexFilters = getMixedComplexFilters(inputs);
    if (options.volume) {
        complexFilters.push(`volume=${options.volume}`);
    }
    if (complexFilters.length > 0) {
        args.push('-filter_complex', complexFilters.join(','));
    }

    // [5] Add output options.
    if (options.codec !== undefined) {
        args.push('-codec:a', options.codec);
    }
    if (options.frames !== undefined) {
        args.push('-frames:a', `${options.frames}`);
    }
    if (options.sampleFormat !== undefined) {
        args.push('-sample_fmt:a', options.sampleFormat);
    }

    // [6] Add output path: filename or 'pipe:1' to stream to stdout.
    if (output.kind === 'stream') {
        args.push('-f', output.fileFormat);
    }
    args.push(output.kind === 'file' ? output.fileName : 'pipe:1');

    return args;
}

// Mix inputs together
function getMixedComplexFilters(inputs: InputOptions[]) {
    const complexFilters: string[] = [];
    const inputsNames = Object.keys(inputs);
    for (let i = 0; i < inputs.length; i++) {
        const input = inputs[i];
        if (input.delay !== undefined && input.delay !== 0) {
            complexFilters.push(`[${i}]adelay=${input.delay}:1[${i}bis]`);
            inputsNames[i] = `${i}bis`;
        }
    }
    if (inputs.length > 1) {
        complexFilters.push(
            `[${inputsNames.join('][')}]amix=inputs=${
                inputs.length
            }:duration=longest:weights=${inputs.map((i) => i.weight ?? 1).join(' ')}`,
        );
    }
    return complexFilters;
}

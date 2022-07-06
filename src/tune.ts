import { execCommand } from './exec-command';
import type { InputOptions, OutputOptions, Codecs, SampleFormats } from './tune.types';

const getInput = (input: string | InputOptions) =>
    typeof input === 'string'
        ? {
              inputFile: input,
          }
        : input;

export class Tune {
    private inputs: InputOptions[];
    private options: OutputOptions;

    public constructor(input: string | InputOptions, options?: OutputOptions) {
        this.inputs = [getInput(input)];
        this.options = options || {};
    }

    // --- Inputs ---
    public addInput(input: string | InputOptions) {
        this.inputs.push(getInput(input));
        return this;
    }

    // --- Options ---
    public setFrames(frames: number) {
        this.options.frames = frames;
        return this;
    }
    public setCodec(codec: Codecs) {
        this.options.codec = codec;
        return this;
    }
    public setSampleFormat(sampleFormat?: SampleFormats) {
        this.options.sampleFormat = sampleFormat;
        return this;
    }
    public setVolume(volume: number) {
        this.options.volume = volume;
        return this;
    }

    // --- Processing ---
    public async toFile(outputFile: string): Promise<string> {
        if (!outputFile) {
            throw new Error('Missing output file path');
        }

        // [1] Add inputs.
        let command = `ffmpeg -y`;
        for (const input of this.inputs) {
            command += ` -i ${input.inputFile}`;
        }

        // [3] Set complex filter.
        const complexFilter: string[] = [];
        const inputsNames = Object.keys(this.inputs);
        for (let i = 0; i < this.inputs.length; i++) {
            const input = this.inputs[i];
            if (input.delay !== undefined && input.delay !== 0) {
                complexFilter.push(`[${i}]adelay=${input.delay}:1[${i}bis]`);
                inputsNames[i] = `${i}bis`;
            }
        }
        if (this.inputs.length > 1) {
            complexFilter.push(
                `[${inputsNames.join('][')}]amix=inputs=${
                    this.inputs.length
                }:duration=longest:weights=${this.inputs.map((i) => i.weight ?? 1).join(' ')}`,
            );
        }
        if (this.options.volume !== undefined) {
            if (complexFilter.length > 0) {
                complexFilter.push(`volume=${this.options.volume}`);
            } else {
                command += ` -filter:a "volume=${this.options.volume}"`;
            }
        }
        if (complexFilter.length > 0) {
            command += ` -filter_complex "${complexFilter.join(',')}"`;
        }

        // [2] Set output options
        if (this.options.codec !== undefined) {
            command += ` -codec:a ${this.options.codec}`;
        }
        if (this.options.frames !== undefined) {
            command += ` -frames:a ${this.options.frames}`;
        }
        if (this.options.sampleFormat !== undefined) {
            command += ` -sample_fmt:a ${this.options.sampleFormat}`;
        }

        command += ` ${outputFile}`;
        await execCommand(command);
        return outputFile;
    }
}

export function tune(input: string | InputOptions, options?: OutputOptions) {
    return new Tune(input, options);
}

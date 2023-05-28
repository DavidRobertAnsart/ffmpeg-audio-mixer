import { execCommand } from './exec-command';
import { getFfmpegArgs } from './get-ffmpeg-args';
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
    public async toFile(outputFileName: string): Promise<string> {
        if (!outputFileName) {
            throw new Error('Missing output file path');
        }

        const args = getFfmpegArgs(this.inputs, this.options, {
            kind: 'file',
            fileName: outputFileName,
        });
        // eslint-disable-next-line no-console
        console.log(args);
        await execCommand('ffmpeg', args);
        return outputFileName;
    }

    public toStream(fileFormat: string) {
        if (!fileFormat) {
            throw new Error('Missing output file format');
        }

        const args = getFfmpegArgs(this.inputs, this.options, {
            kind: 'stream',
            fileFormat,
        });
        // eslint-disable-next-line no-console
        console.log(args);
        return execCommand('ffmpeg', args, true);
    }

    public toBuffer(fileFormat: string) {
        const outputStream = this.toStream(fileFormat);
        return new Promise<Buffer>((resolve, reject) => {
            const _buf = Array<Uint8Array>();
            outputStream.on('data', (chunk) => _buf.push(chunk));
            outputStream.on('end', () => resolve(Buffer.concat(_buf)));
            outputStream.on('error', (err) =>
                reject(`Error converting stream audio to buffer: ${err}`),
            );
        });
    }
}

export function tune(input: string | InputOptions, options?: OutputOptions) {
    return new Tune(input, options);
}

import { execCommand } from './exec-command';
import type {
    InputOptions,
    OutputOptions,
    AudioInput,
    Codecs,
    SampleFormats,
} from './ffmpeg-audio-mixer.types';
import { getFfmpegArgs } from './get-ffmpeg-args';

const getInput = (input: AudioInput): InputOptions =>
    typeof input === 'string'
        ? {
              inputFile: input,
          }
        : input;

export class AudioMixer {
    private inputs: InputOptions[];
    private options: OutputOptions;

    public constructor(inputs: AudioInput | AudioInput[], options?: OutputOptions) {
        this.inputs = Array.isArray(inputs) ? inputs.map(getInput) : [getInput(inputs)];
        this.options = options || {};
    }

    // --- Inputs ---
    public addInput(input: AudioInput) {
        this.inputs.push(getInput(input));
        return this;
    }

    // --- Options ---
    public setOptions(options: OutputOptions) {
        this.options = options;
        return this;
    }
    public setFrames(frames: number) {
        this.options.frames = frames;
        return this;
    }
    public setCodec(codec: Codecs) {
        this.options.codec = codec;
        return this;
    }
    public setSampleFormat(sampleFormat: SampleFormats) {
        this.options.sampleFormat = sampleFormat;
        return this;
    }
    public setVolume(volume: number) {
        this.options.volume = volume;
        return this;
    }

    // --- Processing ---
    public async toFile(outputFileName: string): Promise<void> {
        if (!outputFileName) {
            throw new Error('Missing output file path');
        }

        const args = getFfmpegArgs(this.inputs, this.options, {
            kind: 'file',
            fileName: outputFileName,
        });
        await execCommand('ffmpeg', args);
    }

    public toStream(fileFormat: string) {
        if (!fileFormat) {
            throw new Error('Missing output file format');
        }

        const args = getFfmpegArgs(this.inputs, this.options, {
            kind: 'stream',
            fileFormat,
        });
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

export function mixAudio(inputs: AudioInput | AudioInput[], options?: OutputOptions) {
    return new AudioMixer(inputs, options);
}

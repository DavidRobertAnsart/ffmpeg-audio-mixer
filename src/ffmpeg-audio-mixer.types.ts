export type Codecs =
    | 'aac'
    | 'ac3'
    | 'ac3_fixed'
    | 'flac'
    | 'opus'
    | 'libfdk_aac'
    | 'libmp3lame'
    | 'libopencore-amrnb'
    | 'libopus'
    | 'libshine'
    | 'libtwolame'
    | 'libvo-amrwbenc'
    | 'libvorbis'
    | 'mjpeg'
    | 'wavpack';

export type SampleFormats =
    | 'u8'
    | 's16'
    | 's32'
    | 'flt'
    | 'dbl'
    | 'u8p'
    | 's16p'
    | 's32p'
    | 'fltp'
    | 'dblp '
    | 's64'
    | 's64p';

export type InputOptions = {
    // Input file name.
    inputFile: string;
    // Audio input weight. (Optional, default is `1`)
    weight?: number;
    // Audio delay in ms. (Optional, default is `0`)
    delay?: number;
    // Audio trim in seconds.
    trim?: {
        start?: number;
        end?: number;
    };
};

export type AudioInput = string | InputOptions;

export type OutputOptions = {
    // Number of audio frames.
    frames?: number;
    // Audio codec.
    codec?: Codecs;
    // Audio sample format.
    sampleFormat?: SampleFormats;
    // Audio volume.
    volume?: number;
    // Audio normalization.
    normalize?: boolean;
};

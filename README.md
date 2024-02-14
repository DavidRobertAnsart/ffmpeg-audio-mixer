# Ffmpeg audio mixer

A node audio processing library using FFmpeg. It can convert audio files and mix them.

## Install

```bash
npm install ffmpeg-audio-mixer
```

or

```bash
yarn add ffmpeg-audio-mixer
```

## Example

Converting an audio file:
```typescript
import { mixAudio } from 'ffmpeg-audio-mixer';

await mixAudio('my-input.wav').toFile('my-output.mp3');
```

Mix audio files:
```typescript
import { mixAudio } from 'ffmpeg-audio-mixer';

await mixAudio([
    'input1.mp3',
    {
        inputFile: 'input2.mp3',
        weight: 0.5, // volume of this input is halved
    },
    {
        inputFile: 'input3.mp3',
        delay: 4000, // this input is delayed by 4 seconds
    },
])
    .setVolume(1.4) // Can increase/decrease the volume of the mixed audio
    .setFrames(1000) // Limit the number of frames to process
    .setCodec('libmp3lame') // Set the output codec
    .setSampleFormat('s16') // Set the output sample format
    .toBuffer('mp3'); // Can output to a file, stream or buffer.
```

## Documentation

**Constructor:**

```typescript
new AudioMixer(inputs: AudioInput | AudioInput[], options?: OutputOptions) -> AudioMixer
// or
mixAudio(inputs: AudioInput | AudioInput[], options?: OutputOptions) -> AudioMixer
```

Creates an instance of AudioMixer, to which further methods are chained.

- _inputs:_ Inputs to process.
- _options_: Output options: volume, frames, codec and sampleFormat.

**AddInput:**

```typescript
addInput(input: AudioInput) -> AudioMixer
```

- _input:_ Additional input to process.

**setOptions:**

```typescript
setOptions(options: OutputOptions) -> AudioMixer
```

- _options:_ Output options: volume, frames, codec and sampleFormat.

**setFrames**

```typescript
setFrames(frames: number) -> AudioMixer
```

- _frames:_ Set the number of audio frames to output.

**setCodec**

```typescript
setCodec(codec: string) -> AudioMixer
```

- _codec:_ Set the audio codec.

**setSampleFormat**

```typescript
setSampleFormat(sampleFormat: string) -> AudioMixer
```

- _sampleFormat:_ Set the audio sample format.

**setVolume**

```typescript
setVolume(volume: number) -> AudioMixer
```

- _sampleFormat:_ Set the audio output volume. Default is 1.

**toFile**

```typescript
toFile(outputFileName: string) -> Promise<void>
```

**toStream**

```typescript
toStream(fileFormat: string) -> NodeJS.ReadableStream
```

- _fileFormat:_ Format of the output. Ex: 'mp3', 'wav', ...

**toBuffer**

```typescript
toBuffer(fileFormat: string) -> Promise<Buffer>
```

- _fileFormat:_ Format of the output. Ex: 'mp3', 'wav', ...

## Contributing

Contributions, issues and feature requests are welcome!

## License

Copyrigth 2022 [David Robert-Ansart](mailto:david.robertansart@gmail.com)
This project is [MIT](https://github.com/DavidRobertAnsart/node-tune/blob/main/LICENSE) licensed.

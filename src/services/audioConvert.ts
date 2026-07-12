import ffmpeg from "fluent-ffmpeg";
import ffmpegInstaller from "@ffmpeg-installer/ffmpeg";
import { PassThrough, Readable } from "stream";

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

export function convertToPcmWav(inputBuffer: Buffer): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const input = Readable.from(inputBuffer);
    const output = new PassThrough();
    const chunks: Buffer[] = [];

    output.on("data", (chunk) => chunks.push(chunk));
    output.on("end", () => resolve(Buffer.concat(chunks)));
    output.on("error", reject);

    ffmpeg(input)
      .audioChannels(1)
      .audioFrequency(16000)
      .audioCodec("pcm_s16le")
      .format("wav")
      .on("error", (err) => reject(new Error(`Audio conversion failed: ${err.message}`)))
      .pipe(output, { end: true });
  });
}
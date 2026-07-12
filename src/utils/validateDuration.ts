import { parseBuffer } from "music-metadata";

export const MIN_DURATION_SECONDS = 30;
export const MAX_DURATION_SECONDS = 45;

export interface DurationCheckResult {
    ok: boolean;
    durationSeconds: number | null;
    message?: string;
}

export async function checkAudioDuration(
    buffer: Buffer,
    mimeType: string
): Promise<DurationCheckResult> {
    let durationSeconds: number | null = null;

    try {
        const metadata = await parseBuffer(buffer, mimeType);
        durationSeconds = metadata.format.duration ?? null;
    }
    catch (err) {
        return {
            ok: false, 
            durationSeconds: null,
            message: "Could not read this audio file. Try wav, mp3, m4a, or webm.",
        };
    }

    if (durationSeconds === null) {
        return { ok: false, durationSeconds: null, message: "Could not determine audio length."};
    }

    if (durationSeconds < MIN_DURATION_SECONDS || durationSeconds > MAX_DURATION_SECONDS) {
        return {
            ok: false,
            durationSeconds,
            message: `Recording is ${durationSeconds.toFixed(1)}s long. Please upload 30 to 45 seconds of speech.`,
        };
    }

    return { ok: true, durationSeconds };

}
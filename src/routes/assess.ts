import { Router } from "express";
import multer from "multer";
import { checkAudioDuration } from "../utils/validateDuration";
import { convertToPcmWav } from "../services/audioConvert";

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 },
});

router.post("/assess", upload.single("audio"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No audio file was uploaded." });
    }

    const durationCheck = await checkAudioDuration(req.file.buffer, req.file.mimetype);
    if (!durationCheck.ok) {
      return res.status(400).json({ error: durationCheck.message });
    }

    const wavBuffer = await convertToPcmWav(req.file.buffer);

    const convertedCheck = await checkAudioDuration(wavBuffer, "audio/wav");

    return res.json({
      originalDurationSeconds: durationCheck.durationSeconds,
      convertedSizeBytes: wavBuffer.length,
      convertedDurationSeconds: convertedCheck.durationSeconds,
      message: "Conversion check passed.",
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unexpected error.";
    return res.status(500).json({ error: message });
  }
});

export default router;
import { Router } from "express";
import multer from "multer";
import { checkAudioDuration } from "../utils/validateDuration";

const router = Router();

// memoryStorage means the file lives in RAM only, nver written to disk.

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 20 * 1024 * 1024 }, 
});

router.post("/assess", upload.single("audio"), async (req, res) => {
    if(!req.file) {
        return res.status(400).json({ error: "No audio file was uploaded."});
    }

    const durationCheck = await checkAudioDuration(req.file.buffer, req.file.mimetype);
    if(!durationCheck.ok) {
        return res.status(400).json({ error: durationCheck.message });
    }

    return res.json({ 
        durationSeconds: durationCheck.durationSeconds,
        message: "Duration check passed.",
    });
});

export default router;
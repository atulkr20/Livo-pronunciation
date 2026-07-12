import { Router } from "express";
import multer from "multer";

const router = Router();

// memoryStorage means the file lives in RAM only, nver written to disk.

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 20 * 1024 * 1024 }, 
});

router.post("/assess", upload.single("audio"), (req, res) => {
    if(!req.file) {
        return res.status(400).json({ error: "No audio file was uploaded."});
    }

    return res.json({ 
        receivedFileName: req.file.originalname,
        mimeType: req.file.mimetype,
        sizeBytes: req.file.size,
    });
});

export default router;
import { Router } from "express";
import { Request, Response } from "express-serve-static-core";
import { getBuckets, getUploadSignedUrl } from "../services/upload";

const router = Router();

router.get("/test", (req: Request, res: Response) => {
  try {
    res.send(["express app connected"]);
  } catch (error) {
    console.log(error);
  }
});

router.get("/upload-presign-url", getUploadSignedUrl);

router.get("/buckets", getBuckets);

export default router;

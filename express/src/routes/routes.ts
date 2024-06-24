import { Router } from "express";
import { Request, Response } from "express-serve-static-core";
import { getUploadSignedUrl } from "../services/upload";
import {
  getBuckets,
  getBucketObjectByKey,
  getBucketObjectsList,
} from "../services/read";
import { getObjectDownloadUrl } from "../services/download";
import { deleteObjectByKey } from "../services/delete";

const router = Router();

router.get("/test", (req: Request, res: Response) => {
  try {
    res.send(["express app connected"]);
  } catch (error) {
    console.log(error);
  }
});

router.get("/upload", getUploadSignedUrl);

router.get("/buckets", getBuckets);

router.get("/object", getBucketObjectByKey);

router.delete("/object", deleteObjectByKey);

router.get("/objects-list", getBucketObjectsList);

router.get("/download", getObjectDownloadUrl);

export default router;

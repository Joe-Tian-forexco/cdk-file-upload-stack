import { Router } from "express";
import { getBuckets, getUploadSignedUrl, getDownloadSignedUrl, getUsersTest, getSuperTest, deleteBucketObject, getBucketObjects } from "../services/upload";

const router = Router();

router.get("/upload-presign-url", getUploadSignedUrl);

router.get("/buckets", getBuckets);

router.get("/bucket/objects", getBucketObjects);

router.get("/download-presign-url", getDownloadSignedUrl);

router.get("/test", getUsersTest);

router.get("/supertest", getSuperTest);

router.delete("/s3-object", deleteBucketObject);

export default router;

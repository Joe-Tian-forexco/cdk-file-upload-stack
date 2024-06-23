import { Router } from "express";
import { Request, Response } from "express-serve-static-core";

const router = Router();

router.get("/test", (req: Request, res: Response) => {
  try {
    res.send(["express app connected"]);
  } catch (error) {
    console.log(error);
  }
});

export default router;

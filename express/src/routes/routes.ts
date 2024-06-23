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

router.get("/test2", (req: Request, res: Response) => {
  try {
    res.send(["express app connected test 2"]);
  } catch (error) {
    console.log(error);
  }
});

export default router;

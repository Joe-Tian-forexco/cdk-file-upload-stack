import express from "express";
import dotenv from "dotenv";
import router from "./routes/upload";

dotenv.config();

const app = express();

app.use("/api", router);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

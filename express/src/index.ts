import express from "express";
import dotenv from "dotenv";
import router from "./routes/routes";

dotenv.config();

const app = express();

app.use("/api", router);

const PORT = process.env.PORT || 5234;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

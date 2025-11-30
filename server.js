// server.js
import mongoose from "mongoose";
import config from "./config/config.js";
import app from "./server/express.js";

mongoose.Promise = global.Promise;

mongoose
  .connect(config.mongoUri)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

mongoose.connection.on("error", () => {
  throw new Error(`Unable to connect to database: ${config.mongoUri}`);
});

// Root route for testing
app.get("/", (req, res) => {
  res.json({ message: "Food Ordering API is running." });
});

app.listen(config.port, (err) => {
  if (err) {
    console.error(err);
  }
  console.info(`Server started on port ${config.port}`);
});

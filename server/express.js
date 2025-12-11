// server/express.js
import express from "express";
import cors from "cors";
import morgan from "morgan";

import authRoutes from "./routes/auth.routes.js";
import restaurantRoutes from "./routes/restaurant.routes.js";
import menuItemRoutes from "./routes/menuItem.routes.js";
import orderRoutes from "./routes/order.routes.js";
import uploadRoutes from "./routes/upload.routes.js";
import imageRoutes from "./routes/image.routes.js";
import userRoutes from "./routes/user.routes.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Routes
app.use("/auth", authRoutes);
app.use("/api/restaurants", restaurantRoutes);
app.use("/api/menuitems", menuItemRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/images", imageRoutes);
app.use("/api/users", userRoutes);

export default app;

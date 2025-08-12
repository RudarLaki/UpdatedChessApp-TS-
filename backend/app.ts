import express from "express";
//import morgan from "morgan";
import cors from "cors";

import authRoutes from "./routes/authRoutes";
import usersRoutes from "./routes/usersRoutes";

// create the Express app
const app = express();
// setup morgan which gives us http request logging
//app.use(morgan("dev"));

app.use(
  cors({
    origin: "http://13.61.15.90/", // Your frontend
    methods: ["GET", "POST", "PUT", "DESTROY"],
  })
);

// set up Express to work with JSON
app.use(express.json());

// setup a friendly greeting for the root route
app.use("/auth", authRoutes);
app.use("/users", usersRoutes);

// send 404 if no other route matched
app.use((req, res) => {
  res.status(404).json({
    message: "Route Not Found",
  });
});

app.set("port", process.env.PORT || 3000);

export default app;

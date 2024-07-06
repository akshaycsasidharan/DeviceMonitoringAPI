import express from "express";
import productRoute from "./routes/product.route.js";
import { connectToMongoDB } from "./connection/connection.js";

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Database connection
connectToMongoDB()
  .then(() => {
    console.log("Successfully connected to the database");

    // Routes
    app.use("/api", productRoute);

    // Catch 404 and forward to error handler
    app.use((req, res, next) => {
      const error = new Error("Not Found");
      error.status = 404;
      next(error);
    });

    // Error handler
    app.use((err, req, res, next) => {
      res.locals.message = err.message;
      res.locals.error = req.app.get("env") === "development" ? err : {};

      res.status(err.status || 500);
      res.json({ error: err.message });
    });
  })
  .catch((error) => {
    console.error("Failed to connect to the database:", error);
    process.exit(1); // Exit the process with an error code
  });

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

export default app;

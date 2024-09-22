const express = require("express");
const { connectToMongoDB } = require("./connect");
const urlRoute = require("./routes/url");
const URL = require("./models/url");
const app = express();

const PORT = 8001;

// Connect to MongoDB
connectToMongoDB("mongodb://localhost:27017/short-url")
  .then(() => console.log("MongoDB connected"))
  .catch((error) => console.error("MongoDB connection error:", error));

// Middleware to parse JSON
app.use(express.json());

// Use the URL routes
app.use("/url", urlRoute);

// Redirect route to handle short IDs
app.get("/:shortID", async (req, res) => {
  const shortID = req.params.shortID; // Ensure correct parameter name
  try {
    const entry = await URL.findOneAndUpdate(
      { shortID: shortID }, // Correct field name
      {
        $push: {
          visitHistory: {
            // Correct field name for visit history
            timestamp: Date.now(),
          },
        },
      },
      { new: true } // Return the updated document
    );

    // Check if entry exists before redirecting
    if (!entry) {
      return res.status(404).json({ error: "URL not found" });
    }

    // Redirect to the original URL
    res.redirect(entry.redirectURL);
  } catch (error) {
    console.error("Error fetching URL:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// Start the server
app.listen(PORT, () => console.log(`Server started at port: ${PORT}`));

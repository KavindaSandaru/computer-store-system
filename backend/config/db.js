const fs = require("fs");
const mongoose = require("mongoose");

const dockerMongoUri =
  "mongodb://mongodb:27017/computer-store";

const connectDB = async () => {
  const configuredMongoUri =
    process.env.MONGODB_URI?.trim();
  const isDocker = fs.existsSync("/.dockerenv");
  const isPlaceholder =
    configuredMongoUri ===
    "your_mongodb_connection_string";
  const mongoUri =
    isDocker && (!configuredMongoUri || isPlaceholder)
      ? dockerMongoUri
      : configuredMongoUri;

  if (!mongoUri) {
    throw new Error(
      "MONGODB_URI is not defined. Set it in backend/.env or docker-compose.yml."
    );
  }

  if (
    !mongoUri.startsWith("mongodb://") &&
    !mongoUri.startsWith("mongodb+srv://")
  ) {
    throw new Error(
      'MONGODB_URI must start with "mongodb://" or "mongodb+srv://".'
    );
  }

  await mongoose.connect(mongoUri, {
    serverSelectionTimeoutMS: 10000,
  });

  console.log("MongoDB Connected");
};

module.exports = connectDB;

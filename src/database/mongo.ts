import mongoose from "mongoose";

import { config } from "../config";

export const connectMongoDB =
  async () => {

    try {

      await mongoose.connect(
        config.mongo.uri
      );

      console.log(
        "MongoDB connected successfully"
      );

    } catch (error) {

      console.error(
        "MongoDB connection failed",
        error
      );

      process.exit(1);

    }
};
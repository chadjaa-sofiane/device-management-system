import { Schema, model } from "mongoose";

const deviceSchema = new Schema(
  {
    systemId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
    },
    operatingSystem: {
      type: String,
      required: true,
    },
    pictureUrl: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
  },
);

const Device = model("devices", deviceSchema);

export default Device;

import { Schema, model } from "mongoose";

const operatingSystemSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  version: {
    type: String,
    required: true,
  },
  architecture: {
    type: String,
    required: true,
  },
});

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
      type: operatingSystemSchema,
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

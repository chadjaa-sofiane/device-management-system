import validate from "@/middlewares/validate";
import upload from "@/middlewares/fileUpload";
import { Router } from "express";
import { createDevice, createDeviceSchema } from "./controllers/createDevice";
import { deleteDevice, deleteDeviceSchema } from "./controllers/deleteDevice";
import {
  getDeviceById,
  getDeviceByIdSchema,
} from "./controllers/getDeviceById";
import { getDevices, getDevicesSchema } from "./controllers/getDevices";
import { updateDeviceSchema, updateDevice } from "./controllers/updateDevice";
import multer from "multer";

const deviceRouter = Router();

deviceRouter.get("/", validate(getDevicesSchema), getDevices);
deviceRouter.get("/:id", validate(getDeviceByIdSchema), getDeviceById);
deviceRouter.post(
  "/",
  upload.single("picture"),
  validate(createDeviceSchema),
  createDevice,
);
deviceRouter.delete("/:id", validate(deleteDeviceSchema), deleteDevice);
deviceRouter.patch("/:id", validate(updateDeviceSchema), updateDevice);

export default deviceRouter;

import validate from "@/middlewares/validate";
import { Router } from "express";
import { createDevice, createDeviceSchema } from "./controllers/createDevice";
import { deleteDevice, deleteDeviceSchema } from "./controllers/deleteDevice";
import {
  getDeviceById,
  getDeviceByIdSchema,
} from "./controllers/getDeviceById";
import { getDevices, getDevicesSchema } from "./controllers/getDevices";

const deviceRouter = Router();

deviceRouter.get("/", validate(getDevicesSchema), getDevices);
deviceRouter.get("/:id", validate(getDeviceByIdSchema), getDeviceById);
deviceRouter.post("/", validate(createDeviceSchema), createDevice);
deviceRouter.delete("/:id", validate(deleteDeviceSchema), deleteDevice);

export default deviceRouter;

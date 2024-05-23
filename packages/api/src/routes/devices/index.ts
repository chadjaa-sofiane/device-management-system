import validate from "@/middlewares/validate";
import { Router } from "express";
import { createDevice, createDeviceSchema } from "./controllers/createDevice";
import { getDevices, getDevicesSchema } from "./controllers/getDevices";
import {
  getDeviceById,
  getDeviceByIdSchema,
} from "./controllers/getDeviceById";

const deviceRouter = Router();

deviceRouter.get("/", validate(getDevicesSchema), getDevices);
deviceRouter.get("/:id", validate(getDeviceByIdSchema), getDeviceById);
deviceRouter.post("/", validate(createDeviceSchema), createDevice);

export default deviceRouter;

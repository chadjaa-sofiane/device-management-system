import validate from "@/middlewares/validate";
import { Router } from "express";
import { createDevice, createDeviceSchema } from "./controllers/createDevice";
import { getDevices, getDevicesSchema } from "./controllers/getDevices";

const deviceRouter = Router();

deviceRouter.get("/", validate(getDevicesSchema), getDevices);
deviceRouter.post("/", validate(createDeviceSchema), createDevice);

export default deviceRouter;

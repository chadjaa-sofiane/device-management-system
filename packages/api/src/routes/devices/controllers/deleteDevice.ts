import Device from "@/models/devices";
import type { Request, Response } from "express";
import { Types } from "mongoose";
import { z } from "zod";

export const deleteDeviceSchema = z.object({
  params: z.object({
    id: z
      .string()
      .refine(
        (val) => Types.ObjectId.isValid(val),
        "Please provide a valid id",
      ),
  }),
});

type Params = z.infer<typeof deleteDeviceSchema>["params"];

export const deleteDevice = async (req: Request<Params>, res: Response) => {
  try {
    const { id } = req.params;

    const device = await Device.findOne({ _id: id });
    if (!device) {
      return res.status(404).json({ error: "Device not found", data: null });
    }

    await Device.deleteOne({ _id: id });
    return res
      .status(200)
      .json({ message: "Device deleted successfully", data: null });
  } catch (error) {
    return res.status(500).json(error);
  }
};

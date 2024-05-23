import Device from "@/models/devices";
import type { Request, Response } from "express";
import { Types } from "mongoose";
import { z } from "zod";

export const getDeviceByIdSchema = z.object({
  params: z.object({
    id: z
      .string()
      .refine(
        (val) => Types.ObjectId.isValid(val),
        "Please provide a valid id",
      ),
  }),
});

type Params = z.infer<typeof getDeviceByIdSchema>["params"];

export const getDeviceById = async (req: Request<Params>, res: Response) => {
  try {
    const { id } = req.params;
    const device = await Device.findOne({ _id: id });
    if (!device) {
      return res.status(404).json({ error: "Device not found", data: null });
    }
    return res.status(200).json({ data: device, error: null });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

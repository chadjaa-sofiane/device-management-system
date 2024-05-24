import { ARCHITECTURES, OPERATING_SYSTEM_NAME } from "@/lib/constants";
import Device from "@/models/devices";
import type { Request, Response } from "express";
import { Types } from "mongoose";
import { z } from "zod";

export const updateDeviceSchema = z.object({
  body: z
    .object({
      name: z.string().min(1).optional(),
      operatingSystem: z
        .object({
          name: z.enum(OPERATING_SYSTEM_NAME).optional(),
          // TODO: update the regex to it accept xx.xx format
          version: z
            .string()
            .regex(
              /^\d+\.\d+\.\d+$/,
              "Version must be a valid semantic version number (e.g., 10.0.0, 22.04)",
            )
            .optional(),
          architecture: z.enum(ARCHITECTURES).optional(),
        })
        .strict()
        .optional(),
    })
    .strict()
    .refine((val) => Object.keys(val).length > 0, {
      message: "At least one field must be provided in the body",
      path: ["body"],
    }),
  params: z.object({
    id: z
      .string()
      .refine(
        (val) => Types.ObjectId.isValid(val),
        "Please provide a valid id",
      ),
  }),
});

type Body = z.infer<typeof updateDeviceSchema>["body"];
type Params = z.infer<typeof updateDeviceSchema>["params"];

export const updateDevice = async (
  req: Request<Params, unknown, Body>,
  res: Response,
) => {
  try {
    const updateFields = req.body;
    const { id } = req.params;

    const device = await Device.findOne({ _id: id }).lean();
    if (!device) {
      return res.status(404).json({ error: "Device not found", data: null });
    }

    if (updateFields.operatingSystem) {
      updateFields.operatingSystem = {
        ...device.operatingSystem,
        ...updateFields.operatingSystem,
      };
    }

    const updateDevice = await Device.findOneAndUpdate(
      { _id: id },
      { $set: updateFields },
      {
        new: true,
      },
    );

    if (!updateDevice) {
      return res.status(500).json({ error: "Failed to update device" });
    }

    return res.status(200).json({ data: updateDevice, error: null });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error", data: null });
  }
};

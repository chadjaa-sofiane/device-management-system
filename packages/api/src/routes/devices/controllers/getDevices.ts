import Device from "@/models/devices";
import { z } from "zod";
import type { Request, Response } from "express";

const convertToNumber = (schema: z.ZodTypeAny) =>
  z.preprocess((val) => (val ? parseInt(val as string) : undefined), schema);

export const getDevicesSchema = z.object({
  query: z.object({
    page: convertToNumber(z.number().min(1).optional()),
    limit: convertToNumber(z.number().min(1).max(1000).optional()),
  }),
});

type Query = z.infer<typeof getDevicesSchema>["query"];

export const getDevices = async (
  req: Request<{}, {}, {}, Query>,
  res: Response,
) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const result = await Device.aggregate([
      {
        $facet: {
          data: [
            { $sort: { createdAt: -1 } },
            { $skip: skip },
            { $limit: limit },
          ],
          totalCount: [{ $count: "count" }],
        },
      },
    ]);
    const data = result[0].data;
    const totalCount = result[0].totalCount[0]
      ? result[0].totalCount[0].count
      : 0;
    const totalPages = Math.ceil(totalCount / limit);

    return res.status(200).json({
      data,
      totalCount,
      totalPages,
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};

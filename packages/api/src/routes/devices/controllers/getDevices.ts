import { zodStringToNumber } from "@/lib/utils";
import Device from "@/models/devices";
import type { Request, Response } from "express";
import { z } from "zod";

export const getDevicesSchema = z.object({
  query: z.object({
    page: zodStringToNumber(z.number().min(1).optional()),
    limit: zodStringToNumber(z.number().min(1).max(1000).optional()),
  }),
});

type Query = z.infer<typeof getDevicesSchema>["query"];

export const getDevices = async (
  req: Request<{}, {}, {}, Query>,
  res: Response,
) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const _page = parseInt(page as string);
    const _limit = parseInt(limit as string);

    const skip = (_page - 1) * _limit;

    const result = await Device.aggregate([
      {
        $facet: {
          data: [
            { $sort: { createdAt: -1 } },
            { $skip: skip },
            { $limit: _limit },
          ],
          totalCount: [{ $count: "count" }],
        },
      },
    ]);
    const data = result[0].data;
    const totalCount = result[0].totalCount[0]
      ? result[0].totalCount[0].count
      : 0;
    const totalPages = Math.ceil(totalCount / _limit);

    return res.status(200).json({
      data,
      totalCount,
      totalPages,
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};

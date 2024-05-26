import { ARCHITECTURES, OPERATING_SYSTEM_NAME } from "@/lib/constants";
import { MongooseError } from "@/lib/utils";
import { ZodError, z } from "zod";

const BASE_URL = "http://localhost:3000";

export type Device = {
  _id: string;
  systemId: string;
  name: string;
  operatingSystem: {
    name: string;
    version: string;
    architecture: string;
  };
  pictureUrl: string;
  createdAt: string;
  updatedAt: string;
};

export type CustomError = {
  status: number;
  statusText: string;
  error: ZodError | MongooseError;
};

export const fetchDevices = async () => {
  const response = await fetch(`${BASE_URL}/devices`);
  const data = await response.json();

  if (!response.ok) {
    throw {
      status: response.status,
      statusText: response.statusText,
      error: data.error,
    } as CustomError;
  }
  return {
    data: data.data,
    totalCount: data.totalCount,
  } as { data: Device[]; totalCount: number };
};

export const createDeviceSchema = z.object({
  systemId: z.string().min(1),
  name: z.string().min(1),
  operatingSystem: z.object({
    name: z.enum(OPERATING_SYSTEM_NAME),
    version: z
      .string()
      .regex(
        /^\d+\.\d+\.\d+$/,
        "Version must be a valid semantic version number (e.g., 10.0.0, 22.04)",
      ),
    architecture: z.enum(ARCHITECTURES),
  }),
});

export type CreateDeviceInputs = z.infer<typeof createDeviceSchema>;

export const createDevice = async (inputs: CreateDeviceInputs) => {
  const response = await fetch(`${BASE_URL}/devices`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(inputs),
  });

  const data = await response.json();

  if (!response.ok) {
    throw {
      status: response.status,
      statusText: response.statusText,
      error: data.error,
    } as CustomError;
  }
  return { data: data.data } as { data: Device };
};

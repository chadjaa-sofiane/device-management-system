import { ARCHITECTURES, OPERATING_SYSTEM_NAME } from "@/lib/constants";
import { MongooseError } from "@/lib/utils";
import { ZodError, z } from "zod";

export const BASE_URL = "http://localhost:3000";

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

export const fetchDevices = async (queries = { page: 1, limit: 5 }) => {
  const { page = 1, limit = 10 } = queries;

  const response = await fetch(
    `${BASE_URL}/devices?${new URLSearchParams({ page: page.toString(), limit: limit.toString() })}`,
  );
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
  picture: z.instanceof(FileList).optional(),
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
  const formData = new FormData();

  formData.append("systemId", inputs.systemId);
  formData.append("name", inputs.name);
  if (inputs.picture) {
    formData.append("picture", inputs.picture[0]);
  }
  formData.append("operatingSystem[name]", inputs.operatingSystem.name);
  formData.append("operatingSystem[version]", inputs.operatingSystem.version);
  formData.append(
    "operatingSystem[architecture]",
    inputs.operatingSystem.architecture,
  );

  console.log("this is the formData", formData);
  const response = await fetch(`${BASE_URL}/devices`, {
    method: "POST",
    body: formData,
  });

  const data = await response.json();

  console.log(data);
  if (!response.ok) {
    throw {
      status: response.status,
      statusText: response.statusText,
      error: data.error,
    } as CustomError;
  }
  return { data: data.data } as { data: Device };
};

export const deleteDevice = async (id: string) => {
  const response = await fetch(`${BASE_URL}/devices/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();

  if (!response.ok) {
    throw {
      status: response.status,
      statusText: response.statusText,
      error: data.error,
    } as CustomError;
  }

  return { message: data.message } as { message: string };
};

const stringPreProcess = (name: unknown) => {
  if (!name || typeof name !== "string") return undefined;
  return name.trim() === "" ? undefined : name;
};

export const updateDeviceSchema = z.object({
  systemId: z.preprocess(stringPreProcess, z.string().min(1).optional()),
  name: z.preprocess(stringPreProcess, z.string().min(1).optional()),
  picture: z.instanceof(FileList).optional(),
  operatingSystem: z
    .object({
      name: z.preprocess(
        stringPreProcess,
        z.enum(OPERATING_SYSTEM_NAME).optional(),
      ),
      version: z.preprocess(
        stringPreProcess,
        z
          .string()
          .regex(
            /^\d+\.\d+\.\d+$/,
            "Version must be a valid semantic version number (e.g., 10.0.0, 22.04)",
          )
          .optional(),
      ),
      architecture: z.preprocess(
        stringPreProcess,
        z.enum(ARCHITECTURES).optional(),
      ),
    })
    .optional(),
});

export type UpdateDeviceInputs = z.infer<typeof updateDeviceSchema>;

export const updateDevice = async (id: string, inputs: UpdateDeviceInputs) => {
  const response = await fetch(`${BASE_URL}/devices/${id}`, {
    method: "PATCH",
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

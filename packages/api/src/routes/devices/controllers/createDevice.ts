import Device from "@/models/devices";
import { z } from "zod";
import type { Request, Response } from "express";

const ARCHITECTURES = ["x86_64", "arm64", "arm", "ppc64le", "s390x"] as const;
const OPERATING_SYSTEM_NAME = [
  "windows",
  "linux",
  "darwin",
  "freebsd",
  "openbsd",
  "netbsd",
  "illumos",
  "sunos",
  "aix",
  "hp-ux",
  "cygwin",
  "macos",
  "ios",
  "android",
  "nacl",
  "plan9",
  "haiku",
  "qnx",
  "solaris",
  "z/os",
  "vms",
  "os/2",
  "amigaos",
  "riscos",
  "beos",
  "vxworks",
  "tizen",
  "blackberryos",
  "symbian",
  "palmos",
  "webos",
  "kaios",
  "contiki",
  "inferno",
  "zephyr",
  // easter egg
  "TempleOS",
] as const;

export const createDeviceSchema = z.object({
  body: z.object({
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
  }),
});

type Body = z.infer<typeof createDeviceSchema>["body"];

export const createDevice = async (
  req: Request<unknown, unknown, Body, { something: string }>,
  res: Response,
) => {
  try {
    const { systemId, name, operatingSystem } = req.body;
    const device = new Device({
      systemId,
      name,
      operatingSystem,
    });
    try {
      const savedDevice = await device.save();
      return res.status(200).json(savedDevice);
    } catch (error) {
      return res.status(409).json({ error, data: null });
    }
  } catch (error) {
    return res.status(500).json(error);
  }
};

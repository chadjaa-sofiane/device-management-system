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

export const fetchDevices = async () => {
  const response = await fetch(`${BASE_URL}/devices`);

  if (!response.ok) {
    throw {
      status: response.status,
      statusText: response.statusText,
      error: await response.json(),
    };
  }
  const { data, totalCount } = await response.json();
  return {
    data,
    totalCount,
  } as { data: Device[]; totalCount: number };
};

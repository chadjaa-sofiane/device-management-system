const BASE_URL = "http://localhost:3000";

export const fetchDevices = async () => {
  const response = await fetch(`${BASE_URL}/devices`);

  if (!response.ok) {
    throw {
      status: response.status,
      statusText: response.statusText,
      error: await response.json(),
    };
  }
  const { data } = await response.json();
  return data;
};

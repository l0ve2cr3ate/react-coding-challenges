import config from "./config";

export const getToken = async () => {
  const {
    api: { authUrl, clientId, clientSecret },
  } = config;
  const auth = btoa(`${clientId}:${clientSecret}`);
  const headers = {
    "Content-Type": "application/x-www-form-urlencoded",
    Authorization: `Basic ${auth}`,
  };

  const response = await fetch(`${authUrl}?grant_type=client_credentials`, {
    method: "POST",
    headers,
  });

  const data = await response.json();
  return data?.access_token;
};

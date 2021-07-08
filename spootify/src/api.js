import config from "./config";
import { getToken } from "./getToken";

const createHeaders = async () => {
  const token = await getToken();

  const headers = {
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  return headers;
};

const getData = async (url) => {
  const headers = await createHeaders();

  const response = await fetch(`${config.api.baseUrl}/${url}`, {
    headers,
  });
  return await response?.json();
};

export const fetchNewReleases = async () => {
  const data = await getData("browse/new-releases");

  return data.albums.items;
};

export const fetchFeaturedPlaylists = async () => {
  const data = await getData("browse/featured-playlists");

  return data.playlists.items;
};

export const fetchCategories = async () => {
  const data = await getData("browse/categories");

  return data.categories.items;
};

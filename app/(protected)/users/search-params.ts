import {
  parseAsString,
  parseAsInteger,
  parseAsArrayOf,
  createLoader,
} from "nuqs/server";

export const usersSearchParams = {
  page: parseAsInteger.withDefault(1),
  pageSize: parseAsInteger.withDefault(10),
  search: parseAsString.withDefault(""),
  role: parseAsArrayOf(parseAsString).withDefault([]),
  sortBy: parseAsString.withDefault("full_name"),
  sortOrder: parseAsString.withDefault("asc"),
};

export const loadUsersSearchParams = createLoader(usersSearchParams);

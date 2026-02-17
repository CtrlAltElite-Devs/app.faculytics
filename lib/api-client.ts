import createFetchClient from "openapi-fetch";
import createClient from "openapi-react-query";
import type { paths } from "@/app/schema/index";

export const fetchClient = createFetchClient<paths>({
  baseUrl: process.env.NEXT_PUBLIC_BACKEND_URL,
});

export const $api = createClient(fetchClient);

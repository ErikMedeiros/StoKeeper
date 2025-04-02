import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("storage", "./routes/storage.tsx"),
  route("stockrupture", "./routes/stockrupture.tsx"),
] satisfies RouteConfig;

import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("storage", "./routes/storage.tsx"),
  route("stockrupture", "./routes/stockrupture.tsx"),
  route("movements", "./routes/movements.tsx"),
  route("reports", "./routes/reports.tsx"),
  route("employee", "./routes/employee.tsx"),
  route("cadastro-user", "./routes/caduser.tsx"),
] satisfies RouteConfig;

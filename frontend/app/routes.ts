import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  index("routes/login.tsx"),

  layout("routes/private/layout.tsx", [
    route("storage", "routes/private/storage.tsx"),
    route("stockrupture", "routes/private/stockrupture.tsx"),
    route("movements", "routes/private/movements.tsx"),
    route("reports", "routes/private/reports.tsx"),
    route("employee", "routes/private/employee.tsx"),
  ]),
] satisfies RouteConfig;

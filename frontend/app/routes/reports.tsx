import type { Route } from "./+types/storage";
import { Reports } from "../components/reports/reports";

export function meta({}: Route.MetaArgs) {
  return [{ title: "StoKeeper | Reports" }];
}

export default Reports;

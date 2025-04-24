import type { Route } from "../private/+types/storage";
import { Storage } from "../../components/storage/storage";

export function meta({}: Route.MetaArgs) {
  return [{ title: "StoKeeper | Storage" }];
}

export default Storage;

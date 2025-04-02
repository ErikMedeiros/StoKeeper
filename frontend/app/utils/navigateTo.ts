import type { NavigateFunction } from "react-router";

export const navigateTo = (navigate: NavigateFunction, path: string) => {
  navigate(path);
};

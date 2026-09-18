import { onRequestGet as __api_ip_loc_js_onRequestGet } from "D:\\Download\\qingqingzhiboke\\functions\\api\\ip-loc.js"

export const routes = [
    {
      routePath: "/api/ip-loc",
      mountPath: "/api",
      method: "GET",
      middlewares: [],
      modules: [__api_ip_loc_js_onRequestGet],
    },
  ]
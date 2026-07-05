import { onRequest as __apply_api___catchall___js_onRequest } from "D:\\github projects\\Oasis Company Public Website\\functions\\apply\\api\\[[catchall]].js"
import { onRequest as __apply_api__middleware_js_onRequest } from "D:\\github projects\\Oasis Company Public Website\\functions\\apply\\api\\_middleware.js"

export const routes = [
    {
      routePath: "/apply/api/:catchall*",
      mountPath: "/apply/api",
      method: "",
      middlewares: [],
      modules: [__apply_api___catchall___js_onRequest],
    },
  {
      routePath: "/apply/api",
      mountPath: "/apply/api",
      method: "",
      middlewares: [__apply_api__middleware_js_onRequest],
      modules: [],
    },
  ]
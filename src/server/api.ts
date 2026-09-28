import { HttpServer } from "./http-server.js";

const api = new HttpServer()

api.get('/health', () => {
    return {
      success: true,
      timestamp: Date.now(),
      uptime: process.uptime(),
      version: process.env.npm_package_version || '1.0.0',
    }
})

export { api }
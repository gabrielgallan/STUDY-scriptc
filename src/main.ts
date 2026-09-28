import { api } from "./server/api.js";

const port = 9090

try {
  api.listen(port)

  console.log(`HTTP server running on http://localhost:${port}`)
} catch (error) {
  console.error(`[ERROR] Error starting server: ${error}`)
}
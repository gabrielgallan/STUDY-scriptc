import { HealthController } from "./health/health.controller.js";
import { HttpService } from "./http/http.service.js";
import { UsersController } from "./users/users.controller.js";

const api = new HttpService()

const healthController = new HealthController()
const usersController = new UsersController()

api.get('/api/health', healthController.get)
api.get('/api/users', usersController.get)

export { api }
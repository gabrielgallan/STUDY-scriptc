import { api } from "./server/api.js";
import { Logger } from "./server/common/logger/logger.js";
import { EnvService } from "./server/env/env.service.js";

function bootstrap() {
  const logger = new Logger('Core')
  const env = new EnvService().get()

  try {
    api.listen(env.PORT)

    logger.info('Service started successfully')
  } catch (error) {
    logger.error(`Error starting service: ${error}`)

    process.exit(1)
  }
}
bootstrap()
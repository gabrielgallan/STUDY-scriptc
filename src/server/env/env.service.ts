import { z } from "zod";
import { existsSync } from 'node:fs'
import { loadEnvFile } from 'node:process'
import { Logger } from "../common/logger/logger.js";

if (existsSync('.env')) {
  loadEnvFile('.env')
}

export class EnvService {
    private logger = new Logger('EnvService')
    private envSchema = z.object({
        NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
        PORT: z.coerce.number().default(9000),
    })

    get() {
        const { success, error, data } = this.envSchema.safeParse(process.env);

        if (success === false) {
            this.logger.error(
                `Invalid environment variable! ${JSON.stringify(error.issues)}`
            )

            process.exit(1)
        }

        return data
    }
}
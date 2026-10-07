export class HealthController {
    get() {
        return {
            success: true,
            timestamp: Date.now(),
            uptime: process.uptime(),
            version: process.env.npm_package_version || '1.0.0',
        }
    }
}
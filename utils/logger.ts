import {config} from "@/config";

class Logger {
    static log(message: string) {
        if (config.environment !== 'production') {
            console.log(`[INFO] ${new Date().toISOString()} - ${message}`);
        }
        // Future: Integrate with other logging services
    }

    static error(message: string, error: any) {
        console.error(`[ERROR] ${new Date().toISOString()} - ${message}`, error);
        // Future: Integrate with error tracking services
    }
}

export default Logger;

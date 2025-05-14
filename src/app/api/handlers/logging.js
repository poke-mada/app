import fs from 'fs';
import winston from "winston";

const logger = winston.createLogger({
    level: "info",
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.File({ filename: "error.log", level: "error" }),
        new winston.transports.File({ filename: "app.log" }),
    ],
});

function save_combat_log(trainer_name, combat_log) {
    const messages = combat_log.map(log => log.message);
    if (!fs.existsSync('combat_logs')) {
        fs.mkdirSync('combat_logs');
    }
    fs.writeFileSync(`combat_logs/${trainer_name}_${Date.now()}.combat_log`, messages.join('\n'), {
        flag: 'w+'
    });
}

export {
    logger,
    save_combat_log
}

export default {
    logger: logger
}
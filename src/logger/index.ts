import pino from 'pino';

export const loggerFactory = (crawlerName: string) =>
  pino({
    name: crawlerName,
    level: 'info',
    prettyPrint: { colorize: true },
  });

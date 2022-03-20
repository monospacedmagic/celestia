import { SlashCreator, FastifyServer } from 'slash-create';
import { getFiles } from 'slash-create/lib/util';
import CatLoggr from 'cat-loggr/ts';
import dotenv from 'dotenv';
import fs from 'fs';
import path, { extname, join } from 'path';

let dotenvPath = path.join(process.cwd(), '.env');
if (path.parse(process.cwd()).name === 'dist') dotenvPath = path.join(process.cwd(), '..', '.env');

dotenv.config({ path: dotenvPath });

const certPath = '/etc/letsencrypt/live/monospacedmagic.dev';

const logger = new CatLoggr().setLevel(process.env.COMMANDS_DEBUG === 'true' ? 'debug' : 'info');
const creator = new SlashCreator({
  applicationID: process.env.DISCORD_APP_ID,
  publicKey: process.env.DISCORD_PUBLIC_KEY,
  token: process.env.DISCORD_BOT_TOKEN,
  serverPort: parseInt(process.env.PORT, 10) || 8020,
  serverHost: '0.0.0.0'
});

creator.on('debug', (message) => logger.log(message));
creator.on('warn', (message) => logger.warn(message));
creator.on('error', (error) => logger.error(error));
creator.on('synced', () => logger.info('Commands synced!'));
creator.on('commandRun', (command, _, ctx) =>
  logger.info(`${ctx.user.username}#${ctx.user.discriminator} (${ctx.user.id}) ran command ${command.commandName}`)
);
creator.on('commandRegister', (command) => logger.info(`Registered command ${command.commandName}`));
creator.on('commandError', (command, error) => logger.error(`Command ${command.commandName}:`, error));

creator
  .withServer(
    new FastifyServer({
      https: {
        key: fs.readFileSync(path.join(certPath, 'privkey.pem')),
        cert: fs.readFileSync(path.join(certPath, 'cert.pem'))
      }
    })
  )
  .registerCommandsIn(path.join(__dirname, 'commands'));

// load skills
const skillPath = join(__dirname, 'skills');
const extensions = ['.js', '.cjs'];
const paths = getFiles(skillPath).filter((file) => extensions.includes(extname(file)));
for (const filePath of paths) {
  try {
    require(filePath);
  } catch (e) {
    console.log('error', new Error(`Failed to load skill ${filePath}: ${e}`));
  }
}

// load status effects
const statusEffectPath = join(__dirname, 'status_effects');
const _extensions = ['.js', '.cjs'];
const _paths = getFiles(statusEffectPath).filter((file) => _extensions.includes(extname(file)));
for (const filePath of _paths) {
  try {
    require(filePath);
  } catch (e) {
    console.log('error', new Error(`Failed to load status effect ${filePath}: ${e}`));
  }
}

creator.startServer();

console.log(`Starting server at "${creator.options.serverHost}:${creator.options.serverPort}/interactions"`);

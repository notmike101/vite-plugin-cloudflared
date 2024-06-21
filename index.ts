import fs from 'fs';
import { tunnel } from 'cloudflared';
import type { Logger, Plugin, ViteDevServer } from 'vite';

type CloudflaredCLIOptions = Record<string, string | number | null>;

const viteCloudflared = (config: CloudflaredCLIOptions = {}): Plugin => {
  const tunnelOptions: CloudflaredCLIOptions = {
    ...config,
  };

  const devServerListeningHandler = async (devServer: ViteDevServer, logger: Logger) => {
    const localURL = await new Promise<string>((resolve) => {
      setTimeout(() => {
        if (devServer.resolvedUrls?.local?.length ?? 0 > 0) {
          resolve(devServer.resolvedUrls!.local[0]);
        }
      }, 100);
    });

    tunnelOptions['--url'] = localURL;

    const connectedTunnel = tunnel(tunnelOptions);
    const tunnelUrl = await connectedTunnel.url;

    devServer.resolvedUrls?.network.push(tunnelUrl);

    logger.info(`Cloudflared tunnel is running at ${tunnelUrl}`, { timestamp: true });
  };

  return {
    name: 'vite-plugin-cloudflared',
    enforce: 'pre',
    apply: 'serve',
    configureServer(server: ViteDevServer) {
      server.config.logger.info('Starting Cloudflared tunnel...', { timestamp: true })

      if (tunnelOptions.config) {
        if (!fs.existsSync(tunnelOptions.config as string)) {
          server.config.logger.warn(`Cloudflared config file not found at ${tunnelOptions.config as string}, creating quick tunnel`, { timestamp: true });
          delete tunnelOptions['--config'];
        } else {
          tunnelOptions.config = tunnelOptions.config as string;
        }
      }

      server.httpServer?.addListener('listening', devServerListeningHandler.bind(this, server, server.config.logger));
    },
  };
};

export default viteCloudflared;
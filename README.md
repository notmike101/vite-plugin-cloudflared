# Vite Plugin Cloudflared

Starts a cloudflare tunnel as part of your vite dev server

## Getting Started

1. Install vite and this plugin with your preferred package manager

`npm install --save-dev vite-plugin-cloudflared`

2. Import and include the plugin in your `vite.config` file

```js
import vitePluginCloudflared from 'vite-plugin-cloudflared';

export default defineConfig({
  // ...
  plugins: [
    // ...
    vitePluginCloudflared(...options),
    // ...
  ],
});
```

3. Configure the plugin options as needed. All options passed to the plugin are passed directly to the cloudflared cli `tunnel` command. You can find a list of cli commands [here](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/configure-tunnels/local-management/tunnel-useful-commands/)

## Bugs

Please create an issue if you experience any issues.

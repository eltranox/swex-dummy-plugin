const { version } = require('./package.json');

module.exports = {
  defaultConfig: {
    enabled: true,
  },
  defaultConfigDetails: {},
  pluginName: 'DummyPlugin',
  pluginDescription: `Dummy plugin to test the plugin auto update. Installed version: ${version}`,
  version,
  autoUpdate: {
    // GitHub redirects this to the latest.yml asset of the latest (non-prerelease) release
    versionURL: 'https://github.com/eltranox/swex-dummy-plugin/releases/latest/download/latest.yml',
  },
  init(proxy, config) {
    if (!config.Config.Plugins[this.pluginName].enabled) return;

    proxy.log({ type: 'info', source: 'plugin', name: this.pluginName, message: `DummyPlugin v${version} loaded.` });

    proxy.on('HubUserLogin', () => {
      proxy.log({ type: 'info', source: 'plugin', name: this.pluginName, message: `Hello from DummyPlugin v${version}.` });
    });
  },
};

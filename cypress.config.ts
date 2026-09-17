import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    // https://blogdoagi.com.br redireciona (301) para este domínio.
    baseUrl: 'https://blog.agibank.com.br',
    video: true,
    screenshotOnRunFailure: true,
    viewportWidth: 1440,
    viewportHeight: 900,
    retries: {
      runMode: 1,
      openMode: 0
    }
  }
});

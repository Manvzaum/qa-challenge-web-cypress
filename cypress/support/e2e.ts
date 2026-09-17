// Global Cypress support file.
import './commands';

// O Blog do Agi é um site de terceiros fora do nosso controle. Erros de
// script não relacionados ao que estamos testando (ex.: widgets de Web
// Stories, tags de analytics/ads) não devem derrubar as asserções dos
// cenários que exercitamos.
Cypress.on('uncaught:exception', () => false);

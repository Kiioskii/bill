import { config } from 'dotenv';

// Ładujemy zmienne środowiskowe
config({
  path: '.env', // Możesz użyć też `.env.test` jeśli chcesz osobne środowisko
});

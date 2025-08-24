/** @type {import("prettier").Config} */
module.exports = {
  // Styl formatowania
  printWidth: 100, // Złam wiersz po 100 znakach
  tabWidth: 2, // 2 spacje na tab
  useTabs: false, // Spacje zamiast tabów
  semi: true, // Średnik na końcu linii
  singleQuote: true, // ' zamiast "
  trailingComma: 'es5', // Końcowe przecinki w obiektach, tablicach itd.
  bracketSpacing: true, // Spacje w obiektach: { foo: bar }
  arrowParens: 'always', // Zawsze nawiasy w arrow functions: (x) => {}
  endOfLine: 'lf', // Styl końca linii (LF)

  // Dodatki do lepszej integracji z Tailwindem
  plugins: ['prettier-plugin-tailwindcss'],

  // Sortowanie klas Tailwind automatycznie
  tailwindConfig: './tailwind.config.js',
};

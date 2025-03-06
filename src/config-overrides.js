const webpack = require("webpack");

module.exports = function override(config, env) {
  // Adiciona um fallback para o módulo 'crypto'
  config.resolve.fallback = {
    ...config.resolve.fallback,
    crypto: require.resolve("crypto-browserify"),
  };

  // Define o algoritmo de hash compatível
  config.output.hashFunction = "sha256";

  return config;
};

/**
 * theme.js — identidade visual Lumina no aplicativo móvel.
 *
 * As cores replicam as variáveis CSS da aplicação web
 * (wwwroot/css/style.css), garantindo que web e mobile sejam
 * percebidos como o mesmo produto pelo usuário.
 */

export const cores = {
  // Fundos
  bg0:      '#050507',
  bg1:      '#0a0a0f',
  bg2:      '#13101f',
  bg3:      '#1c1830',
  bgCard:   '#16122a',

  // Roxos da marca
  roxoProfundo: '#2d1f6e',
  roxoMedio:    '#4a2f9a',
  roxoPrincipal:'#6b3fcf',
  roxoClaro:    '#8b5cf6',
  roxoSuave:    'rgba(107,63,207,0.12)',
  roxoBorda:    'rgba(107,63,207,0.28)',

  // Texto
  texto:       '#ffffff',
  textoSuave:  '#b9b3cf',
  textoFraco:  '#7d7796',

  // Estados
  sucesso: '#22c55e',
  alerta:  '#f59e0b',
  erro:    '#ef4444',
  info:    '#38bdf8',
};

export const espaco = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const raio = {
  sm: 8,
  md: 12,
  lg: 18,
  pill: 999,
};

/**
 * Escalas de acessibilidade.
 * Espelham os três níveis do widget de acessibilidade da web
 * ("A", "A+", "A++"), atendendo à Etapa 3 do PIM IV também no mobile.
 */
export const escalasTexto = {
  normal:  1,
  grande:  1.15,
  maior:   1.3,
};

/** Paleta alternativa de alto contraste (baixa visão / daltonismo). */
export const coresAltoContraste = {
  ...cores,
  bg0:      '#000000',
  bg1:      '#000000',
  bg2:      '#000000',
  bg3:      '#111111',
  bgCard:   '#000000',
  roxoBorda:'#ffff00',
  roxoPrincipal: '#ffff00',
  roxoClaro:'#ffff00',
  texto:      '#ffffff',
  textoSuave: '#ffffff',
  textoFraco: '#dddddd',
};

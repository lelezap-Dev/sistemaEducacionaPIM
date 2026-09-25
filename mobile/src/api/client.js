/**
 * client.js — camada de acesso à API REST do Sistema Lumina.
 *
 * Responsabilidades:
 *   1. Montar as requisições HTTP e injetar o token JWT
 *   2. Normalizar o envelope de resposta da API ({ sucesso, dados })
 *   3. Manter um cache local para leitura offline (sincronização)
 *
 * A API responde sempre no mesmo formato:
 *   sucesso -> { "sucesso": true,  "dados": <qualquer coisa> }
 *   erro    -> { "sucesso": false, "mensagem": "..." }
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL, TIMEOUT_MS } from '../config';

const PREFIXO_CACHE = '@lumina:cache:';

/** Erro de negócio devolvido pela API (mensagem já pronta para o usuário). */
export class ApiError extends Error {
  constructor(mensagem, status) {
    super(mensagem);
    this.name = 'ApiError';
    this.status = status;
  }
}

/** Erro de rede: sem conexão, servidor fora do ar ou tempo esgotado. */
export class RedeError extends Error {
  constructor(mensagem) {
    super(mensagem);
    this.name = 'RedeError';
  }
}

/** fetch com limite de tempo — evita a tela travar esperando para sempre. */
async function fetchComTimeout(url, opcoes) {
  const controlador = new AbortController();
  const timer = setTimeout(() => controlador.abort(), TIMEOUT_MS);
  try {
    return await fetch(url, { ...opcoes, signal: controlador.signal });
  } catch (e) {
    if (e.name === 'AbortError') {
      throw new RedeError('O servidor demorou demais para responder.');
    }
    throw new RedeError('Não foi possível conectar ao servidor. Verifique sua internet.');
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Dispara uma verificação de saúde sem aguardar a resposta. Chamada na
 * abertura do app: se o servidor estiver hibernando, ele acorda enquanto
 * o usuário ainda digita as credenciais. Falhas são ignoradas.
 */
export function acordarServidor() {
  fetch(`${API_URL.replace(/\/api$/, '')}/health`).catch(() => {});
}

/**
 * Executa uma requisição na API.
 * @param {string} caminho  rota a partir de /api (ex: '/materias')
 * @param {object} opcoes   { metodo, corpo, token }
 */
export async function requisitar(caminho, { metodo = 'GET', corpo, token } = {}) {
  const cabecalhos = { 'Content-Type': 'application/json' };
  if (token) cabecalhos.Authorization = `Bearer ${token}`;

  const resposta = await fetchComTimeout(`${API_URL}${caminho}`, {
    method: metodo,
    headers: cabecalhos,
    body: corpo ? JSON.stringify(corpo) : undefined,
  });

  // 204 não tem corpo para desserializar
  if (resposta.status === 204) return null;

  let json;
  try {
    json = await resposta.json();
  } catch {
    throw new ApiError('Resposta inválida do servidor.', resposta.status);
  }

  if (!resposta.ok || json?.sucesso === false) {
    throw new ApiError(json?.mensagem ?? 'Não foi possível concluir a operação.', resposta.status);
  }

  return json?.dados ?? json;
}

// ─────────────────────────────────────────────────────────────────
//  Cache offline
//  Toda leitura bem-sucedida é gravada localmente. Se o aparelho
//  estiver sem rede, a tela exibe o último dado conhecido em vez de
//  ficar vazia — é a sincronização exigida pela Etapa 5 do PIM IV.
// ─────────────────────────────────────────────────────────────────

async function gravarCache(chave, dados) {
  try {
    await AsyncStorage.setItem(
      PREFIXO_CACHE + chave,
      JSON.stringify({ dados, gravadoEm: new Date().toISOString() }),
    );
  } catch {
    // Falha ao gravar cache não deve interromper o fluxo do usuário
  }
}

async function lerCache(chave) {
  try {
    const bruto = await AsyncStorage.getItem(PREFIXO_CACHE + chave);
    return bruto ? JSON.parse(bruto) : null;
  } catch {
    return null;
  }
}

/**
 * Busca dados na API e mantém uma cópia local.
 * Em falha de rede, devolve o que estiver em cache marcando offline: true.
 *
 * @returns {{ dados: any, offline: boolean, gravadoEm: string|null }}
 */
export async function buscarComCache(caminho, token, chaveCache) {
  const chave = chaveCache ?? caminho;
  try {
    const dados = await requisitar(caminho, { token });
    await gravarCache(chave, dados);
    return { dados, offline: false, gravadoEm: null };
  } catch (e) {
    if (e instanceof RedeError) {
      const emCache = await lerCache(chave);
      if (emCache) {
        return { dados: emCache.dados, offline: true, gravadoEm: emCache.gravadoEm };
      }
    }
    throw e;
  }
}

/** Remove todo o cache local — usado no logout. */
export async function limparCache() {
  try {
    const chaves = await AsyncStorage.getAllKeys();
    const nossas = chaves.filter(k => k.startsWith(PREFIXO_CACHE));
    if (nossas.length) await AsyncStorage.multiRemove(nossas);
  } catch {
    // silencioso: limpar cache é best-effort
  }
}

// ─────────────────────────────────────────────────────────────────
//  Endpoints usados pelo aplicativo
// ─────────────────────────────────────────────────────────────────

export const api = {
  login: (cpf, senha) =>
    requisitar('/auth/login', { metodo: 'POST', corpo: { cpf, senha } }),

  logout: (token) =>
    requisitar('/auth/logout', { metodo: 'POST', token }),

  materias: (token) =>
    buscarComCache('/materias', token, 'materias'),

  conteudos: (materiaId, token) =>
    buscarComCache(`/materias/${materiaId}/conteudos`, token, `conteudos:${materiaId}`),

  marcarLeitura: (conteudoId, token) =>
    requisitar(`/materias/conteudos/${conteudoId}/leitura`, { metodo: 'POST', token }),

  turmas: (token) =>
    buscarComCache('/turmas', token, 'turmas'),

  atividades: (token) =>
    buscarComCache('/atividades', token, 'atividades'),

  atividadeDetalhe: (id, token) =>
    buscarComCache(`/atividades/${id}`, token, `atividade:${id}`),

  submeterAtividade: (atividadeId, respostas, token) =>
    requisitar('/atividades/submeter', {
      metodo: 'POST',
      corpo: { atividadeId, respostas },
      token,
    }),

  relatorioAluno: (cpf, token) =>
    buscarComCache(`/relatorios/aluno/${cpf}`, token, `relatorio:${cpf}`),
};

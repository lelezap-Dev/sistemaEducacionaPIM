/**
 * config.js — endereço da API consumida pelo aplicativo.
 *
 * IMPORTANTE (desenvolvimento):
 * O celular e o computador precisam estar na MESMA rede Wi-Fi.
 * "localhost" aqui apontaria para o próprio celular, por isso usamos
 * o IP da máquina na rede local.
 *
 * Para descobrir o IP no Windows:  ipconfig
 * Para a API aceitar conexões da rede, ela precisa subir com:
 *   dotnet run --urls "http://0.0.0.0:5199"
 */

// IP da máquina de desenvolvimento na rede local.
// ATENÇÃO: o roteador entrega esse IP por DHCP e ele MUDA de tempos em
// tempos. Se o aplicativo parar de conectar, rode "ipconfig" e atualize
// o valor abaixo — ou reserve um IP fixo para esta máquina no roteador.
const IP_LOCAL = '192.168.0.4';
const PORTA    = 5199;

/** URL usada em desenvolvimento (API rodando na máquina local). */
export const API_URL_DEV = `http://${IP_LOCAL}:${PORTA}/api`;

/** URL da instância publicada em nuvem. */
export const API_URL_PROD = 'https://lumina-2-rp3n.onrender.com/api';

/** Alterne aqui para testar contra a nuvem em vez da máquina local. */
export const API_URL = API_URL_DEV;

/** Tempo máximo de espera por resposta da API, em milissegundos. */
export const TIMEOUT_MS = 15000;

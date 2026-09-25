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
const IP_LOCAL = '192.168.0.6';
const PORTA    = 5199;

/** URL usada em desenvolvimento (API rodando na máquina local). */
export const API_URL_DEV = `http://${IP_LOCAL}:${PORTA}/api`;

/** URL da instância publicada em nuvem (Render + Azure SQL). */
export const API_URL_PROD = 'https://lumina-sd21.onrender.com/api';

/**
 * Endereço em uso. A nuvem dispensa a API rodando no computador e
 * funciona em qualquer rede, inclusive dados móveis. Troque para
 * API_URL_DEV para testar alterações da API antes de publicá-las.
 */
export const API_URL = API_URL_PROD;

/**
 * Tempo máximo de espera por resposta, em milissegundos. O plano
 * gratuito do Render hiberna após inatividade e leva cerca de 50 s para
 * acordar; com 15 s, o primeiro acesso do dia falhava. Sem rede, a
 * falha continua imediata, pois não há conexão a aguardar.
 */
export const TIMEOUT_MS = 60000;

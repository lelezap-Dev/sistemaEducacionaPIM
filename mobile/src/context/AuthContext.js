/**
 * AuthContext — autenticação e sessão do usuário no aplicativo.
 *
 * O token JWT é gravado em expo-secure-store, que usa o Keychain no
 * iOS e o Keystore no Android. Diferente do AsyncStorage, o conteúdo
 * fica cifrado pelo sistema operacional — requisito de segurança da
 * Etapa 5 do PIM IV.
 */

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { api, limparCache } from '../api/client';

const CHAVE_SESSAO = 'lumina_sessao';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [sessao, setSessao]   = useState(null);   // { token, cpf, nome, perfil, expiracao }
  const [carregando, setCarregando] = useState(true);

  // Ao abrir o app, tenta restaurar a sessão gravada
  useEffect(() => {
    (async () => {
      try {
        const bruto = await SecureStore.getItemAsync(CHAVE_SESSAO);
        if (bruto) {
          const salva = JSON.parse(bruto);
          // Descarta token expirado em vez de deixar o usuário tomar 401
          if (new Date(salva.expiracao) > new Date()) {
            setSessao(salva);
          } else {
            await SecureStore.deleteItemAsync(CHAVE_SESSAO);
          }
        }
      } catch {
        // Sessão corrompida: segue como deslogado
      } finally {
        setCarregando(false);
      }
    })();
  }, []);

  async function entrar(cpf, senha) {
    const dados = await api.login(cpf, senha);
    await SecureStore.setItemAsync(CHAVE_SESSAO, JSON.stringify(dados));
    setSessao(dados);
    return dados;
  }

  async function sair() {
    try {
      if (sessao?.token) await api.logout(sessao.token);
    } catch {
      // Se a API estiver inacessível, ainda assim encerramos localmente
    }
    await SecureStore.deleteItemAsync(CHAVE_SESSAO);
    await limparCache();
    setSessao(null);
  }

  const valor = useMemo(
    () => ({
      sessao,
      carregando,
      autenticado: !!sessao,
      token:  sessao?.token  ?? null,
      perfil: sessao?.perfil ?? null,
      entrar,
      sair,
    }),
    [sessao, carregando],
  );

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth precisa estar dentro de <AuthProvider>.');
  return ctx;
}

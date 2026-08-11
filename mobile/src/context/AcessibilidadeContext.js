/**
 * AcessibilidadeContext — recursos de inclusão do aplicativo.
 *
 * Espelha no mobile o widget de acessibilidade já existente na web
 * (wwwroot/js/acessibilidade.js): alto contraste, escala de texto e
 * glossário de Libras. Atende à Etapa 3 do PIM IV, garantindo que a
 * inclusão não fique restrita a uma única plataforma.
 *
 * As preferências ficam em AsyncStorage e sobrevivem ao fechamento
 * do aplicativo.
 */

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { cores, coresAltoContraste, escalasTexto } from '../theme';

const CHAVE_PREFS = '@lumina:acessibilidade';

const AcessibilidadeContext = createContext(null);

export function AcessibilidadeProvider({ children }) {
  const [altoContraste, setAltoContraste] = useState(false);
  const [escala, setEscala] = useState('normal'); // normal | grande | maior

  useEffect(() => {
    (async () => {
      try {
        const bruto = await AsyncStorage.getItem(CHAVE_PREFS);
        if (bruto) {
          const p = JSON.parse(bruto);
          setAltoContraste(!!p.altoContraste);
          if (p.escala in escalasTexto) setEscala(p.escala);
        }
      } catch {
        // Mantém os padrões se as preferências estiverem corrompidas
      }
    })();
  }, []);

  async function persistir(novo) {
    try {
      await AsyncStorage.setItem(CHAVE_PREFS, JSON.stringify(novo));
    } catch {
      // Preferência não persistida não impede o uso na sessão atual
    }
  }

  function alternarContraste() {
    const novo = !altoContraste;
    setAltoContraste(novo);
    persistir({ altoContraste: novo, escala });
  }

  function definirEscala(nova) {
    setEscala(nova);
    persistir({ altoContraste, escala: nova });
  }

  const valor = useMemo(() => {
    const paleta = altoContraste ? coresAltoContraste : cores;
    const fator  = escalasTexto[escala];
    return {
      altoContraste,
      escala,
      paleta,
      /** Converte um tamanho base de fonte aplicando a escala escolhida. */
      fonte: (tamanhoBase) => Math.round(tamanhoBase * fator),
      alternarContraste,
      definirEscala,
    };
  }, [altoContraste, escala]);

  return (
    <AcessibilidadeContext.Provider value={valor}>
      {children}
    </AcessibilidadeContext.Provider>
  );
}

export function useAcessibilidade() {
  const ctx = useContext(AcessibilidadeContext);
  if (!ctx) throw new Error('useAcessibilidade precisa estar dentro de <AcessibilidadeProvider>.');
  return ctx;
}

/**
 * Glossário de Libras — mesmos termos do widget web, para que o
 * usuário surdo encontre o mesmo apoio nas duas plataformas.
 */
export const TERMOS_LIBRAS = [
  { termo: 'Matéria',    descricao: 'Mão em "M" com movimento circular no peito, indicando disciplina.' },
  { termo: 'Turma',      descricao: 'Mãos abertas voltadas para dentro, aproximando-se, representando grupo.' },
  { termo: 'Atividade',  descricao: 'Mão em "A" com movimento lateral repetido, indicando tarefa.' },
  { termo: 'Aluno',      descricao: 'Dedo indicador aponta para si mesmo, depois movimento para frente.' },
  { termo: 'Professor',  descricao: 'Mão em "P" com movimentos que remetem ao ato de ensinar.' },
  { termo: 'Conteúdo',   descricao: 'Mãos formando livro aberto, dedos em movimento de virar páginas.' },
  { termo: 'Avaliação',  descricao: 'Mão em "A" com movimento vertical descendente, como assinatura.' },
  { termo: 'Aprovado',   descricao: 'Polegar para cima com leve movimento afirmativo.' },
  { termo: 'Cadastro',   descricao: 'Mãos simulando escrita em papel com movimento suave.' },
  { termo: 'Sistema',    descricao: 'Mãos espalmadas girando uma ao redor da outra, indicando processo.' },
  { termo: 'Relatório',  descricao: 'Mão aberta inclinada para frente, simulando apresentação de dados.' },
  { termo: 'Resultado',  descricao: 'Mão em "R" movendo-se da frente para o lado, indicando conclusão.' },
];

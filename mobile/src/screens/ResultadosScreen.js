/**
 * ResultadosScreen — desempenho acadêmico do aluno.
 *
 * Consome o relatório consolidado da API, que por sua vez é apoiado
 * pela procedure sp_RelatorioAluno criada na Etapa 7.
 */

import { useCallback, useState } from 'react';
import { RefreshControl, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useAcessibilidade } from '../context/AcessibilidadeContext';
import { Aviso, Carregando, Cartao, Titulo, Txt, Vazio } from '../components/ui';
import { espaco, raio } from '../theme';

/** Barra horizontal de percentual, com rótulo acessível. */
function Barra({ percentual }) {
  const { paleta } = useAcessibilidade();
  const cor =
    percentual >= 80 ? paleta.sucesso :
    percentual >= 60 ? paleta.alerta  :
                       paleta.erro;

  return (
    <View
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: Math.round(percentual) }}
      style={{
        height: 8,
        backgroundColor: paleta.bg3,
        borderRadius: raio.pill,
        overflow: 'hidden',
        marginTop: espaco.xs,
      }}
    >
      <View style={{ height: '100%', width: `${Math.min(percentual, 100)}%`, backgroundColor: cor }} />
    </View>
  );
}

export default function ResultadosScreen() {
  const { token, sessao } = useAuth();
  const { paleta } = useAcessibilidade();

  const [relatorio, setRelatorio]   = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [atualizando, setAtualizando] = useState(false);
  const [erro, setErro]             = useState(null);
  const [offline, setOffline]       = useState(false);

  const carregar = useCallback(async () => {
    setErro(null);
    try {
      const r = await api.relatorioAluno(sessao.cpf, token);
      setRelatorio(r.dados);
      setOffline(r.offline);
    } catch (e) {
      setErro(e.message);
    } finally {
      setCarregando(false);
      setAtualizando(false);
    }
  }, [token, sessao]);

  useFocusEffect(useCallback(() => { carregar(); }, [carregar]));

  if (carregando) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: paleta.bg0 }} edges={['bottom']}>
        <Carregando />
      </SafeAreaView>
    );
  }

  const resultados = relatorio?.resultados ?? [];
  const media      = relatorio?.mediaAcertos ?? 0;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: paleta.bg0 }} edges={['bottom']}>
      <ScrollView
        contentContainerStyle={{ padding: espaco.md }}
        refreshControl={
          <RefreshControl
            refreshing={atualizando}
            onRefresh={() => { setAtualizando(true); carregar(); }}
            tintColor={paleta.roxoClaro}
          />
        }
      >
        <Titulo tamanho={22}>Meus Resultados</Titulo>
        <Txt tamanho={13} cor={paleta.textoFraco} style={{ marginTop: 2, marginBottom: espaco.lg }}>
          Histórico completo das atividades realizadas
        </Txt>

        {erro && <Aviso texto={erro} />}
        {offline && <Aviso tipo="alerta" texto="Sem conexão. Mostrando os últimos dados salvos." />}

        {/* Resumo */}
        <View style={{ flexDirection: 'row', gap: espaco.sm, marginBottom: espaco.lg }}>
          <Cartao style={{ flex: 1 }}>
            <Txt tamanho={24} peso="800" cor={paleta.roxoClaro}>
              {relatorio?.totalAtividades ?? 0}
            </Txt>
            <Txt tamanho={11} cor={paleta.textoFraco} style={{ textTransform: 'uppercase' }}>
              Atividades
            </Txt>
          </Cartao>
          <Cartao style={{ flex: 1 }}>
            <Txt tamanho={24} peso="800" cor={paleta.roxoClaro}>
              {Math.round(media)}%
            </Txt>
            <Txt tamanho={11} cor={paleta.textoFraco} style={{ textTransform: 'uppercase' }}>
              Média
            </Txt>
          </Cartao>
          <Cartao style={{ flex: 1 }}>
            <Txt tamanho={24} peso="800" cor={paleta.roxoClaro}>
              {relatorio?.totalConteudosLidos ?? 0}
            </Txt>
            <Txt tamanho={11} cor={paleta.textoFraco} style={{ textTransform: 'uppercase' }}>
              Leituras
            </Txt>
          </Cartao>
        </View>

        {/* Histórico */}
        <Titulo tamanho={17} style={{ marginBottom: espaco.sm }}>Histórico</Titulo>

        {resultados.length === 0 && (
          <Vazio texto="Você ainda não realizou nenhuma atividade. Assim que concluir a primeira, seu desempenho aparece aqui." />
        )}

        {resultados.map(r => {
          const pct = r.totalPerguntas
            ? (100 * r.acertos) / r.totalPerguntas
            : 0;
          return (
            <Cartao key={r.id ?? `${r.atividadeTitulo}-${r.realizadoEm}`} style={{ marginBottom: espaco.sm }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Txt tamanho={15} peso="700" style={{ flex: 1, paddingRight: espaco.sm }}>
                  {r.atividadeTitulo}
                </Txt>
                <Txt tamanho={15} peso="800" cor={paleta.roxoClaro}>
                  {Math.round(pct)}%
                </Txt>
              </View>

              <Txt tamanho={12} cor={paleta.textoFraco} style={{ marginTop: 2 }}>
                {r.materiaNome} · {r.acertos}/{r.totalPerguntas} acertos
              </Txt>

              <Barra percentual={pct} />

              <Txt tamanho={11} cor={paleta.textoFraco} style={{ marginTop: espaco.xs }}>
                {new Date(r.realizadoEm).toLocaleDateString('pt-BR', {
                  day: '2-digit', month: '2-digit', year: 'numeric',
                  hour: '2-digit', minute: '2-digit',
                })}
              </Txt>
            </Cartao>
          );
        })}

        <View style={{ height: espaco.xl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

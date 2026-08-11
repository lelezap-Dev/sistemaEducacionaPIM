/**
 * HomeScreen — painel inicial, adaptado ao perfil do usuário.
 *
 * Reproduz no mobile os indicadores de engajamento acadêmico já
 * apresentados na web, consumindo os mesmos endpoints REST.
 */

import { useCallback, useState } from 'react';
import { RefreshControl, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useAcessibilidade } from '../context/AcessibilidadeContext';
import { Aviso, Carregando, Cartao, Titulo, Txt } from '../components/ui';
import { espaco } from '../theme';

/** Cartão de indicador numérico. */
function Indicador({ rotulo, valor }) {
  const { paleta } = useAcessibilidade();
  return (
    <Cartao style={{ flex: 1, minWidth: '45%' }}>
      <Txt tamanho={26} peso="800" cor={paleta.roxoClaro}>{valor}</Txt>
      <Txt
        tamanho={11}
        cor={paleta.textoFraco}
        style={{ textTransform: 'uppercase', letterSpacing: 0.6, marginTop: 2 }}
      >
        {rotulo}
      </Txt>
    </Cartao>
  );
}

export default function HomeScreen() {
  const { sessao, token } = useAuth();
  const { paleta } = useAcessibilidade();

  const [dados, setDados]           = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [atualizando, setAtualizando] = useState(false);
  const [erro, setErro]             = useState(null);
  const [offline, setOffline]       = useState(false);

  const carregar = useCallback(async () => {
    setErro(null);
    try {
      const [turmas, materias, atividades] = await Promise.all([
        api.turmas(token),
        api.materias(token),
        api.atividades(token),
      ]);

      const usouCache = turmas.offline || materias.offline || atividades.offline;
      setOffline(usouCache);

      let relatorio = null;
      if (sessao?.perfil === 'Aluno') {
        try {
          const r = await api.relatorioAluno(sessao.cpf, token);
          relatorio = r.dados;
        } catch {
          // Relatório é complementar: a tela funciona sem ele
        }
      }

      setDados({
        turmas:     turmas.dados     ?? [],
        materias:   materias.dados   ?? [],
        atividades: atividades.dados ?? [],
        relatorio,
      });
    } catch (e) {
      setErro(e.message);
    } finally {
      setCarregando(false);
      setAtualizando(false);
    }
  }, [token, sessao]);

  useFocusEffect(
    useCallback(() => {
      carregar();
    }, [carregar]),
  );

  function aoPuxar() {
    setAtualizando(true);
    carregar();
  }

  if (carregando) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: paleta.bg0 }} edges={['bottom']}>
        <Carregando />
      </SafeAreaView>
    );
  }

  const ehAluno = sessao?.perfil === 'Aluno';
  const primeiroNome = (sessao?.nome ?? '').split(' ')[0];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: paleta.bg0 }} edges={['bottom']}>
      <ScrollView
        contentContainerStyle={{ padding: espaco.md }}
        refreshControl={
          <RefreshControl
            refreshing={atualizando}
            onRefresh={aoPuxar}
            tintColor={paleta.roxoClaro}
          />
        }
      >
        <Titulo tamanho={24}>Olá, {primeiroNome} 👋</Titulo>
        <Txt tamanho={13} cor={paleta.textoFraco} style={{ marginTop: 2, marginBottom: espaco.lg }}>
          {sessao?.perfil} · Acompanhe sua jornada acadêmica
        </Txt>

        {erro && <Aviso texto={erro} />}
        {offline && (
          <Aviso
            tipo="alerta"
            texto="Sem conexão com o servidor. Exibindo os últimos dados salvos no aparelho."
          />
        )}

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: espaco.sm }}>
          <Indicador rotulo={ehAluno ? 'Turmas matriculadas' : 'Turmas'} valor={dados?.turmas.length ?? 0} />
          <Indicador rotulo="Matérias" valor={dados?.materias.length ?? 0} />
          <Indicador rotulo="Atividades" valor={dados?.atividades.length ?? 0} />
          {ehAluno && (
            <Indicador
              rotulo="Média de acertos"
              valor={
                dados?.relatorio
                  ? `${Math.round(dados.relatorio.mediaAcertos ?? 0)}%`
                  : '—'
              }
            />
          )}
        </View>

        {/* Atividades recentes */}
        <Titulo tamanho={17} style={{ marginTop: espaco.lg, marginBottom: espaco.sm }}>
          Últimas atividades
        </Titulo>
        {(dados?.atividades ?? []).slice(0, 5).map(a => (
          <Cartao key={a.id} style={{ marginBottom: espaco.sm }}>
            <Txt tamanho={15} peso="700">{a.titulo}</Txt>
            <Txt tamanho={12} cor={paleta.textoFraco} style={{ marginTop: 2 }}>
              {a.materiaNome} · {a.totalPerguntas} pergunta(s)
            </Txt>
            {ehAluno && (
              <Txt
                tamanho={12}
                peso="700"
                cor={a.jaRealizada ? paleta.sucesso : paleta.alerta}
                style={{ marginTop: espaco.xs }}
              >
                {a.jaRealizada ? '✓ Concluída' : '● Pendente'}
              </Txt>
            )}
          </Cartao>
        ))}
        {(dados?.atividades ?? []).length === 0 && (
          <Txt tamanho={13} cor={paleta.textoFraco}>Nenhuma atividade disponível ainda.</Txt>
        )}

        <View style={{ height: espaco.xl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

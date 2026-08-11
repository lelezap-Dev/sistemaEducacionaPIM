/**
 * MateriasScreen — matérias disponíveis e seus conteúdos didáticos.
 *
 * Ao expandir uma matéria, os conteúdos são carregados sob demanda.
 * Abrir um conteúdo registra a leitura na API, alimentando o indicador
 * "Conteúdos Lidos" do painel e os relatórios da Secretaria.
 */

import { useCallback, useState } from 'react';
import { Pressable, RefreshControl, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useAcessibilidade } from '../context/AcessibilidadeContext';
import { Aviso, Carregando, Cartao, Titulo, Txt, Vazio } from '../components/ui';
import { espaco, raio } from '../theme';

export default function MateriasScreen() {
  const { token, sessao } = useAuth();
  const { paleta } = useAcessibilidade();

  const [materias, setMaterias]     = useState([]);
  const [conteudos, setConteudos]   = useState({}); // { materiaId: [...] }
  const [expandida, setExpandida]   = useState(null);
  const [aberto, setAberto]         = useState(null); // conteúdo em leitura
  const [carregando, setCarregando] = useState(true);
  const [atualizando, setAtualizando] = useState(false);
  const [erro, setErro]             = useState(null);
  const [offline, setOffline]       = useState(false);

  const carregar = useCallback(async () => {
    setErro(null);
    try {
      const r = await api.materias(token);
      setMaterias(r.dados ?? []);
      setOffline(r.offline);
    } catch (e) {
      setErro(e.message);
    } finally {
      setCarregando(false);
      setAtualizando(false);
    }
  }, [token]);

  useFocusEffect(useCallback(() => { carregar(); }, [carregar]));

  async function alternarMateria(materia) {
    if (expandida === materia.id) {
      setExpandida(null);
      return;
    }
    setExpandida(materia.id);

    if (!conteudos[materia.id]) {
      try {
        const r = await api.conteudos(materia.id, token);
        setConteudos(atual => ({ ...atual, [materia.id]: r.dados ?? [] }));
      } catch (e) {
        setErro(e.message);
      }
    }
  }

  async function abrirConteudo(conteudo) {
    setAberto(aberto?.id === conteudo.id ? null : conteudo);

    // Registra a leitura apenas para alunos e só na primeira vez
    if (sessao?.perfil === 'Aluno' && !conteudo.jaLido) {
      try {
        await api.marcarLeitura(conteudo.id, token);
        setConteudos(atual => {
          const lista = (atual[conteudo.materiaId] ?? []).map(c =>
            c.id === conteudo.id ? { ...c, jaLido: true } : c,
          );
          return { ...atual, [conteudo.materiaId]: lista };
        });
      } catch {
        // Falha ao marcar leitura não deve impedir o aluno de estudar
      }
    }
  }

  if (carregando) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: paleta.bg0 }} edges={['bottom']}>
        <Carregando />
      </SafeAreaView>
    );
  }

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
        <Titulo tamanho={22}>Matérias e Conteúdos</Titulo>
        <Txt tamanho={13} cor={paleta.textoFraco} style={{ marginTop: 2, marginBottom: espaco.lg }}>
          Toque em uma matéria para ver os conteúdos
        </Txt>

        {erro && <Aviso texto={erro} />}
        {offline && (
          <Aviso tipo="alerta" texto="Sem conexão. Mostrando os últimos dados salvos." />
        )}

        {materias.length === 0 && <Vazio texto="Nenhuma matéria disponível ainda." />}

        {materias.map(m => {
          const aberta = expandida === m.id;
          const lista  = conteudos[m.id];

          return (
            <View key={m.id} style={{ marginBottom: espaco.sm }}>
              <Pressable
                onPress={() => alternarMateria(m)}
                accessibilityRole="button"
                accessibilityState={{ expanded: aberta }}
                accessibilityLabel={`Matéria ${m.nome}`}
                style={{
                  backgroundColor: paleta.bgCard,
                  borderColor: aberta ? paleta.roxoClaro : paleta.roxoBorda,
                  borderWidth: 1,
                  borderRadius: raio.lg,
                  padding: espaco.md,
                  minHeight: 48,
                }}
              >
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <View style={{ flex: 1, paddingRight: espaco.sm }}>
                    <Txt tamanho={16} peso="700">{m.nome}</Txt>
                    <Txt tamanho={12} cor={paleta.textoFraco} style={{ marginTop: 2 }}>
                      {m.professorNome} · {m.totalConteudos} conteúdo(s)
                    </Txt>
                  </View>
                  <Txt tamanho={16} cor={paleta.roxoClaro}>{aberta ? '▲' : '▼'}</Txt>
                </View>

                {!!m.descricao && (
                  <Txt tamanho={13} cor={paleta.textoSuave} style={{ marginTop: espaco.xs }}>
                    {m.descricao}
                  </Txt>
                )}
              </Pressable>

              {/* Conteúdos da matéria */}
              {aberta && (
                <View style={{ marginTop: espaco.xs, marginLeft: espaco.sm }}>
                  {!lista && <Carregando texto="Carregando conteúdos..." />}
                  {lista && lista.length === 0 && (
                    <Vazio texto="Esta matéria ainda não tem conteúdos." />
                  )}
                  {(lista ?? []).map(c => (
                    <Pressable
                      key={c.id}
                      onPress={() => abrirConteudo({ ...c, materiaId: m.id })}
                      accessibilityRole="button"
                      accessibilityLabel={`Conteúdo ${c.titulo}`}
                      style={{
                        backgroundColor: paleta.bg2,
                        borderColor: paleta.roxoBorda,
                        borderWidth: 1,
                        borderRadius: raio.md,
                        padding: espaco.md,
                        marginTop: espaco.xs,
                        minHeight: 48,
                      }}
                    >
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Txt tamanho={14} peso="600" style={{ flex: 1 }}>{c.titulo}</Txt>
                        {c.jaLido && (
                          <Txt tamanho={12} cor={paleta.sucesso}>✓ lido</Txt>
                        )}
                      </View>

                      {aberto?.id === c.id && (
                        <Txt tamanho={14} cor={paleta.textoSuave} style={{ marginTop: espaco.sm, lineHeight: 21 }}>
                          {c.texto}
                        </Txt>
                      )}
                    </Pressable>
                  ))}
                </View>
              )}
            </View>
          );
        })}

        <View style={{ height: espaco.xl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

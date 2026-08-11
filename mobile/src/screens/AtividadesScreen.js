/**
 * AtividadesScreen — lista as atividades disponíveis para o usuário.
 *
 * Para o aluno, separa o que está pendente do que já foi concluído,
 * atacando diretamente a dor da persona "Lucas" mapeada no PIM III:
 * perder prazos por falta de visibilidade do que está em aberto.
 */

import { useCallback, useState } from 'react';
import { Pressable, RefreshControl, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useAcessibilidade } from '../context/AcessibilidadeContext';
import { Aviso, Carregando, Titulo, Txt, Vazio } from '../components/ui';
import { espaco, raio } from '../theme';

function CartaoAtividade({ atividade, onPress, ehAluno }) {
  const { paleta } = useAcessibilidade();
  const concluida = atividade.jaRealizada;

  return (
    <Pressable
      onPress={() => onPress(atividade)}
      disabled={ehAluno && concluida}
      accessibilityRole="button"
      accessibilityLabel={`Atividade ${atividade.titulo}${concluida ? ', já concluída' : ''}`}
      style={({ pressed }) => ({
        backgroundColor: paleta.bgCard,
        borderColor: concluida ? paleta.sucesso : paleta.roxoBorda,
        borderWidth: 1,
        borderRadius: raio.lg,
        padding: espaco.md,
        marginBottom: espaco.sm,
        opacity: pressed ? 0.85 : 1,
        minHeight: 48,
      })}
    >
      <Txt tamanho={15} peso="700">{atividade.titulo}</Txt>
      <Txt tamanho={12} cor={paleta.textoFraco} style={{ marginTop: 2 }}>
        {atividade.materiaNome} · {atividade.totalPerguntas} pergunta(s)
      </Txt>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: espaco.sm }}>
        <Txt tamanho={12} peso="700" cor={concluida ? paleta.sucesso : paleta.alerta}>
          {concluida ? '✓ Concluída' : '● Pendente'}
        </Txt>
        {ehAluno && !concluida && (
          <Txt tamanho={13} peso="700" cor={paleta.roxoClaro}>Iniciar →</Txt>
        )}
      </View>
    </Pressable>
  );
}

export default function AtividadesScreen({ navigation }) {
  const { token, sessao } = useAuth();
  const { paleta } = useAcessibilidade();

  const [atividades, setAtividades] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [atualizando, setAtualizando] = useState(false);
  const [erro, setErro]             = useState(null);
  const [offline, setOffline]       = useState(false);

  const carregar = useCallback(async () => {
    setErro(null);
    try {
      const r = await api.atividades(token);
      setAtividades(r.dados ?? []);
      setOffline(r.offline);
    } catch (e) {
      setErro(e.message);
    } finally {
      setCarregando(false);
      setAtualizando(false);
    }
  }, [token]);

  useFocusEffect(useCallback(() => { carregar(); }, [carregar]));

  const ehAluno = sessao?.perfil === 'Aluno';

  function abrir(atividade) {
    if (!ehAluno || atividade.jaRealizada) return;
    navigation.navigate('ResponderAtividade', {
      atividadeId: atividade.id,
      titulo: atividade.titulo,
    });
  }

  if (carregando) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: paleta.bg0 }} edges={['bottom']}>
        <Carregando />
      </SafeAreaView>
    );
  }

  const pendentes  = atividades.filter(a => !a.jaRealizada);
  const concluidas = atividades.filter(a =>  a.jaRealizada);

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
        <Titulo tamanho={22}>Atividades</Titulo>
        <Txt tamanho={13} cor={paleta.textoFraco} style={{ marginTop: 2, marginBottom: espaco.lg }}>
          {ehAluno ? 'Realize as atividades disponíveis' : 'Atividades cadastradas'}
        </Txt>

        {erro && <Aviso texto={erro} />}
        {offline && <Aviso tipo="alerta" texto="Sem conexão. Mostrando os últimos dados salvos." />}

        {atividades.length === 0 && <Vazio texto="Nenhuma atividade disponível ainda." />}

        {ehAluno && pendentes.length > 0 && (
          <>
            <Txt
              tamanho={12}
              peso="700"
              cor={paleta.alerta}
              style={{ textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: espaco.sm }}
            >
              Pendentes ({pendentes.length})
            </Txt>
            {pendentes.map(a => (
              <CartaoAtividade key={a.id} atividade={a} onPress={abrir} ehAluno={ehAluno} />
            ))}
          </>
        )}

        {ehAluno && concluidas.length > 0 && (
          <>
            <Txt
              tamanho={12}
              peso="700"
              cor={paleta.sucesso}
              style={{ textTransform: 'uppercase', letterSpacing: 0.8, marginTop: espaco.md, marginBottom: espaco.sm }}
            >
              Concluídas ({concluidas.length})
            </Txt>
            {concluidas.map(a => (
              <CartaoAtividade key={a.id} atividade={a} onPress={abrir} ehAluno={ehAluno} />
            ))}
          </>
        )}

        {/* Professor e Secretaria veem a lista sem separação */}
        {!ehAluno && atividades.map(a => (
          <CartaoAtividade key={a.id} atividade={a} onPress={abrir} ehAluno={false} />
        ))}

        <View style={{ height: espaco.xl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

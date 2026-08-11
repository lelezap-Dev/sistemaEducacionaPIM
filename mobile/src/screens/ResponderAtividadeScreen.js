/**
 * ResponderAtividadeScreen — execução de uma atividade avaliativa.
 *
 * O aluno percorre as perguntas, escolhe uma alternativa em cada uma e
 * envia tudo de uma vez. A correção acontece no servidor: as respostas
 * corretas nunca trafegam para o aplicativo, o que impede que sejam
 * lidas no dispositivo.
 */

import { useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useAcessibilidade } from '../context/AcessibilidadeContext';
import { Aviso, Botao, Carregando, Cartao, Titulo, Txt } from '../components/ui';
import { espaco, raio } from '../theme';

export default function ResponderAtividadeScreen({ route, navigation }) {
  const { atividadeId } = route.params;
  const { token } = useAuth();
  const { paleta } = useAcessibilidade();

  const [atividade, setAtividade]   = useState(null);
  const [respostas, setRespostas]   = useState({}); // { perguntaId: textoAlternativa }
  const [carregando, setCarregando] = useState(true);
  const [enviando, setEnviando]     = useState(false);
  const [erro, setErro]             = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const r = await api.atividadeDetalhe(atividadeId, token);
        setAtividade(r.dados);
      } catch (e) {
        setErro(e.message);
      } finally {
        setCarregando(false);
      }
    })();
  }, [atividadeId, token]);

  function escolher(perguntaId, alternativa) {
    setRespostas(atual => ({ ...atual, [perguntaId]: alternativa }));
  }

  async function enviar() {
    const perguntas = atividade?.perguntas ?? [];
    const semResposta = perguntas.filter(p => !respostas[p.id]);

    if (semResposta.length > 0) {
      Alert.alert(
        'Atividade incompleta',
        `Faltam ${semResposta.length} pergunta(s) sem resposta. Responda todas antes de enviar.`,
      );
      return;
    }

    setEnviando(true);
    setErro(null);
    try {
      const payload = perguntas.map(p => ({
        perguntaId: p.id,
        respostaDada: respostas[p.id],
      }));

      const resultado = await api.submeterAtividade(atividadeId, payload, token);
      const pct = Math.round(
        (100 * (resultado?.acertos ?? 0)) / Math.max(resultado?.totalPerguntas ?? 1, 1),
      );

      Alert.alert(
        'Atividade enviada',
        `Você acertou ${resultado?.acertos ?? 0} de ${resultado?.totalPerguntas ?? 0} (${pct}%).`,
        [{ text: 'OK', onPress: () => navigation.goBack() }],
      );
    } catch (e) {
      setErro(e.message);
    } finally {
      setEnviando(false);
    }
  }

  if (carregando) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: paleta.bg0 }} edges={['bottom']}>
        <Carregando texto="Carregando atividade..." />
      </SafeAreaView>
    );
  }

  if (erro && !atividade) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: paleta.bg0, padding: espaco.md }} edges={['bottom']}>
        <Aviso texto={erro} />
        <Botao titulo="Voltar" variante="secundario" onPress={() => navigation.goBack()} />
      </SafeAreaView>
    );
  }

  const perguntas   = atividade?.perguntas ?? [];
  const respondidas = perguntas.filter(p => respostas[p.id]).length;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: paleta.bg0 }} edges={['bottom']}>
      <ScrollView contentContainerStyle={{ padding: espaco.md }}>
        <Titulo tamanho={20}>{atividade?.titulo}</Titulo>
        <Txt tamanho={13} cor={paleta.textoFraco} style={{ marginTop: 2 }}>
          {atividade?.materiaNome}
        </Txt>

        {/* Progresso */}
        <View style={{ marginTop: espaco.md, marginBottom: espaco.lg }}>
          <Txt tamanho={12} cor={paleta.textoSuave} style={{ marginBottom: espaco.xs }}>
            {respondidas} de {perguntas.length} respondida(s)
          </Txt>
          <View
            accessibilityRole="progressbar"
            accessibilityValue={{ min: 0, max: perguntas.length, now: respondidas }}
            style={{ height: 6, backgroundColor: paleta.bg3, borderRadius: raio.pill, overflow: 'hidden' }}
          >
            <View
              style={{
                height: '100%',
                width: `${perguntas.length ? (respondidas / perguntas.length) * 100 : 0}%`,
                backgroundColor: paleta.roxoClaro,
              }}
            />
          </View>
        </View>

        {erro && <Aviso texto={erro} />}

        {perguntas.map((p, indice) => (
          <Cartao key={p.id} style={{ marginBottom: espaco.md }}>
            <Txt tamanho={12} peso="700" cor={paleta.roxoClaro}>
              Pergunta {indice + 1}
            </Txt>
            <Txt tamanho={15} peso="600" style={{ marginTop: espaco.xs, marginBottom: espaco.md }}>
              {p.textoPergunta}
            </Txt>

            {(p.alternativas ?? []).map((alt, i) => {
              const escolhida = respostas[p.id] === alt;
              return (
                <Pressable
                  key={`${p.id}-${i}`}
                  onPress={() => escolher(p.id, alt)}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: escolhida }}
                  accessibilityLabel={`Alternativa ${String.fromCharCode(65 + i)}: ${alt}`}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: escolhida ? paleta.roxoSuave : paleta.bg3,
                    borderColor: escolhida ? paleta.roxoClaro : paleta.roxoBorda,
                    borderWidth: escolhida ? 2 : 1,
                    borderRadius: raio.md,
                    padding: espaco.md,
                    marginBottom: espaco.sm,
                    minHeight: 48,
                  }}
                >
                  <View
                    style={{
                      width: 26, height: 26, borderRadius: 13,
                      borderWidth: 2,
                      borderColor: escolhida ? paleta.roxoClaro : paleta.textoFraco,
                      backgroundColor: escolhida ? paleta.roxoClaro : 'transparent',
                      alignItems: 'center', justifyContent: 'center',
                      marginRight: espaco.sm,
                    }}
                  >
                    <Txt tamanho={12} peso="800" cor={escolhida ? paleta.texto : paleta.textoFraco}>
                      {String.fromCharCode(65 + i)}
                    </Txt>
                  </View>
                  <Txt tamanho={14} style={{ flex: 1 }}>{alt}</Txt>
                </Pressable>
              );
            })}
          </Cartao>
        ))}

        <Botao
          titulo={`Enviar respostas (${respondidas}/${perguntas.length})`}
          onPress={enviar}
          carregando={enviando}
          desabilitado={perguntas.length === 0}
        />

        <View style={{ height: espaco.xl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

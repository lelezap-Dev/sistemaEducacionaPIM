/**
 * ChatbotScreen — assistente virtual no aplicativo.
 *
 * Consome o mesmo endpoint /api/chatbot usado pela web, de modo que a
 * base de conhecimento é única: uma pergunta cadastrada pela secretaria
 * passa a valer nas duas plataformas ao mesmo tempo.
 */

import { useEffect, useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { requisitar } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useAcessibilidade } from '../context/AcessibilidadeContext';
import { Txt } from '../components/ui';
import { espaco, raio } from '../theme';

/** Balão de mensagem. */
function Balao({ texto, deQuem }) {
  const { paleta } = useAcessibilidade();
  const ehBot = deQuem === 'bot';

  return (
    <View
      accessibilityRole="text"
      accessibilityLabel={`${ehBot ? 'Assistente' : 'Você'}: ${texto}`}
      style={{
        maxWidth: '85%',
        alignSelf: ehBot ? 'flex-start' : 'flex-end',
        backgroundColor: ehBot ? paleta.bg3 : paleta.roxoPrincipal,
        borderRadius: raio.lg,
        borderBottomLeftRadius:  ehBot ? 4 : raio.lg,
        borderBottomRightRadius: ehBot ? raio.lg : 4,
        padding: espaco.md,
        marginBottom: espaco.sm,
      }}
    >
      <Txt tamanho={14} style={{ lineHeight: 20 }}>{texto}</Txt>
    </View>
  );
}

export default function ChatbotScreen() {
  const { token } = useAuth();
  const { paleta, fonte } = useAcessibilidade();

  const [mensagens, setMensagens] = useState([
    { id: 'inicial', deQuem: 'bot', texto: 'Olá! Sou o assistente do Lumina. Como posso ajudar?' },
  ]);
  const [sugestoes, setSugestoes] = useState([]);
  const [entrada, setEntrada]     = useState('');
  const [enviando, setEnviando]   = useState(false);

  const scrollRef = useRef(null);

  useEffect(() => {
    (async () => {
      try {
        const lista = await requisitar('/chatbot/sugestoes', { token });
        setSugestoes(lista ?? []);
      } catch {
        // Sem sugestões o usuário ainda pode digitar livremente
      }
    })();
  }, [token]);

  async function enviar(pergunta) {
    const texto = (pergunta ?? entrada).trim();
    if (!texto || enviando) return;

    setEntrada('');
    setSugestoes([]);
    setMensagens(atual => [
      ...atual,
      { id: `u-${Date.now()}`, deQuem: 'usuario', texto },
    ]);
    setEnviando(true);

    try {
      const r = await requisitar('/chatbot/perguntar', {
        metodo: 'POST',
        corpo: { pergunta: texto },
        token,
      });

      setMensagens(atual => [
        ...atual,
        { id: `b-${Date.now()}`, deQuem: 'bot', texto: r?.resposta ?? 'Não consegui responder agora.' },
      ]);

      if (r && !r.entendeu) setSugestoes(r.sugestoes ?? []);
    } catch (e) {
      setMensagens(atual => [
        ...atual,
        { id: `e-${Date.now()}`, deQuem: 'bot', texto: e.message },
      ]);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: paleta.bg0 }} edges={['bottom']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={90}
      >
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={{ padding: espaco.md }}
          onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
        >
          {mensagens.map(m => (
            <Balao key={m.id} texto={m.texto} deQuem={m.deQuem} />
          ))}

          {enviando && <Balao texto="digitando..." deQuem="bot" />}

          {/* Perguntas sugeridas */}
          {sugestoes.length > 0 && (
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: espaco.xs, marginTop: espaco.sm }}>
              {sugestoes.map((s, i) => (
                <Pressable
                  key={`${s}-${i}`}
                  onPress={() => enviar(s)}
                  accessibilityRole="button"
                  accessibilityLabel={`Perguntar: ${s}`}
                  style={{
                    backgroundColor: paleta.roxoSuave,
                    borderColor: paleta.roxoBorda,
                    borderWidth: 1,
                    borderRadius: raio.pill,
                    paddingVertical: 8,
                    paddingHorizontal: espaco.md,
                    minHeight: 40,
                    justifyContent: 'center',
                  }}
                >
                  <Txt tamanho={12} cor={paleta.roxoClaro}>{s}</Txt>
                </Pressable>
              ))}
            </View>
          )}
        </ScrollView>

        {/* Campo de envio */}
        <View
          style={{
            flexDirection: 'row',
            gap: espaco.sm,
            padding: espaco.md,
            borderTopWidth: 1,
            borderTopColor: paleta.roxoBorda,
            backgroundColor: paleta.bg1,
          }}
        >
          <TextInput
            value={entrada}
            onChangeText={setEntrada}
            placeholder="Digite sua dúvida..."
            placeholderTextColor={paleta.textoFraco}
            maxLength={500}
            onSubmitEditing={() => enviar()}
            returnKeyType="send"
            accessibilityLabel="Campo de pergunta"
            style={{
              flex: 1,
              backgroundColor: paleta.bg3,
              borderColor: paleta.roxoBorda,
              borderWidth: 1,
              borderRadius: raio.pill,
              paddingHorizontal: espaco.md,
              paddingVertical: 12,
              color: paleta.texto,
              fontSize: fonte(14),
              minHeight: 48,
            }}
          />
          <Pressable
            onPress={() => enviar()}
            disabled={enviando || !entrada.trim()}
            accessibilityRole="button"
            accessibilityLabel="Enviar pergunta"
            style={{
              width: 48, height: 48, borderRadius: 24,
              backgroundColor: paleta.roxoPrincipal,
              alignItems: 'center', justifyContent: 'center',
              opacity: enviando || !entrada.trim() ? 0.5 : 1,
            }}
          >
            <Txt tamanho={18}>➤</Txt>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

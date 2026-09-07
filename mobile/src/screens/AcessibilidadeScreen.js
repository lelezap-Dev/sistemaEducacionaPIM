/**
 * AcessibilidadeScreen — recursos de inclusão do aplicativo.
 *
 * Reproduz no mobile as três funções do widget web: alto contraste,
 * escala de texto e glossário de Libras (Etapa 3 do PIM IV).
 */

import { Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  TERMOS_LIBRAS,
  useAcessibilidade,
} from '../context/AcessibilidadeContext';
import { Cartao, Titulo, Txt } from '../components/ui';
import { espaco, raio } from '../theme';

const ESCALAS = [
  { chave: 'normal', rotulo: 'A',   descricao: 'Texto padrão' },
  { chave: 'grande', rotulo: 'A+',  descricao: 'Texto ampliado' },
  { chave: 'maior',  rotulo: 'A++', descricao: 'Texto bem ampliado' },
];

export default function AcessibilidadeScreen() {
  const { paleta, altoContraste, alternarContraste, escala, definirEscala, fonte } =
    useAcessibilidade();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: paleta.bg0 }} edges={['bottom']}>
      <ScrollView contentContainerStyle={{ padding: espaco.md }}>
        <Titulo tamanho={22} style={{ marginBottom: espaco.lg }}>
          ♿  Acessibilidade
        </Titulo>

        {/* Contraste */}
        <Txt
          tamanho={12}
          peso="700"
          cor={paleta.textoFraco}
          style={{ textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: espaco.sm }}
        >
          Contraste
        </Txt>
        <Pressable
          onPress={alternarContraste}
          accessibilityRole="switch"
          accessibilityState={{ checked: altoContraste }}
          accessibilityLabel="Alto contraste"
          style={{
            backgroundColor: altoContraste ? paleta.roxoPrincipal : paleta.bg3,
            borderColor: paleta.roxoBorda,
            borderWidth: 1,
            borderRadius: raio.md,
            padding: espaco.md,
            marginBottom: espaco.lg,
            minHeight: 48,
            justifyContent: 'center',
          }}
        >
          <Txt
            tamanho={15}
            peso="600"
            cor={altoContraste ? paleta.textoSobreDestaque : paleta.texto}
          >
            {altoContraste ? '✓  Alto contraste ativado' : 'Ativar alto contraste'}
          </Txt>
          <Txt
            tamanho={12}
            cor={altoContraste ? paleta.textoSobreDestaqueFraco : paleta.textoFraco}
            style={{ marginTop: 2 }}
          >
            Reduz barreiras visuais para baixa visão e daltonismo
          </Txt>
        </Pressable>

        {/* Tamanho do texto */}
        <Txt
          tamanho={12}
          peso="700"
          cor={paleta.textoFraco}
          style={{ textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: espaco.sm }}
        >
          Tamanho do texto
        </Txt>
        <View style={{ flexDirection: 'row', gap: espaco.sm, marginBottom: espaco.lg }}>
          {ESCALAS.map(op => {
            const ativa = escala === op.chave;
            return (
              <Pressable
                key={op.chave}
                onPress={() => definirEscala(op.chave)}
                accessibilityRole="radio"
                accessibilityState={{ selected: ativa }}
                accessibilityLabel={op.descricao}
                style={{
                  flex: 1,
                  backgroundColor: ativa ? paleta.roxoPrincipal : paleta.bg3,
                  borderColor: paleta.roxoBorda,
                  borderWidth: 1,
                  borderRadius: raio.md,
                  paddingVertical: espaco.md,
                  alignItems: 'center',
                  minHeight: 48,
                  justifyContent: 'center',
                }}
              >
                <Txt
                  tamanho={16}
                  peso="800"
                  cor={ativa ? paleta.textoSobreDestaque : paleta.texto}
                >
                  {op.rotulo}
                </Txt>
              </Pressable>
            );
          })}
        </View>

        {/* Glossário de Libras */}
        <Txt
          tamanho={12}
          peso="700"
          cor={paleta.textoFraco}
          style={{ textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: espaco.sm }}
        >
          Glossário Libras
        </Txt>
        <Txt tamanho={13} cor={paleta.textoSuave} style={{ marginBottom: espaco.md }}>
          Descrição dos sinais dos principais termos usados no sistema.
        </Txt>

        {TERMOS_LIBRAS.map(t => (
          <Cartao key={t.termo} style={{ marginBottom: espaco.sm }}>
            <Txt tamanho={15} peso="700" cor={paleta.roxoClaro}>{t.termo}</Txt>
            <Txt tamanho={13} cor={paleta.textoSuave} style={{ marginTop: 2 }}>
              {t.descricao}
            </Txt>
          </Cartao>
        ))}

        <View style={{ height: espaco.xl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

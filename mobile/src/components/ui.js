/**
 * ui.js — componentes visuais reutilizáveis do aplicativo.
 *
 * Todos consomem o contexto de acessibilidade, de modo que alto
 * contraste e escala de texto se aplicam automaticamente a qualquer
 * tela construída com eles.
 */

import {
  ActivityIndicator,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useAcessibilidade } from '../context/AcessibilidadeContext';
import { espaco, raio } from '../theme';

/** Texto padrão do app, já com escala de acessibilidade aplicada. */
export function Txt({ children, tamanho = 15, cor, peso = '400', style, ...resto }) {
  const { paleta, fonte } = useAcessibilidade();
  return (
    <Text
      style={[
        { color: cor ?? paleta.texto, fontSize: fonte(tamanho), fontWeight: peso },
        style,
      ]}
      {...resto}
    >
      {children}
    </Text>
  );
}

/** Título de seção. */
export function Titulo({ children, tamanho = 24, style }) {
  const { paleta } = useAcessibilidade();
  return (
    <Txt tamanho={tamanho} peso="800" cor={paleta.texto} style={style}>
      {children}
    </Txt>
  );
}

/** Cartão — bloco de conteúdo com borda da marca. */
export function Cartao({ children, style }) {
  const { paleta } = useAcessibilidade();
  return (
    <View
      style={[
        {
          backgroundColor: paleta.bgCard,
          borderColor: paleta.roxoBorda,
          borderWidth: 1,
          borderRadius: raio.lg,
          padding: espaco.md,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

/** Botão principal de ação. */
export function Botao({ titulo, onPress, carregando, desabilitado, variante = 'primario', style }) {
  const { paleta, fonte } = useAcessibilidade();
  const inativo = desabilitado || carregando;
  const ehPrimario = variante === 'primario';

  return (
    <Pressable
      onPress={onPress}
      disabled={inativo}
      accessibilityRole="button"
      accessibilityLabel={titulo}
      accessibilityState={{ disabled: !!inativo, busy: !!carregando }}
      style={({ pressed }) => [
        {
          backgroundColor: ehPrimario ? paleta.roxoPrincipal : 'transparent',
          borderColor: paleta.roxoBorda,
          borderWidth: ehPrimario ? 0 : 1,
          borderRadius: raio.pill,
          paddingVertical: 14,
          paddingHorizontal: espaco.lg,
          alignItems: 'center',
          justifyContent: 'center',
          opacity: inativo ? 0.5 : pressed ? 0.8 : 1,
          minHeight: 48, // alvo de toque acessível
        },
        style,
      ]}
    >
      {carregando ? (
        <ActivityIndicator color={paleta.texto} />
      ) : (
        <Text style={{ color: paleta.texto, fontSize: fonte(15), fontWeight: '700' }}>
          {titulo}
        </Text>
      )}
    </Pressable>
  );
}

/** Campo de entrada com rótulo. */
export function Campo({ rotulo, dica, valor, onChangeText, ...resto }) {
  const { paleta, fonte } = useAcessibilidade();
  return (
    <View style={{ marginBottom: espaco.md }}>
      <Text
        style={{
          color: paleta.textoSuave,
          fontSize: fonte(12),
          fontWeight: '700',
          textTransform: 'uppercase',
          letterSpacing: 0.8,
          marginBottom: espaco.xs,
        }}
      >
        {rotulo}
      </Text>
      <TextInput
        value={valor}
        onChangeText={onChangeText}
        placeholder={dica}
        placeholderTextColor={paleta.textoFraco}
        accessibilityLabel={rotulo}
        style={{
          backgroundColor: paleta.bg3,
          borderColor: paleta.roxoBorda,
          borderWidth: 1,
          borderRadius: raio.md,
          paddingHorizontal: espaco.md,
          paddingVertical: 14,
          color: paleta.texto,
          fontSize: fonte(15),
          minHeight: 48,
        }}
        {...resto}
      />
    </View>
  );
}

/** Aviso de erro ou de conteúdo desatualizado. */
export function Aviso({ texto, tipo = 'erro' }) {
  const { paleta, fonte } = useAcessibilidade();
  const cor = tipo === 'erro' ? paleta.erro : tipo === 'alerta' ? paleta.alerta : paleta.info;
  return (
    <View
      accessibilityRole="alert"
      style={{
        backgroundColor: `${cor}22`,
        borderColor: cor,
        borderWidth: 1,
        borderRadius: raio.md,
        padding: espaco.sm + 2,
        marginBottom: espaco.md,
      }}
    >
      <Text style={{ color: cor, fontSize: fonte(13) }}>{texto}</Text>
    </View>
  );
}

/** Indicador de carregamento centralizado. */
export function Carregando({ texto = 'Carregando...' }) {
  const { paleta } = useAcessibilidade();
  return (
    <View style={{ padding: espaco.xl, alignItems: 'center' }}>
      <ActivityIndicator size="large" color={paleta.roxoClaro} />
      <Txt tamanho={13} cor={paleta.textoFraco} style={{ marginTop: espaco.sm }}>
        {texto}
      </Txt>
    </View>
  );
}

/** Estado vazio — evita telas em branco sem explicação. */
export function Vazio({ texto }) {
  const { paleta } = useAcessibilidade();
  return (
    <View style={{ padding: espaco.xl, alignItems: 'center' }}>
      <Txt tamanho={14} cor={paleta.textoFraco} style={{ textAlign: 'center' }}>
        {texto}
      </Txt>
    </View>
  );
}

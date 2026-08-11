/**
 * LoginScreen — autenticação do usuário.
 *
 * Usa as mesmas credenciais da aplicação web (CPF + senha), pois web
 * e mobile compartilham a mesma API e a mesma base de usuários.
 */

import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { useAcessibilidade } from '../context/AcessibilidadeContext';
import { Aviso, Botao, Campo, Titulo, Txt } from '../components/ui';
import LogoLumina from '../components/LogoLumina';
import { espaco, raio } from '../theme';

export default function LoginScreen({ navigation }) {
  const { entrar } = useAuth();
  const { paleta } = useAcessibilidade();

  const [cpf, setCpf]           = useState('');
  const [senha, setSenha]       = useState('');
  const [verSenha, setVerSenha] = useState(false);
  const [erro, setErro]         = useState(null);
  const [enviando, setEnviando] = useState(false);

  async function aoEntrar() {
    setErro(null);

    const cpfLimpo = cpf.replace(/\D/g, '');
    if (cpfLimpo.length !== 11) {
      setErro('Informe um CPF válido, com 11 dígitos.');
      return;
    }
    if (!senha) {
      setErro('Informe sua senha.');
      return;
    }

    setEnviando(true);
    try {
      await entrar(cpfLimpo, senha);
      // A navegação troca sozinha: App.js observa o estado de autenticação
    } catch (e) {
      setErro(e.message);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: paleta.bg0 }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: espaco.lg }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Marca — mesmo traçado da aplicação web */}
          <View style={{ alignItems: 'center', marginBottom: espaco.xl }}>
            <LogoLumina tamanho={150} />
            <Titulo tamanho={32} style={{ letterSpacing: 6, marginTop: espaco.sm }}>
              LUMINA
            </Titulo>
            <Txt tamanho={13} cor={paleta.textoFraco} style={{ marginTop: espaco.xs }}>
              Sistema Educacional
            </Txt>
          </View>

          {/* Formulário */}
          <View
            style={{
              backgroundColor: paleta.bgCard,
              borderColor: paleta.roxoBorda,
              borderWidth: 1,
              borderRadius: raio.lg,
              padding: espaco.lg,
            }}
          >
            <Titulo tamanho={20} style={{ marginBottom: espaco.lg, textAlign: 'center' }}>
              Entrar
            </Titulo>

            {erro && <Aviso texto={erro} />}

            <Campo
              rotulo="CPF"
              dica="Somente números, ex: 12345678900"
              valor={cpf}
              onChangeText={setCpf}
              keyboardType="number-pad"
              maxLength={14}
              autoCapitalize="none"
              autoComplete="username"
              textContentType="username"
            />

            <Campo
              rotulo="Senha"
              dica="Sua senha de acesso"
              valor={senha}
              onChangeText={setSenha}
              secureTextEntry={!verSenha}
              autoCapitalize="none"
              autoComplete="password"
              textContentType="password"
              onSubmitEditing={aoEntrar}
              returnKeyType="go"
            />

            <Pressable
              onPress={() => setVerSenha(v => !v)}
              accessibilityRole="button"
              accessibilityLabel={verSenha ? 'Ocultar senha' : 'Mostrar senha'}
              style={{ alignSelf: 'flex-end', marginBottom: espaco.md, padding: espaco.xs }}
            >
              <Txt tamanho={13} cor={paleta.roxoClaro}>
                {verSenha ? 'Ocultar senha' : 'Mostrar senha'}
              </Txt>
            </Pressable>

            <Botao titulo="Entrar" onPress={aoEntrar} carregando={enviando} />
          </View>

          {/* Acessibilidade sempre acessível, inclusive antes do login */}
          <Pressable
            onPress={() => navigation.navigate('Acessibilidade')}
            accessibilityRole="button"
            accessibilityLabel="Abrir opções de acessibilidade"
            style={{ marginTop: espaco.lg, alignSelf: 'center', padding: espaco.sm }}
          >
            <Txt tamanho={14} cor={paleta.roxoClaro}>
              ♿  Acessibilidade
            </Txt>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

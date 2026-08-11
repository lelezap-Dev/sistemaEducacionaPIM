/**
 * App.js — ponto de entrada do aplicativo Lumina.
 *
 * Estrutura de navegação:
 *
 *   não autenticado ──> Login
 *
 *   autenticado ──> Abas: Início · Matérias · Atividades · Resultados
 *                   └─ telas empilhadas: Responder Atividade, Acessibilidade
 *
 * A aba "Resultados" só aparece para o perfil Aluno; professores e a
 * secretaria acompanham desempenho pelos relatórios da aplicação web.
 */

import { ActivityIndicator, Pressable, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { AuthProvider, useAuth } from './src/context/AuthContext';
import {
  AcessibilidadeProvider,
  useAcessibilidade,
} from './src/context/AcessibilidadeContext';

import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import MateriasScreen from './src/screens/MateriasScreen';
import AtividadesScreen from './src/screens/AtividadesScreen';
import ResponderAtividadeScreen from './src/screens/ResponderAtividadeScreen';
import ResultadosScreen from './src/screens/ResultadosScreen';
import ChatbotScreen from './src/screens/ChatbotScreen';
import AcessibilidadeScreen from './src/screens/AcessibilidadeScreen';
import { Txt } from './src/components/ui';

const Pilha = createNativeStackNavigator();
const Abas  = createBottomTabNavigator();

/** Ícone das abas — emoji mantém o app leve, sem dependência de fontes. */
function IconeAba({ simbolo, focada }) {
  const { paleta } = useAcessibilidade();
  return (
    <Txt tamanho={20} style={{ opacity: focada ? 1 : 0.5 }} cor={paleta.texto}>
      {simbolo}
    </Txt>
  );
}

/** Atalhos fixos do cabeçalho: assistente virtual e acessibilidade. */
function AcoesCabecalho({ navigation }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <Pressable
        onPress={() => navigation.navigate('Chatbot')}
        accessibilityRole="button"
        accessibilityLabel="Abrir assistente virtual"
        hitSlop={10}
        style={{ paddingHorizontal: 6 }}
      >
        <Txt tamanho={20}>💬</Txt>
      </Pressable>
      <Pressable
        onPress={() => navigation.navigate('Acessibilidade')}
        accessibilityRole="button"
        accessibilityLabel="Abrir opções de acessibilidade"
        hitSlop={10}
        style={{ paddingHorizontal: 6 }}
      >
        <Txt tamanho={20}>♿</Txt>
      </Pressable>
    </View>
  );
}

function BotaoSair() {
  const { sair } = useAuth();
  const { paleta } = useAcessibilidade();
  return (
    <Pressable
      onPress={sair}
      accessibilityRole="button"
      accessibilityLabel="Sair da conta"
      hitSlop={12}
      style={{ paddingHorizontal: 8 }}
    >
      <Txt tamanho={14} peso="700" cor={paleta.roxoClaro}>Sair</Txt>
    </Pressable>
  );
}

function AbasPrincipais() {
  const { paleta } = useAcessibilidade();
  const { sessao } = useAuth();
  const ehAluno = sessao?.perfil === 'Aluno';

  return (
    <Abas.Navigator
      screenOptions={({ navigation }) => ({
        headerStyle: { backgroundColor: paleta.bg1 },
        headerTintColor: paleta.texto,
        headerTitleStyle: { fontWeight: '800' },
        headerLeft:  () => <BotaoSair />,
        headerRight: () => <AcoesCabecalho navigation={navigation} />,
        tabBarStyle: {
          backgroundColor: paleta.bg1,
          borderTopColor: paleta.roxoBorda,
          height: 62,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarActiveTintColor:   paleta.roxoClaro,
        tabBarInactiveTintColor: paleta.textoFraco,
        sceneContainerStyle: { backgroundColor: paleta.bg0 },
      })}
    >
      <Abas.Screen
        name="Inicio"
        component={HomeScreen}
        options={{
          title: 'Início',
          tabBarLabel: 'Início',
          tabBarIcon: ({ focused }) => <IconeAba simbolo="🏠" focada={focused} />,
        }}
      />
      <Abas.Screen
        name="Materias"
        component={MateriasScreen}
        options={{
          title: 'Matérias',
          tabBarLabel: 'Matérias',
          tabBarIcon: ({ focused }) => <IconeAba simbolo="📚" focada={focused} />,
        }}
      />
      <Abas.Screen
        name="Atividades"
        component={AtividadesScreen}
        options={{
          title: 'Atividades',
          tabBarLabel: 'Atividades',
          tabBarIcon: ({ focused }) => <IconeAba simbolo="📝" focada={focused} />,
        }}
      />
      {ehAluno && (
        <Abas.Screen
          name="Resultados"
          component={ResultadosScreen}
          options={{
            title: 'Meus Resultados',
            tabBarLabel: 'Resultados',
            tabBarIcon: ({ focused }) => <IconeAba simbolo="📊" focada={focused} />,
          }}
        />
      )}
    </Abas.Navigator>
  );
}

function Rotas() {
  const { autenticado, carregando } = useAuth();
  const { paleta } = useAcessibilidade();

  const tema = {
    ...DefaultTheme,
    dark: true,
    colors: {
      ...DefaultTheme.colors,
      background: paleta.bg0,
      card:       paleta.bg1,
      text:       paleta.texto,
      border:     paleta.roxoBorda,
      primary:    paleta.roxoPrincipal,
    },
  };

  // Evita piscar a tela de login enquanto a sessão gravada é restaurada
  if (carregando) {
    return (
      <View style={{ flex: 1, backgroundColor: paleta.bg0, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color={paleta.roxoClaro} />
      </View>
    );
  }

  return (
    <NavigationContainer theme={tema}>
      <Pilha.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: paleta.bg1 },
          headerTintColor: paleta.texto,
          headerTitleStyle: { fontWeight: '800' },
          contentStyle: { backgroundColor: paleta.bg0 },
        }}
      >
        {!autenticado ? (
          <Pilha.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        ) : (
          <>
            <Pilha.Screen
              name="Principal"
              component={AbasPrincipais}
              options={{ headerShown: false }}
            />
            <Pilha.Screen
              name="ResponderAtividade"
              component={ResponderAtividadeScreen}
              options={({ route }) => ({ title: route.params?.titulo ?? 'Atividade' })}
            />
          </>
        )}

        {/* Acessíveis estando ou não autenticado: as dúvidas mais
            frequentes surgem justamente antes do login */}
        <Pilha.Screen
          name="Chatbot"
          component={ChatbotScreen}
          options={{ title: 'Assistente Lumina' }}
        />
        <Pilha.Screen
          name="Acessibilidade"
          component={AcessibilidadeScreen}
          options={{ title: 'Acessibilidade' }}
        />
      </Pilha.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AcessibilidadeProvider>
        <AuthProvider>
          <StatusBar style="light" />
          <Rotas />
        </AuthProvider>
      </AcessibilidadeProvider>
    </SafeAreaProvider>
  );
}

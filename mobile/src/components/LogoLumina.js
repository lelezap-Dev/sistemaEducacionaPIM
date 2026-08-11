/**
 * LogoLumina — marca do sistema desenhada em SVG.
 *
 * Reproduz exatamente o mesmo traçado usado na aplicação web
 * (wwwroot/index.html): dois losangos maiores sobrepostos com
 * deslocamento horizontal, dois losangos internos menores e um
 * polígono translúcido na interseção.
 *
 * Manter o mesmo desenho nas duas plataformas garante consistência
 * de identidade visual entre web e mobile.
 */

import Svg, { G, Polygon } from 'react-native-svg';
import { useAcessibilidade } from '../context/AcessibilidadeContext';

export default function LogoLumina({ tamanho = 120, cor }) {
  const { paleta } = useAcessibilidade();
  const traco = cor ?? paleta.texto;

  // viewBox 300x280 é o mesmo da versão web, preservando as proporções
  const largura = tamanho;
  const altura  = Math.round((tamanho * 280) / 300);

  return (
    <Svg
      width={largura}
      height={altura}
      viewBox="0 0 300 280"
      fill="none"
      accessibilityRole="image"
      accessibilityLabel="Logotipo do sistema Lumina"
    >
      <G opacity={0.95}>
        {/* Losangos externos */}
        <Polygon
          points="60,140 130,60 200,140 130,220"
          stroke={traco}
          strokeWidth={8}
          fill="none"
          opacity={0.9}
        />
        <Polygon
          points="100,140 170,60 240,140 170,220"
          stroke={traco}
          strokeWidth={8}
          fill="none"
          opacity={0.9}
        />

        {/* Losangos internos */}
        <Polygon
          points="75,140 130,85 185,140 130,195"
          stroke={traco}
          strokeWidth={5}
          fill="none"
          opacity={0.6}
        />
        <Polygon
          points="115,140 170,85 225,140 170,195"
          stroke={traco}
          strokeWidth={5}
          fill="none"
          opacity={0.6}
        />

        {/* Preenchimento suave da interseção */}
        <Polygon
          points="130,110 170,110 185,140 170,170 130,170 115,140"
          fill={traco}
          opacity={0.15}
        />
      </G>
    </Svg>
  );
}

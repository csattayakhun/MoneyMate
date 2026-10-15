import Svg, { Ellipse, Circle, Path } from 'react-native-svg';

interface Props {
  size?: number;
}

export default function Mascot({ size = 72 }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <Path d="M27 32 Q22 14 40 25 Z" fill="#FF9DB6" />
      <Path d="M73 32 Q78 14 60 25 Z" fill="#FF9DB6" />
      <Ellipse cx="50" cy="55" rx="35" ry="31" fill="#FFC2D2" />
      <Circle cx="29" cy="60" r="7.5" fill="#FF8FAC" opacity={0.55} />
      <Circle cx="71" cy="60" r="7.5" fill="#FF8FAC" opacity={0.55} />
      <Ellipse cx="50" cy="62" rx="16" ry="12" fill="#FFB0C4" />
      <Ellipse cx="44" cy="62" rx="2.6" ry="3.8" fill="#E25C7D" />
      <Ellipse cx="56" cy="62" rx="2.6" ry="3.8" fill="#E25C7D" />
      <Circle cx="37" cy="45" r="4.3" fill="#4A4036" />
      <Circle cx="63" cy="45" r="4.3" fill="#4A4036" />
      <Circle cx="38.6" cy="43.4" r="1.4" fill="#FFFFFF" />
      <Circle cx="64.6" cy="43.4" r="1.4" fill="#FFFFFF" />
      <Path d="M40 73 Q50 80 60 73" stroke="#E25C7D" strokeWidth={2.4} strokeLinecap="round" fill="none" />
    </Svg>
  );
}

import { View, StyleSheet } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';

import AppText from '@/components/AppText';
import { COLORS } from '@/styles/theme';

const Text = AppText;

export interface DonutSlice {
  value: number;
  color: string;
}

interface Props {
  data: DonutSlice[];
  size?: number;
  strokeWidth?: number;
  centerLabel?: string;
  centerSub?: string;
}

export default function DonutChart({
  data,
  size = 170,
  strokeWidth = 26,
  centerLabel,
  centerSub,
}: Props) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const total = data.reduce((sum, d) => sum + d.value, 0);
  const center = size / 2;

  let offset = 0;

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size}>
        <G rotation={-90} origin={`${center}, ${center}`}>
          <Circle
            cx={center}
            cy={center}
            r={radius}
            stroke={COLORS.surfaceAlt}
            strokeWidth={strokeWidth}
            fill="none"
          />
          {total > 0 &&
            data.map((slice, index) => {
              const length = (slice.value / total) * circumference;
              const dashoffset = -offset;
              offset += length;
              return (
                <Circle
                  key={index}
                  cx={center}
                  cy={center}
                  r={radius}
                  stroke={slice.color}
                  strokeWidth={strokeWidth}
                  fill="none"
                  strokeDasharray={`${length} ${circumference - length}`}
                  strokeDashoffset={dashoffset}
                  strokeLinecap="butt"
                />
              );
            })}
        </G>
      </Svg>
      {centerLabel ? (
        <View style={styles.center}>
          <Text style={styles.label}>{centerLabel}</Text>
          {centerSub ? <Text style={styles.sub}>{centerSub}</Text> : null}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  center: { position: 'absolute', alignItems: 'center' },
  label: { fontSize: 20, fontWeight: '700', color: COLORS.text },
  sub: { fontSize: 12, color: COLORS.textMuted, marginTop: 2 },
});

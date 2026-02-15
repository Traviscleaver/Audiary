// app/shared/components/review/RatingBar.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Animated, PanResponder, Pressable, Text, View } from "react-native";
import { COLORS } from "../../imports";
import { styles } from "./styles/styles";

function clamp(n, a, b) {
  return Math.max(a, Math.min(b, n));
}
function roundToTenth(n) {
  return Math.round(n * 10) / 10;
}
function normalize(v, min, max) {
  const n = Number(v);
  if (!Number.isFinite(n)) return 5.0;
  return clamp(roundToTenth(n), min, max);
}
function getCategoryColor(v) {
  if (v >= 7.5) return COLORS.rateGood;
  if (v >= 5) return COLORS.rateMedium;
  return COLORS.rateBad;
}

export default function RatingBar({
  value = 5.0,
  onChange,
  disabled = false,
  min = 0.1,
  max = 10,
  step = 0.1,
}) {
  // --- geometry ---
  const trackH = 18;
  const thumbSize = 30; // smaller thumb
  const ring = 3; // must match styles.ratingThumbCircle borderWidth
  const inset = thumbSize / 2;

  // --- refs/state ---
  const outerRef = useRef(null);
  const draggingRef = useRef(false);

  const [outerW, setOuterW] = useState(0);
  const [trackW, setTrackW] = useState(1);
  const [trackAbsX, setTrackAbsX] = useState(0); // absolute X for the START of the SHORT bar

  // local display value so UI moves instantly even if parent is slow
  const [displayValue, setDisplayValue] = useState(() => normalize(value, min, max));

  // animated value for smooth color interpolation
  const animV = useRef(new Animated.Value(displayValue)).current;

  // sync from parent when not dragging
  useEffect(() => {
    if (draggingRef.current) return;
    const next = normalize(value, min, max);
    setDisplayValue(next);
    Animated.timing(animV, { toValue: next, duration: 60, useNativeDriver: false }).start();
  }, [value, min, max, animV]);

  const colorAnim = useMemo(() => {
    return animV.interpolate({
      inputRange: [min, 5, 7.5, max],
      outputRange: [COLORS.rateBad, COLORS.rateMedium, COLORS.rateMedium, COLORS.rateGood],
      extrapolate: "clamp",
    });
  }, [animV, min, max]);

  const trackBgAnim = useMemo(() => {
    return animV.interpolate({
      inputRange: [min, 5, 7.5, max],
      outputRange: [
        "rgba(255,0,0,0.22)",
        "rgba(255,200,0,0.22)",
        "rgba(255,200,0,0.22)",
        "rgba(0,255,120,0.22)",
      ],
      extrapolate: "clamp",
    });
  }, [animV, min, max]);

  const onOuterLayout = (e) => {
    const w = e?.nativeEvent?.layout?.width ?? 0;
    setOuterW(w);

    // shorter bar by thumbSize so thumb center reaches exact ends
    const tw = Math.max(1, w - thumbSize);
    setTrackW(tw);
  };

  const measureAbsX = () =>
    new Promise((resolve) => {
      if (!outerRef.current) return resolve(false);
      outerRef.current.measureInWindow((x) => {
        // start of the SHORT bar is outerX + inset
        setTrackAbsX(x + inset);
        resolve(true);
      });
    });

  const applyValue = (next) => {
    const n = normalize(next, min, max);

    // update local display immediately
    setDisplayValue(n);
    animV.setValue(n);

    // notify parent
    onChange?.(n);
  };

  const setFromAbsX = (absX) => {
    if (disabled) return;
    if (!trackW) return;

    const localX = absX - trackAbsX;
    const xOnTrack = clamp(localX, 0, trackW);
    const ratio = xOnTrack / trackW;

    const raw = min + ratio * (max - min);
    applyValue(raw);
  };

  const pan = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => !disabled,
        onMoveShouldSetPanResponder: () => !disabled,
        onPanResponderTerminationRequest: () => false,

        onPanResponderGrant: async (_evt, gesture) => {
          draggingRef.current = true;
          await measureAbsX();

          const startX = Number.isFinite(gesture?.x0) ? gesture.x0 : gesture?.moveX;
          if (Number.isFinite(startX)) setFromAbsX(startX);
        },

        onPanResponderMove: (_evt, gesture) => {
          const x = Number.isFinite(gesture?.moveX) ? gesture.moveX : gesture?.x0;
          if (Number.isFinite(x)) setFromAbsX(x);
        },

        onPanResponderRelease: () => {
          draggingRef.current = false;
        },

        onPanResponderTerminate: () => {
          draggingRef.current = false;
        },
      }),
    [disabled, trackW, trackAbsX]
  );

  // render based on displayValue (not parent value)
  const v = normalize(displayValue, min, max);
  const ratio = clamp((v - min) / (max - min), 0, 1);

  const fillW = trackW * ratio;
  const thumbCenterX = trackW * ratio; // 0..trackW exactly
  const thumbLeft = inset + thumbCenterX - thumbSize / 2; // stays within outer
  const thumbTop = (thumbSize - trackH) / 2 - (thumbSize - trackH) / 2; // keep thumb container aligned
  const trackTop = (thumbSize - trackH) / 2;

  const categoryColor = getCategoryColor(v);

  return (
    <View style={styles.ratingWrap}>
      {/* rating number */}
      <View style={styles.ratingBigWrap}>
        <Animated.Text style={[styles.ratingBigText, { color: colorAnim }]}>
          {v.toFixed(1)}
        </Animated.Text>
      </View>

      {/* outer width measure + drag handlers */}
      <View ref={outerRef} style={styles.ratingTrackOuter} onLayout={onOuterLayout}>
        <View style={[styles.ratingTrackStack, { height: thumbSize }]} {...pan.panHandlers}>
          {/* shorter bar */}
          <Animated.View
            style={[
              styles.ratingTrack,
              {
                position: "absolute",
                left: inset,
                width: trackW,
                height: trackH,
                top: trackTop,
                backgroundColor: trackBgAnim,
                opacity: disabled ? 0.65 : 1,
              },
            ]}
          >
            <View style={[styles.ratingFill, { width: fillW, backgroundColor: categoryColor }]} />
          </Animated.View>

          {/* thumb ring exactly within ends */}
          <View
            pointerEvents="none"
            style={[
              styles.ratingThumbCircle,
              {
                width: thumbSize,
                height: thumbSize,
                borderRadius: thumbSize / 2,
                left: thumbLeft,
                top: 0,
                borderColor: categoryColor,
              },
            ]}
          >
            <View
              pointerEvents="none"
              style={{
                width: thumbSize - ring * 2,
                height: thumbSize - ring * 2,
                borderRadius: (thumbSize - ring * 2) / 2,
                backgroundColor: "#000",
                opacity: 1,
              }}
            />
          </View>
        </View>
      </View>

      {/* ticks */}
      <View style={styles.ratingTicksRow}>
        <Text style={styles.ratingTickText}>{min.toFixed(1)}</Text>
        <Text style={styles.ratingTickText}>5</Text>
        <Text style={styles.ratingTickText}>{max.toFixed(0)}</Text>
      </View>

      {/* +/- */}
      <View style={styles.ratingStepRowCentered}>
        <Pressable
          disabled={disabled}
          onPress={() => applyValue(v - step)}
          style={[styles.ratingStepBtnSmall, disabled ? styles.ratingStepBtnDisabled : null]}
        >
          <Text style={styles.ratingStepBtnTextSmall}>−</Text>
        </Pressable>

        <Pressable
          disabled={disabled}
          onPress={() => applyValue(v + step)}
          style={[styles.ratingStepBtnSmall, disabled ? styles.ratingStepBtnDisabled : null]}
        >
          <Text style={styles.ratingStepBtnTextSmall}>+</Text>
        </Pressable>
      </View>
    </View>
  );
}

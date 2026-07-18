/**
 * GLSL shaders for the ENCOMM intelligence field.
 *
 * Particles are points with a per-instance target position (formation),
 * a random seed, and a size. The vertex shader animates them toward their
 * target with noise-based drift and cursor attraction; the fragment shader
 * renders soft spectral points.
 */

export const fieldVertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uPixelRatio;
  uniform vec2 uCursor;        // -1..1
  uniform float uCursorStrength;
  uniform float uVelocity;     // smoothed |scroll velocity|
  uniform float uFormation;    // 0..1 blend between formations
  uniform float uSize;
  uniform float uIntro;        // 0..1 boot-in

  attribute vec3 aTargetA;     // formation A
  attribute vec3 aTargetB;     // formation B
  attribute float aSeed;       // 0..1 random
  attribute float aScale;      // per-point size factor
  attribute vec3 aColor;       // per-point color

  varying float vSeed;
  varying float vDepth;
  varying vec3 vColor;

  // cheap hash noise
  vec3 hash3(float n) {
    return fract(sin(vec3(n, n + 1.0, n + 2.0)) * vec3(43758.5453, 22578.1459, 19642.3451));
  }

  void main() {
    vSeed = aSeed;
    vColor = aColor;

    // Blend between two formations
    vec3 base = mix(aTargetA, aTargetB, uFormation);

    // Idle drift via noise — small, slow, organic
    float t = uTime * 0.18 + aSeed * 12.0;
    vec3 noise = (hash3(aSeed * 91.7 + floor(t)) - 0.5) * 0.6;
    float drift = 0.9 + 0.4 * sin(t * 0.6 + aSeed * 6.28);
    vec3 pos = base + noise * drift;

    // boot-in: converge from a scattered shell
    pos = mix(normalize(base + 0.001) * 9.0 + noise * 2.0, pos, uIntro);

    // cursor attraction in XY plane (subtle)
    vec2 toCursor = uCursor * 1.4 - pos.xy;
    float cd = length(toCursor);
    float pull = uCursorStrength / (1.0 + cd * cd * 0.6);
    pos.xy += toCursor * pull * 0.08;

    // scroll-velocity distortion: stretch along Y, jitter by velocity
    pos.y += uVelocity * 0.02 * (aSeed - 0.5);
    pos.x += sin(uTime * 2.0 + aSeed * 30.0) * uVelocity * 0.004;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    vDepth = -mvPosition.z;

    float size = uSize * aScale * (1.0 / max(0.1, -mvPosition.z * 0.08));
    gl_PointSize = size * uPixelRatio * (300.0 / max(1.0, -mvPosition.z));
    gl_Position = projectionMatrix * mvPosition;
  }
`;

export const fieldFragmentShader = /* glsl */ `
  precision mediump float;
  varying float vSeed;
  varying float vDepth;
  varying vec3 vColor;

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    if (d > 0.5) discard;

    // soft circular falloff with a brighter core
    float core = smoothstep(0.5, 0.0, d);
    float halo = smoothstep(0.5, 0.15, d) * 0.5;
    float alpha = core * 0.85 + halo * 0.4;

    // depth-based dimming
    float depthFade = clamp(1.4 - vDepth * 0.035, 0.25, 1.0);
    alpha *= depthFade;

    vec3 col = vColor;
    // twinkle by seed
    col += 0.15 * sin(vSeed * 50.0);

    gl_FragColor = vec4(col, alpha);
  }
`;

/**
 * Fresnel rim shader — used for the ENCOMM Core's inner glow shell.
 * Gives an iridescent edge-light look on a translucent sphere.
 */
export const fresnelVertexShader = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vViewDir;
  varying vec3 vWorldPos;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vNormal = normalize(normalMatrix * normal);
    vViewDir = normalize(-mv.xyz);
    vWorldPos = (modelMatrix * vec4(position, 1.0)).xyz;
    gl_Position = projectionMatrix * mv;
  }
`;

export const fresnelFragmentShader = /* glsl */ `
  uniform float uTime;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform vec3 uColorC;
  uniform float uOpacity;
  varying vec3 vNormal;
  varying vec3 vViewDir;
  varying vec3 vWorldPos;

  void main() {
    float f = 1.0 - max(dot(normalize(vNormal), normalize(vViewDir)), 0.0);
    f = pow(f, 2.4);
    // iridescent shift
    float shift = 0.5 + 0.5 * sin(uTime * 0.4 + vWorldPos.x * 0.6);
    vec3 col = mix(uColorA, uColorB, f);
    col = mix(col, uColorC, shift * f * 0.5);
    gl_FragColor = vec4(col, f * uOpacity);
  }
`;

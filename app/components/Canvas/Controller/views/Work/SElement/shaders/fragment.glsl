uniform sampler2D tMap;
uniform sampler2D tDisp;

uniform float uAlpha;
uniform float uState;
uniform float uTime;

varying vec2 vUv;

void main()
{
  vec2 center = vec2(0.5);

  vec4 noise = texture2D(tDisp, vUv + (uTime * 0.02));
  float state = uState * 0.66 + noise.g * 0.04;

  float calcSquare = 1.0 - smoothstep(
    -0.05,
    0.0,
    0.21 * max(
      abs(distance(center.x, vUv.x)),
      abs(distance(center.y, vUv.y))) - state * (1.0 + 0.05)
  );

  float interpolation = pow(abs(calcSquare), 4.0);

  vec4 t1 = texture2D( tMap, (vUv - 0.5) * interpolation + 0.5 );
  vec4 t2 = vec4(1.0, 0.988, 0.949, 1.0);

  gl_FragColor = mix( t2, t1, interpolation );
  gl_FragColor.a = uAlpha;
}
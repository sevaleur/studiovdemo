uniform sampler2D tMap;
uniform sampler2D tState;
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
    -0.1,
    0.0,
    0.25 * max(
      abs(distance(center.x, vUv.x)),
      abs(distance(center.y, vUv.y))) - state * (1.0 + 0.1)
  );

  float interpolation = pow(abs(calcSquare), 1.0);

  vec4 t1 = texture2D( tMap, (vUv - 0.5) * (1.0 - interpolation) + 0.5 );
  vec4 t2 = texture2D( tState, (vUv - 0.5) * interpolation + 0.5 );

  gl_FragColor = mix( t1, t2, interpolation );
  gl_FragColor.a = uAlpha;
}
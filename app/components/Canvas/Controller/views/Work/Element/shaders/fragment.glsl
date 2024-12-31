uniform sampler2D tMap;

uniform float uAlpha;

varying vec2 vUv;

void main()
{
  vec4 t1 = texture2D(tMap, vUv);

  gl_FragColor = t1;
  gl_FragColor.a = uAlpha;
}
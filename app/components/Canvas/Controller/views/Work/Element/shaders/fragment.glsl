uniform sampler2D tMap;

uniform float uAlpha;

uniform vec2 uPlaneSize;
uniform vec2 uImageSize;

varying vec2 vUv;

void main()
{
  vec2 ratio = vec2(
    min((uPlaneSize.x / uPlaneSize.y) / (uImageSize.x / uImageSize.y), 1.0),
    min((uPlaneSize.y / uPlaneSize.x) / (uImageSize.y / uImageSize.x), 1.0)
  );

  vec2 uv = vec2(
    vUv.x * ratio.x + (1. - ratio.x) * .5,
    vUv.y * ratio.y + (1. - ratio.y) * .5
  );

  vec4 t1 = texture2D(tMap, uv);

  gl_FragColor = t1;
  gl_FragColor.a = uAlpha;
}
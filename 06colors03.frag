#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265359
#define TWO_PI 6.28318530718

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

vec3 hsb2rgb( in vec3 c ){
    vec3 rgb = clamp(abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),
                             6.0)-3.0)-1.0,
                     0.0,
                     1.0 );
    rgb = rgb*rgb*(3.0-2.0*rgb);
    return c.z * mix( vec3(1.0), rgb, c.y);
}

float plot(vec2 st, float pct){
    return smoothstep(pct-0.02, pct, st.y) - 
        smoothstep(pct, pct+0.02, st.y);
}

float easing (float x, float a){
  
  float epsilon = 0.00001;
  float min_param_a = 0.0 + epsilon;
  float max_param_a = 1.0 - epsilon;
  a = max(min_param_a, min(max_param_a, a));
  
  if (a < 0.5){
    // emphasis
    a = 2.0*(a);
    float y = pow(x, a);
    return y;
  } else {
    // de-emphasis
    a = 2.0*(a-0.5);
    float y = pow(x, 1.0/(1.0-a));
    return y;
  }
}

float circularEaseIn (float x){
  float y = 1.0 - sqrt(1.0 - x*x);
  return y;
}

float circularEaseOut (float x){
  float y = sqrt(1.0 - (1.0 - x * 1.0 - x));
  return y;
}

vec3 colorA = vec3(0.38, 0.49, 0.733);
vec3 colorZ = vec3(0.71, 0.19, 0.02);

vec3 colorR = vec3(1.0, 0.0, 0.0);
vec3 colorG = vec3(0.0, 1.0, 0.0);
vec3 colorB = vec3(0.0, 0.0, 1.0);

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution;
    vec3 color = vec3(0.0);

    vec2 toCenter = vec2(0.5)-st;
    float angle = atan(toCenter.y, toCenter.x);
    float radius = length(toCenter)*2.0;

    float anim = abs(fract(u_time/20.0));
    // anim = 0.5;
    color = hsb2rgb(vec3((angle/TWO_PI)+anim, circularEaseIn(radius)*4.0, 1.0));
    // color = hsb2rgb(vec3((angle/TWO_PI)+anim, radius, 1.0));

    gl_FragColor = vec4(color, 1.0);
}
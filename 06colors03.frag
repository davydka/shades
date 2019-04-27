#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265359

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

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

vec3 colorA = vec3(0.38, 0.49, 0.733);
vec3 colorZ = vec3(0.71, 0.19, 0.02);

vec3 colorR = vec3(1.0, 0.0, 0.0);
vec3 colorG = vec3(0.0, 1.0, 0.0);
vec3 colorB = vec3(0.0, 0.0, 1.0);

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution;
    vec3 color = vec3(0.0);

    float e = easing(st.x*2.0, abs(sin(u_time)));
    // vec3 pct = vec3(easing(st.x, abs(sin(u_time))));
    vec3 pct = vec3(e);
    // vec3 pct = vec3(st.x*2.0);
    // pct = step(0.5, pct);
    vec3 pct2 = vec3(e)-1.0;
    // vec3 pct2 = vec3(st.x*2.0)-1.0;
    // pct2 = step(0.5, pct2);
    // color = mix(colorA, colorB, pct);
    if(st.x < 0.5)
      color = mix(colorR, colorG, pct);
    else 
      color = mix(colorG, colorB, pct2);

    gl_FragColor = vec4(color, 1.0);
}
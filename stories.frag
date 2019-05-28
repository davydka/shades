#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265359
#define TWO_PI 6.28318530718

uniform vec2 u_resolution;
float outAspect = u_resolution.x/u_resolution.y;
uniform vec2 u_mouse;
uniform float u_time;

uniform float u_alpha;
uniform float u_circle1;
uniform float u_circle2;

uniform sampler2D u_tex0;
uniform vec2 u_tex0Resolution;
uniform float u_tex0scale;
uniform float u_tex0rot;
uniform float u_tex0posx;
uniform float u_tex0posy;

vec2 xy(float x, float y){
    vec2 pixel = vec2(x,y);
    return pixel/u_resolution;
}

float x(float pixel){
    return pixel/u_resolution.x;
}

float y(float pixel){
    return pixel/u_resolution.y;
}

// x1, y1, x2, y2
vec3 rect2(vec4 rectangle, vec2 st, vec3 rectColor, vec3 bgColor){
    vec3 returnColor = vec3(0.0, 0.0, 0.0);

    vec2 hv = step(rectangle.xy, st) * step(st, rectangle.zw);
    float onOff = hv.x * hv.y;

    returnColor = mix(bgColor, rectColor, onOff);

    return returnColor;
}

vec3 rect(vec2 pos, vec2 widthHeight, vec2 st, vec3 rectColor, vec3 bgColor){
    vec3 returnColor = vec3(0.0, 0.0, 0.0);
    vec4 rectangle = vec4(pos, pos+widthHeight);

    vec2 hv = step(rectangle.xy, st) * step(st, rectangle.zw);
    float onOff = hv.x * hv.y;

    returnColor = mix(bgColor, rectColor, onOff);
    return returnColor;
}


vec3 line(vec2 pos1, vec2 pos2, float height, vec2 st, vec3 lineColor, vec3 bgColor) {
    vec3 returnColor = vec3(0.0, 0.0, 0.0);
    height *=outAspect;
    vec2 pa = st - pos1, ba = pos2 - pos1;
    float h = clamp( dot(pa,ba)/dot(ba,ba), 0.0, 1.0 );
    float pct = 1.0 - step(height, length(pa - ba*h));
    returnColor = mix(bgColor, lineColor, pct);
    return returnColor;
}

vec3 div(vec2 pos, vec2 scale, float sides, vec2 st, vec3 divColor, vec3 bgColor) {
    vec3 returnColor = vec3(0.0, 0.0, 0.0);
    float d = 0.0;

    st = st-pos;
    st *= 1.0/scale;

    // Angle and radius from the current pixel
    float a = atan(st.x,st.y)+PI;
    float r = TWO_PI/float(sides);

    // Shaping function that modulate the distance
    d = cos(floor(.5+a/r)*r-a)*length(st);

    vec3 pct = vec3(1.0-smoothstep(.999,1.0,d));
    // pct = vec3(d);
    returnColor = mix(bgColor, divColor, pct);

    return returnColor;
}

vec3 img(vec2 pos, vec2 scale, sampler2D tex, vec2 texResolution, vec2 st, vec3 bgColor) {
    vec3 returnColor = vec3(0.0, 0.0, 0.0);

    if ( texResolution != vec2(0.0) ){
        float aspectImage   = texResolution.x/texResolution.y;
        float aspectDisplay = u_resolution.y/u_resolution.x;
        float scaleAdjust = texResolution.x / u_resolution.x;

        st -= vec2(0.5);
        st -= pos;
        st.y *= aspectImage;
        st.y *= aspectDisplay;
        st *= 1.0 / scaleAdjust;
        st *= 1.0 / scale;
        st += vec2(0.5);

        vec4 img = texture2D(tex,st);
        returnColor = mix(bgColor,img.rgb,img.a);
    }

    return returnColor;
}

void main(){
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    vec3 returnColor = vec3(.137, .133, .141);

    returnColor = div(
        xy(u_resolution.x/2.0, u_circle1),
        xy(u_resolution.x*1.5, u_resolution.y*1.5),
        80.0, // 3.0 + sin(u_time),
        st,
        vec3(.925, .851, .4),
        returnColor
    );

    returnColor = img(
        // xy(u_resolution.x/2.0, 300.0),
        // vec2(0.5),
        xy(u_tex0posx, u_tex0posy),
        vec2(u_tex0scale/100.0),
        u_tex0,
        u_tex0Resolution,
        st,
        returnColor
    );

    gl_FragColor = vec4(returnColor,u_alpha);
}

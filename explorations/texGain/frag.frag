#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265359
#define TWO_PI 6.28318530718

uniform vec2 u_resolution;
float outAspect = u_resolution.x/u_resolution.y;
uniform vec2 u_mouse;
uniform float u_time;

uniform float u_temp;
uniform sampler2D u_tex0;
uniform vec2 u_tex0Resolution;
uniform sampler2D u_tex1;
uniform vec2 u_tex1Resolution;

vec3 redColor = vec3(1.000,0.133,0.024);
vec3 greenColor = vec3(0.000,0.833,0.224);
vec3 blueColor = vec3(0.149,0.141,0.912);
vec3 yellowColor = vec3(1.000,0.833,0.224);
vec3 pinkColor = vec3(1.000,0.033,0.924);
vec3 purpleColor = vec3(0.500,0.033,0.924);
vec3 orangeColor = vec3(1.000,0.5,0.314);

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

    vec3 pct = vec3(1.0-smoothstep(.99,1.0,d));
    // pct = vec3(d);
    returnColor = mix(bgColor, divColor, pct);

    return returnColor;
}

vec3 img(vec2 pos, vec2 scale, sampler2D tex, vec2 texResolution, vec2 texSt, vec2 st, vec3 bgColor) {
    vec3 returnColor = vec3(0.0, 0.0, 0.0);

    if ( texResolution != vec2(0.0) ){
        float aspectImage   = texResolution.x/texResolution.y;
        float aspectDisplay = u_resolution.y/u_resolution.x;
        float scaleAdjust = texResolution.x / u_resolution.x;

        st -= pos;
        st.y *= aspectImage;
        st.y *= aspectDisplay;
        st *= 1.0 / scaleAdjust;
        st *= 1.0 / scale;

        vec4 img = texture2D(tex,st);
        // if(img.r > 0.8)
            // img.r = 0.0;

        returnColor = mix(bgColor,img.rgb,img.a);
    }

    return returnColor;
}

void main(){
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    // st *= 0.5; // retina?
    vec3 returnColor = blueColor;

    returnColor = img(
        xy(0.0, 0.0),
        vec2(1.0),
        u_tex0,
        u_tex0Resolution,
        gl_FragCoord.xy/u_tex0Resolution.xy,
        st,
        returnColor
    );


    returnColor = img(
        xy(0.0, 0.0),
        vec2(1.0),
        u_tex1,
        u_tex1Resolution,
        gl_FragCoord.xy/u_tex0Resolution.xy,
        st,
        returnColor
    );

    float time1 = u_time/10.0;
    time1 = abs(mod(time1, 2.0) - 1.0);
    float time2 = u_time/14.0;
    time2 = abs(mod(time2, 2.0) - 1.0);
    float time3 = u_time/8.4;
    time3 = abs(mod(time3, 2.0) - 1.0);

    vec3 temp = returnColor;
    if(temp.r < 1.0)
        temp.r = sin(fract(temp.r+time1));
    if(temp.g < 1.0)
        temp.g = sin(fract(temp.g+time2));
    if(temp.b < 1.0)
        temp.b = sin(fract(temp.b+time3));

    /*
    float time = u_time/1.0;
    vec3 temp = returnColor;
    temp.r = fract(temp.r*time);
    temp.g = fract(temp.g*time);
    temp.b = fract(temp.b*time);
    */

    returnColor = temp;


    gl_FragColor = vec4(returnColor,1.0);
}

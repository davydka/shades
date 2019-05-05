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
        returnColor = mix(bgColor,img.rgb,img.a);
    }

    return returnColor;
}

void main(){
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    vec3 returnColor = blueColor;

    // postion(x,y), width + height
    returnColor = rect(xy(500.0, 500.0), xy(100.0, 100.0), st, redColor, returnColor);

    returnColor = div(
        xy(250.0, 500.0),
        xy(50.0, 50.0),
        80.0, // 3.0 + sin(u_time),
        st,
        pinkColor,
        returnColor
    );

    returnColor = img(
        xy(250.0, 500.0),
        vec2(0.25),
        u_tex0,
        u_tex0Resolution,
        gl_FragCoord.xy/u_tex0Resolution.xy,
        st,
        returnColor
    );


    returnColor = line(xy(100.0, 200.0), xy(750.0, 300.0), x(5.0), st, purpleColor, returnColor);

    returnColor = div(
        // xy(420.0, 360.0),
        xy(420.0, u_temp),
        xy(50.0, 50.0),
        5.0, // 3.0 + sin(u_time),
        st,
        orangeColor,
        returnColor
    );


    // x1, y1, x2, y2
    vec4 rect = vec4(xy(25.0, 25.0), xy(50.0, 50.0));
    returnColor = rect2(rect, st, yellowColor, returnColor);
    
    rect = vec4(xy(125.0, 25.0), xy(150.0, 50.0));
    returnColor = rect2(rect, st, greenColor, returnColor);

    gl_FragColor = vec4(returnColor,1.0);
}

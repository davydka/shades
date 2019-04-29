#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

vec3 blueColor = vec3(0.149,0.141,0.912);
vec3 yellowColor = vec3(1.000,0.833,0.224);
vec3 greenColor = vec3(0.000,0.833,0.224);
vec3 redColor = vec3(1.000,0.133,0.024);

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
vec3 rect(vec4 rectangle, vec2 st, vec3 rectColor, vec3 bgColor){
    vec3 returnColor = vec3(0.0, 0.0, 0.0);

    vec2 hv = step(rectangle.xy, st) * step(st, rectangle.zw);
    float onOff = hv.x * hv.y;

    returnColor = mix(bgColor, rectColor, onOff);

    return returnColor;
}

vec3 rrect(vec2 pos, vec2 widthHeight, vec2 st, vec3 rectColor, vec3 bgColor){
    vec3 returnColor = vec3(0.0);
    vec4 rectangle = vec4(pos, pos+widthHeight);

    vec2 hv = step(rectangle.xy, st) * step(st, rectangle.zw);
    float onOff = hv.x * hv.y;

    returnColor = mix(bgColor, rectColor, onOff);
    return returnColor;
}

void main(){
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    vec3 returnColor = blueColor;

    // x1, y1, x2, y2
    vec4 rect = vec4(xy(25.0, 25.0), xy(50.0, 50.0));
    returnColor = rect(rect, st, yellowColor, returnColor);
    
    rect = vec4(xy(125.0, 25.0), xy(150.0, 50.0));
    returnColor = rect(rect, st, greenColor, returnColor);

    returnColor = rrect(xy(500.0, 500.0), xy(100.0, 100.0), st, redColor, returnColor);

    gl_FragColor = vec4(returnColor,1.0);
}
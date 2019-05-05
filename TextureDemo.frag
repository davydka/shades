#version 150

uniform sampler2D uTex0;

in vec4 Color;
in vec2 TexCoord;

out vec4 oColor;

///////////////////// math support funtions

float to_radians( float degrees )
{
    return degrees * 0.01745329251;
}

mat2 rotate ( float angle_radians )
{
    return mat2( cos(angle_radians), -sin(angle_radians),
                 sin(angle_radians),  cos(angle_radians) );
}

vec2 rotate_pivot ( vec2 point, vec2 pivot, float angle_degrees )
{
    point -= pivot;
    point *= rotate( to_radians(angle_degrees) );
    point += pivot;

    return point;
}

/////////////////////

void main(void)
{
    vec2 coord = vec2(TexCoord.x, 1.0 - TexCoord.y);

    // [scale] //
    // float scale = 1.0;
    // float inverse = 1.0 / scale;
    // coord *= inverse;

    // [translate] //
    // coord += vec2(-0.1, 0.0);

    // [rotate] //
    // coord = rotate_pivot(coord, vec2(0.5, 0.5), 45.0);

    // [get strange] //
    // coord = vec2(sqrt(coord.x*coord.y), coord.y);

    // [wrap] //
    // texture() expects to sample an image between 0.0 and 1.0
    // I can wrap the image using fract which keeps the decimal portion
    // of a float. for example: fract(1.4) == 0.4
    // coord = fract(coord);

    // [tint] //
    vec3 extraTint = vec3(1.0, 1.0, 1.0);
    // vec3 extraTint = vec3(1.0, 0.55, 1.0);

    oColor.rgb = texture(uTex0, coord).rgb * Color.rgb * extraTint;
    oColor.a = 1.0;
}

// Further reading:
//   https://thebookofshaders.com/
//
// To match the examples you find online, make sure you have the same inputs to your shader.
// You'll have to understand what their uniforms are vs what cinder is providing.
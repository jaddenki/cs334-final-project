#version 300 es // For WebGL 2.0
// OR #version 100 // For WebGL 1.0

in vec2 a_position; // 'attribute' becomes 'in' in GLSL 300 es
uniform mat3 u_matrix;

void main() {
    vec2 position = (u_matrix * vec3(a_position, 1)).xy;
    gl_Position = vec4(position, 0, 1);
    gl_PointSize = 3.0;
}
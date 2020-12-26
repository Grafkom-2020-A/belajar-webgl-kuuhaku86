attribute vec3 a_Position;
attribute vec3 a_Color;
attribute vec3 a_Normal;
varying vec3 v_Color;
varying vec3 v_Normal;
varying vec3 v_Position;
uniform mat4 u_Projection;
uniform mat4 u_View;
uniform mat4 u_Model;
uniform mat3 u_Normal;

void main() {
    gl_Position = u_Projection * u_View * u_Model * vec4(a_Position, 1.0);
    v_Position = (u_Model * vec4(a_Position, 1.0)).xyz;
    v_Color = a_Color;
    v_Normal = normalize(u_Normal * a_Normal);
}
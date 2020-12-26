precision mediump float;
uniform vec3 u_DiffuseColor;
uniform vec3 u_DiffusePosition;
uniform vec3 u_AmbientColor;
varying vec3 v_Color;
varying vec3 v_Normal;
varying vec3 v_Position;

void main() {
    // Vektor cahaya = titik sumber cahaya - titik verteks
    vec3 lightPos = u_DiffusePosition;
    vec3 v_light = normalize(lightPos - v_Position);
    float dotNL = max(dot(v_Normal, v_light), 0.0);
    vec3 diffuse = v_Color * u_DiffuseColor * dotNL;
    vec3 ambient = v_Color * u_AmbientColor;
    gl_FragColor = vec4(ambient + diffuse, 1.0);
}
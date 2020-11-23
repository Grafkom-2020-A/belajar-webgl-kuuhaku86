function main() {
    let canvas = document.getElementById("myCanvas");
    let gl = canvas.getContext("webgl");

    let vertices = [];

    let cubePoints = [
        [-0.5,  0.5,  0.5],   // A, 0
        [-0.5, -0.5,  0.5],   // B, 1
        [ 0.5, -0.5,  0.5],   // C, 2 
        [ 0.5,  0.5,  0.5],   // D, 3
        [-0.5,  0.5, -0.5],   // E, 4
        [-0.5, -0.5, -0.5],   // F, 5
        [ 0.5, -0.5, -0.5],   // G, 6
        [ 0.5,  0.5, -0.5]    // H, 7 
    ];

    let cubeColors = [
        [],
        [1.0, 0.0, 0.0],    // merah
        [0.0, 1.0, 0.0],    // hijau
        [0.0, 0.0, 1.0],    // biru
        [1.0, 1.0, 1.0],    // putih
        [1.0, 0.5, 0.0],    // oranye
        [1.0, 1.0, 0.0],    // kuning
        []
    ];

    function quad(a, b, c, d) {
        let indices = [a, b, c, c, d, a];
        for (let i=0; i<indices.length; i++) {
            for (let j=0; j<3; j++) {
                vertices.push(cubePoints[indices[i]][j]);
            }
            for (let j=0; j<3; j++) {
                vertices.push(cubeColors[a][j]);
            }
        }
    }

    quad(1, 2, 3, 0); // Kubus depan
    quad(2, 6, 7, 3); // Kubus kanan
    quad(3, 7, 4, 0); // Kubus atas
    quad(4, 5, 1, 0); // Kubus kiri
    quad(5, 4, 7, 6); // Kubus belakang
    quad(6, 2, 1, 5); // Kubus bawah

    let vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    let vertexShaderCode = document.getElementById('vertexShaderSource').innerText;

    let vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vertexShaderCode);
    gl.compileShader(vertexShader);

    let fragmentShaderCode = document.getElementById('fragmentShaderSource').innerText;

    let fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fragmentShaderCode);
    gl.compileShader(fragmentShader);

    let shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
    gl.useProgram(shaderProgram);

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    let aPosition = gl.getAttribLocation(shaderProgram, "a_Position");
    let aColor = gl.getAttribLocation(shaderProgram, "a_Color");
    gl.vertexAttribPointer(
        aPosition, 
        3, 
        gl.FLOAT, 
        false, 
        6 * Float32Array.BYTES_PER_ELEMENT, 
        0
    );
    gl.vertexAttribPointer(
        aColor, 
        3, 
        gl.FLOAT, 
        false, 
        6 * Float32Array.BYTES_PER_ELEMENT, 
        3 * Float32Array.BYTES_PER_ELEMENT
    );
    gl.enableVertexAttribArray(aPosition);
    gl.enableVertexAttribArray(aColor);

    gl.clearColor(0.2, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.viewport(0, 0, canvas.width * (canvas.height / canvas.width), canvas.height)
    gl.enable(gl.DEPTH_TEST);

    let primitive = gl.TRIANGLES;
    let offset = 0;
    let count = 36;

    let model = glMatrix.mat4.create();
    let view = glMatrix.mat4.create();
    glMatrix.mat4.lookAt(
        view,
        // dimana posisi kamera,
        [0.0, 0.0, 0.0],
        // arah menghadap
        [0.0, 0.0, -2.0],
        // kemana arah atas kamera
        [0.0, 1.0, 0.0]
    );
    let projection = glMatrix.mat4.create();
    glMatrix.mat4.perspective(
        projection,
        //fov in radiant
        glMatrix.glMatrix.toRadian(90),
        1.0,
        0.5,
        10.0,
    );
    let uModel = gl.getUniformLocation(shaderProgram, 'u_Model');
    let uView = gl.getUniformLocation(shaderProgram, 'u_View');
    let uProjection = gl.getUniformLocation(shaderProgram, 'u_Projection');

    let uAmbientColor = gl.getUniformLocation(shaderProgram, 'u_AmbientColor');
    gl.uniform3fv(uAmbientColor, [0.2, 0.4, 0.6]);

    function render() {
        let theta = glMatrix.glMatrix.toRadian(1);
        glMatrix.mat4.rotate(model, model, theta, [1.0, 1.0, 1.0]);
        gl.uniformMatrix4fv(uModel, false, model);
        gl.uniformMatrix4fv(uView, false, view);
        gl.uniformMatrix4fv(uProjection, false, projection);
        gl.clearColor(0.0, 0.22, 0.5, 1.0);
        gl.clear(gl.COLOR_BUFFER_BI | gl.DEPTH_BUFFER_BIT);
        gl.drawArrays(primitive, offset, count);
        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
}
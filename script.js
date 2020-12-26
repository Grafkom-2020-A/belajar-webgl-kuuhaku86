function readTextFile(file)
{
    let rawFile = new XMLHttpRequest();
    let allText = "";
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                allText = rawFile.responseText;
            }
        }
    }
    rawFile.send(null);
    return allText;
}

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

    let cubeNormals = [
        [],
        [0.0, 0.0, 1.0],    // depan
        [1.0, 0.0, 0.0],    // kanan
        [0.0, 1.0, 0.0],    // atas
        [-1.0, 0.0, 0.0],    // kiri
        [0.0, 0.0, -1.0],    // belakang
        [0.0, -1.0, 0.0],    // bawah
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
            for (let j=0; j<3; j++) {
                vertices.push(cubeNormals[a][j]);
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

    let vertexShaderCode = readTextFile('glsl/glslVertex.glsl');

    let vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vertexShaderCode);
    gl.compileShader(vertexShader);

    let fragmentShaderCode = readTextFile('glsl/glslFragment.glsl');

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
    let aNormal = gl.getAttribLocation(shaderProgram, "a_Normal");
    gl.vertexAttribPointer(
        aPosition, 
        3, 
        gl.FLOAT, 
        false, 
        9 * Float32Array.BYTES_PER_ELEMENT, 
        0
    );
    gl.vertexAttribPointer(
        aColor, 
        3, 
        gl.FLOAT, 
        false, 
        9 * Float32Array.BYTES_PER_ELEMENT, 
        3 * Float32Array.BYTES_PER_ELEMENT
    );
    gl.vertexAttribPointer(
        aNormal, 
        3, 
        gl.FLOAT, 
        false, 
        9 * Float32Array.BYTES_PER_ELEMENT, 
        6 * Float32Array.BYTES_PER_ELEMENT);
    gl.enableVertexAttribArray(aPosition);
    gl.enableVertexAttribArray(aColor);
    gl.enableVertexAttribArray(aNormal);

    gl.viewport(100, 0, canvas.height, canvas.height);
    gl.enable(gl.DEPTH_TEST);

    let primitive = gl.TRIANGLES;
    let offset = 0;
    let count = 36;

    let model = glMatrix.mat4.create();
    let view = glMatrix.mat4.create();
    glMatrix.mat4.lookAt(
        view,
        // dimana posisi kamera,
        [0.0, 0.0, 2.0],
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
    gl.uniform3fv(uAmbientColor, [0.2, 0.2, 0.2]);
    let uDiffuseColor = gl.getUniformLocation(shaderProgram, 'u_DiffuseColor');
    gl.uniform3fv(uDiffuseColor, [1.0, 1.0, 1.0]);
    let uDiffusePosition = gl.getUniformLocation(shaderProgram, 'u_DiffusePosition');
    gl.uniform3fv(uDiffusePosition, [1.0, 2.0, 1.0]);
    let uNormal = gl.getUniformLocation(shaderProgram, "u_Normal");

    function render() {
        let theta = glMatrix.glMatrix.toRadian(1);
        glMatrix.mat4.rotate(model, model, theta, [1.0, 1.0, 1.0]);
        gl.uniformMatrix4fv(uModel, false, model);
        gl.uniformMatrix4fv(uView, false, view);
        gl.uniformMatrix4fv(uProjection, false, projection);
        let normal = glMatrix.mat3.create();
        glMatrix.mat3.normalFromMat4(normal, model);
        gl.uniformMatrix3fv(uNormal, false, normal);
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.drawArrays(primitive, offset, count);
        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
}
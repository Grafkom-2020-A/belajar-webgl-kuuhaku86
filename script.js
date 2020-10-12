function main() {
    let canvas = document.getElementById("myCanvas");
    let gl = canvas.getContext("webgl");

    let vertices = [
        -0.5, 0.5,      // Titik A 
        -0.5, -0.5,     // Titik B
        0.5, -0.5,       // Titik C
        -0.5, 0.5,      // Titik A 
    ];

    let positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
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

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    let aPosition = gl.getAttribLocation(shaderProgram, "a_Position");
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(aPosition);

    gl.clearColor(0.2, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    let primitive = gl.LINE_STRIP;
    let offset = 0;
    let count = 4;

    gl.drawArrays(primitive, offset, count)
}
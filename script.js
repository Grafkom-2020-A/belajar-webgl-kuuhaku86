function main() {
    let canvas = document.getElementById("myCanvas");
    let gl = canvas.getContext("webgl");

    let vertices = [
        -0.5, 0.5, 1.0, 0.0, 0.0,      // Titik A 
        -0.5, -0.5, 1.0, 0.0, 0.0,     // Titik B
        0.5, -0.5, 1.0, 0.0, 0.0,      // Titik C
        0.5, -0.5, 0.0, 0.0, 1.0,      // Titik C
        0.5, 0.5, 0.0, 0.0, 1.0,       // Titik D
        -0.5, 0.5, 0.0, 0.0, 1.0       // Titik A 
    ];

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
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 5 * Float32Array.BYTES_PER_ELEMENT, 0);
    gl.vertexAttribPointer(aColor, 3, gl.FLOAT, false, 5 * Float32Array.BYTES_PER_ELEMENT, 2 * Float32Array.BYTES_PER_ELEMENT);
    gl.enableVertexAttribArray(aPosition);
    gl.enableVertexAttribArray(aColor);

    gl.clearColor(0.2, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    // gl.viewport(0, 0, canvas.width * (canvas.height / canvas.width), canvas.height)

    let primitive = gl.TRIANGLES;
    let offset = 0;
    let count = 6;

    gl.drawArrays(primitive, offset, count)
}
import React, { useEffect, useRef } from "react";

export default function ShaderBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let gl: WebGLRenderingContext | null = null;
    try {
      gl = (canvas.getContext("webgl") || canvas.getContext("experimental-webgl")) as WebGLRenderingContext;
    } catch (e) {
      console.error("WebGL not supported", e);
    }
    if (!gl) return;

    // Compile Vertex Shader
    const vsSource = `
      attribute vec2 a_position;
      varying vec2 v_texCoord;
      void main() {
        v_texCoord = a_position * 0.5 + 0.5;
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    // Compile Fragment Shader
    const fsSource = `
      precision highp float;
      varying vec2 v_texCoord;
      uniform float u_time;
      uniform vec2 u_resolution;
      uniform float u_intensity;

      float grid(vec2 uv, float res) {
          vec2 g = fract(uv * res);
          return 1.0 - smoothstep(0.0, 0.05, min(g.x, g.y));
      }

      void main() {
          vec2 uv = v_texCoord;
          vec2 centered_uv = (uv - 0.5) * (u_resolution.x / max(u_resolution.y, 1.0));
          
          // Deep warm brown base background #1e100b
          vec3 color = vec3(0.094, 0.043, 0.027); 
          
          float gValue = grid(uv + vec2(u_time * 0.03, u_time * 0.015), 12.0);
          color += vec3(1.0, 0.37, 0.12) * gValue * 0.04 * u_intensity;
          
          for(float i = 0.0; i < 3.0; i++) {
              vec2 pos = vec2(sin(u_time * 0.4 + i * 1.5), cos(u_time * 0.25 + i * 2.2)) * 0.45;
              float d = length(centered_uv - pos);
              float glow = 0.025 / max(d, 0.01);
              vec3 lightColor = (mod(i, 2.0) == 0.0) ? vec3(1.0, 0.37, 0.12) : vec3(0.608, 0.302, 0.902);
              color += lightColor * glow * 0.35 * u_intensity;
          }
          
          color *= 1.0 - length(uv - 0.5) * 1.1;
          gl_FragColor = vec4(color, 1.0);
      }
    `;

    function createShader(gl: WebGLRenderingContext, type: number, source: string): WebGLShader | null {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    }

    const vs = createShader(gl, gl.VERTEX_SHADER, vsSource);
    const fs = createShader(gl, gl.FRAGMENT_SHADER, fsSource);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("Unable to initialize the shader program: " + gl.getProgramInfoLog(program));
      return;
    }

    gl.useProgram(program);

    // Buffer setups
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    const vertices = new Float32Array([
      -1.0, -1.0,
       1.0, -1.0,
      -1.0,  1.0,
      -1.0,  1.0,
       1.0, -1.0,
       1.0,  1.0,
    ]);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const positionAttributeLocation = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

    const uTimeLocation = gl.getUniformLocation(program, "u_time");
    const uResolutionLocation = gl.getUniformLocation(program, "u_resolution");
    const uIntensityLocation = gl.getUniformLocation(program, "u_intensity");

    let animationFrameId: number;
    let currentIntensity = 1.0;
    let targetIntensity = 1.0;

    // Function to handle resizing
    function resizeCanvas() {
      if (!canvas || !gl) return;
      const displayWidth = canvas.clientWidth || window.innerWidth;
      const displayHeight = canvas.clientHeight || window.innerHeight;

      if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
        canvas.width = displayWidth;
        canvas.height = displayHeight;
        gl.viewport(0, 0, canvas.width, canvas.height);
      }
    }

    // Set up resize observer
    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(() => resizeCanvas());
      resizeObserver.observe(canvas);
    } else {
      window.addEventListener("resize", resizeCanvas);
    }
    resizeCanvas();

    // Pulse function exposed on window
    const pulseHandler = () => {
      targetIntensity = 2.0;
      setTimeout(() => {
        targetIntensity = 1.0;
      }, 500);
    };
    (window as any).pulseShader = pulseHandler;

    let startTime = Date.now();

    function render() {
      if (!gl || !canvas) return;

      const time = (Date.now() - startTime) * 0.001;

      // Smooth interpolation for intensity pulse
      currentIntensity += (targetIntensity - currentIntensity) * 0.1;

      gl.uniform1f(uTimeLocation, time);
      gl.uniform2f(uResolutionLocation, canvas.width, canvas.height);
      gl.uniform1f(uIntensityLocation, currentIntensity);

      gl.drawArrays(gl.TRIANGLES, 0, 6);

      animationFrameId = requestAnimationFrame(render);
    }

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (resizeObserver) {
        resizeObserver.disconnect();
      } else {
        window.removeEventListener("resize", resizeCanvas);
      }
      delete (window as any).pulseShader;
    };
  }, []);

  return (
    <canvas
      id="shader-canvas-ANIMATION_2"
      ref={canvasRef}
      className="absolute inset-0 w-full h-full block pointer-events-none opacity-80"
      style={{ mixBlendMode: "screen" }}
    />
  );
}

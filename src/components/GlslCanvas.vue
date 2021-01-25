<template>
    <canvas id="glslCanvas"></canvas>
</template>
<script>
import GlslCanvas from "glslCanvas"
export default {
    name: 'glslCanvas',
    mounted () {
        var canvas = document.getElementById("glslCanvas");
        console.log(canvas);
        var sandbox = new GlslCanvas(canvas);
        sandbox.setUniform("u_color",1,0,0); 
        // Load only the Fragment Shader
        var string_frag_code = `
            #ifdef GL_ES
            precision mediump float;
            #endif
            uniform vec3 u_color;
            void main() {
                gl_FragColor = vec4(u_color,1.0);
            }
        `;
        sandbox.load(string_frag_code);

        // Load a Fragment and Vertex Shader
        var string_vert_code = `
            attribute vec4 a_position; 
            void main(){
                gl_Position = a_position;
            }
        `;
        sandbox.load(string_frag_code, string_vert_code);
        
    }
}
</script>

<style scoped>
#glslCanvas {
    width: 100%;
    height: 100%;
}
</style>
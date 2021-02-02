<template>
    <div>
        <canvas id="glslCanvas" ref="glslCanvas"></canvas>
        <div class="test">{{terminal}}</div>
    </div>
</template>
<script>
import GlslCanvas from "glslCanvas"
export default {
    name: 'glslCanvas',
    data() {

        return {
            terminal: 0
        }
    },
    created() {
        setInterval(() => {
            this.$data.terminal++
        }, 1000); 
    },
    mounted () {
        var canvas = this.$refs.glslCanvas;
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
    },
    updated () {
        console.log('更新...');
    }
}
</script>

<style scoped>
#glslCanvas {
    width: 100%;
    height: 100%;
}

.test{
    position: absolute;
    top: 10px;
    z-index: 10;
    left: 50%;
    color: aliceblue;
}
</style>
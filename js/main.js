import { LeafVenation } from './LeafVenation.js';

class App {
    constructor() {
        this.canvas = document.getElementById('glCanvas');
        this.gl = this.canvas.getContext('webgl');
        this.simulator = null;
        
        this.initWebGL()
            .then(() => this.initEventListeners())
            .then(() => this.startAnimation());
    }

    async initWebGL() {
        const [vertexShader, fragmentShader] = await Promise.all([
            fetch('shaders/vertex.glsl').then(res => res.text()),
            fetch('shaders/fragment.glsl').then(res => res.text())
        ]);
        
        this.simulator = new LeafVenation(this.gl, vertexShader, fragmentShader);
        this.simulator.resetSimulation();
    }

    initEventListeners() {
        document.getElementById('auxinDensity').addEventListener('input', e => {
            this.simulator.params.auxinDensity = e.target.value;
            this.simulator.resetSimulation();
        });
    }

    startAnimation() {
        const render = () => {
            this.simulator.growVeins();
            this.simulator.render();
            requestAnimationFrame(render);
        };
        requestAnimationFrame(render);
    }
}

// Start application
new App();
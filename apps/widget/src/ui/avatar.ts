import * as THREE from 'three';
import { HIGHEST_Z_INDEX } from '../config/constants';

/**
 * Optional Three.js avatar: lightweight floating sphere in bottom-right corner.
 */
export class AvatarAssistant {
  private static renderer: THREE.WebGLRenderer | null = null;
  private static scene: THREE.Scene | null = null;
  private static camera: THREE.PerspectiveCamera | null = null;
  private static mesh: THREE.Mesh | null = null;
  private static animationFrame: number | null = null;
  private static container: HTMLDivElement | null = null;

  static mount(): void {
    if (this.renderer) return;

    this.container = document.createElement('div');
    this.container.className = 'onboarding-tour-avatar';
    this.container.style.zIndex = String(HIGHEST_Z_INDEX);
    document.body.appendChild(this.container);

    const width = this.container.clientWidth || 160;
    const height = this.container.clientHeight || 160;

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(width, height);
    this.container.appendChild(this.renderer.domElement);

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    this.camera.position.z = 3;

    const ambient = new THREE.AmbientLight(0xffffff, 0.8);
    this.scene.add(ambient);
    const directional = new THREE.DirectionalLight(0x7ab0ff, 0.8);
    directional.position.set(2, 2, 3);
    this.scene.add(directional);

    const geometry = new THREE.SphereGeometry(0.9, 32, 32);
    const material = new THREE.MeshStandardMaterial({
      color: 0x6aa3ff,
      emissive: 0x102040,
      roughness: 0.3,
      metalness: 0.2,
    });
    this.mesh = new THREE.Mesh(geometry, material);
    this.scene.add(this.mesh);

    this.animate();
  }

  private static animate(): void {
    if (!this.renderer || !this.scene || !this.camera || !this.mesh) return;

    const tick = () => {
      if (!this.mesh || !this.renderer || !this.scene || !this.camera) return;
      this.mesh.rotation.y += 0.01;
      this.mesh.rotation.x += 0.005;
      this.mesh.position.y = Math.sin(performance.now() / 800) * 0.1;
      this.renderer.render(this.scene, this.camera);
      this.animationFrame = requestAnimationFrame(tick);
    };

    this.animationFrame = requestAnimationFrame(tick);
  }

  static destroy(): void {
    if (this.animationFrame !== null) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }

    if (this.mesh) {
      this.mesh.geometry.dispose();
      if (this.mesh.material instanceof THREE.Material) {
        this.mesh.material.dispose();
      }
      this.mesh = null;
    }

    if (this.renderer) {
      this.renderer.dispose();
      this.renderer = null;
    }

    this.scene = null;
    this.camera = null;

    if (this.container) {
      this.container.remove();
      this.container = null;
    }
  }
}

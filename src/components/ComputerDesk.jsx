import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function ComputerDesk() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x111827);

    const camera = new THREE.PerspectiveCamera(
      60,
      mount.clientWidth / mount.clientHeight,
      0.1,
      100
    );

    camera.position.set(0, 3, 8);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
    });

    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    mount.appendChild(renderer.domElement);

    // Lights
    scene.add(new THREE.AmbientLight(0xffffff, 0.7));

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(5, 10, 5);
    scene.add(dirLight);

    // ---------- Desk ----------
    const desk = new THREE.Mesh(
      new THREE.BoxGeometry(6, 0.25, 3),
      new THREE.MeshStandardMaterial({
        color: 0x8b5a2b,
      })
    );
    desk.position.y = -1;
    scene.add(desk);

    // ---------- Monitor ----------
    const monitor = new THREE.Group();

    const screen = new THREE.Mesh(
      new THREE.BoxGeometry(2.3, 1.4, 0.08),
      new THREE.MeshStandardMaterial({
        color: 0x202020,
      })
    );

    const display = new THREE.Mesh(
      new THREE.PlaneGeometry(2.1, 1.2),
      new THREE.MeshBasicMaterial({
        color: 0x33ff88,
      })
    );

    display.position.z = 0.05;

    monitor.add(screen);
    monitor.add(display);

    const stand = new THREE.Mesh(
      new THREE.CylinderGeometry(0.05, 0.08, 0.7),
      new THREE.MeshStandardMaterial({
        color: 0x666666,
      })
    );

    stand.position.y = -1;

    const base = new THREE.Mesh(
      new THREE.CylinderGeometry(0.35, 0.45, 0.05, 32),
      new THREE.MeshStandardMaterial({
        color: 0x444444,
      })
    );

    base.position.y = -1.35;

    monitor.add(stand);
    monitor.add(base);

    monitor.position.set(0, 0.2, 0);

    scene.add(monitor);

    // ---------- Keyboard ----------
    const keyboard = new THREE.Mesh(
      new THREE.BoxGeometry(1.8, 0.08, 0.7),
      new THREE.MeshStandardMaterial({
        color: 0x2a2a2a,
      })
    );

    keyboard.position.set(0, -0.85, 1);

    scene.add(keyboard);

    // ---------- Mouse ----------
    const mouse = new THREE.Mesh(
      new THREE.SphereGeometry(0.12, 32, 32),
      new THREE.MeshStandardMaterial({
        color: 0x444444,
      })
    );

    mouse.scale.set(1, 0.6, 1.5);
    mouse.position.set(1.3, -0.85, 1);

    scene.add(mouse);

    // ---------- PC Tower ----------
    const tower = new THREE.Mesh(
      new THREE.BoxGeometry(0.8, 2, 1.2),
      new THREE.MeshStandardMaterial({
        color: 0x222222,
      })
    );

    tower.position.set(-2.2, -0.1, 0);

    scene.add(tower);

    // ---------- Animation ----------
    const clock = new THREE.Clock();

    let frame;

    function animate() {
      frame = requestAnimationFrame(animate);

      const t = clock.getElapsedTime();

      monitor.rotation.y = Math.sin(t * 0.6) * 0.15;
      tower.rotation.y = Math.sin(t * 0.4) * 0.05;

      renderer.render(scene, camera);
    }

    animate();

    function resize() {
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(
        mount.clientWidth,
        mount.clientHeight
      );
    }

    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);

      renderer.dispose();

      while (mount.firstChild) {
        mount.removeChild(mount.firstChild);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        width: "100%",
        height: "500px",
        borderRadius: "16px",
        overflow: "hidden",
      }}
    />
  );
}

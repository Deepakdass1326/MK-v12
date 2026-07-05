import { forwardRef, useEffect, useMemo, useRef } from "react";
import { useGLTF, useTexture } from "@react-three/drei";
import { SkeletonUtils } from "three-stdlib";
import * as THREE from "three";
import gsap from "gsap";
import { SKINS } from "../data/skins";

const MODEL_URL = "/models/sniper_rifle.glb";

const DEFAULT_SKIN = {
  color: "#343b36",
  roughness: 0.36,
  metalness: 0.78,
  clearcoat: 0.12,
  clearcoatRoughness: 0.24,
  envMapIntensity: 0.95,
};

const MATCAP_URLS = SKINS.map((skin) => skin.matcap);

function prepareTexture(texture, colorSpace) {
  if (!texture) return null;
  texture.flipY = false;
  if (colorSpace) texture.colorSpace = colorSpace;
  texture.needsUpdate = true;
  return texture;
}

function createMaterialPair(sourceMaterial, matcapTexture) {
  // The source color map is nearly black, which makes the rifle disappear.
  // Keep the normal/detail maps, but let scene lighting and matcaps drive color.
  prepareTexture(sourceMaterial?.map ?? null, THREE.SRGBColorSpace);
  const normalMap = prepareTexture(sourceMaterial?.normalMap ?? null);
  const aoMap = prepareTexture(sourceMaterial?.aoMap ?? null);
  const roughnessMap = prepareTexture(sourceMaterial?.roughnessMap ?? null);
  const metalnessMap = prepareTexture(sourceMaterial?.metalnessMap ?? null);
  const normalScale = sourceMaterial?.normalScale?.clone?.() ?? new THREE.Vector2(1, 1);

  const physical = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(DEFAULT_SKIN.color),
    emissive: new THREE.Color("#050706"),
    emissiveIntensity: 0.05,
    sheen: 0.18,
    sheenColor: new THREE.Color("#6f756d"),
    sheenRoughness: 0.48,
    roughness: DEFAULT_SKIN.roughness,
    metalness: DEFAULT_SKIN.metalness,
    clearcoat: DEFAULT_SKIN.clearcoat,
    clearcoatRoughness: DEFAULT_SKIN.clearcoatRoughness,
    envMapIntensity: DEFAULT_SKIN.envMapIntensity,
    normalMap,
    normalScale,
    aoMap,
    aoMapIntensity: sourceMaterial?.aoMapIntensity ?? 1,
    roughnessMap,
    metalnessMap,
    side: THREE.FrontSide,
  });

  const matcap = new THREE.MeshMatcapMaterial({
    matcap: matcapTexture,
    color: new THREE.Color("#ffffff"),
    normalMap,
    normalScale,
    transparent: true,
    opacity: 1,
    side: THREE.FrontSide,
  });

  return { physical, matcap };
}

function assignMaterial(mesh, materials) {
  mesh.material = materials.length === 1 ? materials[0] : materials;
}

const RifleModel = forwardRef(function RifleModel({ onMaterialReady, skinProps, ...props }, ref) {
  const { scene } = useGLTF(MODEL_URL);
  const matcapTextures = useTexture(MATCAP_URLS);
  const meshEntriesRef = useRef([]);

  const clone = useMemo(() => {
    meshEntriesRef.current = [];

    matcapTextures.forEach((texture) => {
      prepareTexture(texture, THREE.SRGBColorSpace);
    });

    const cloned = SkeletonUtils.clone(scene);

    cloned.traverse((child) => {
      if (!child.isMesh) return;

      const sourceMaterials = Array.isArray(child.material) ? child.material : [child.material];
      const pairs = sourceMaterials.map((material) => createMaterialPair(material, matcapTextures[0]));
      const physical = pairs.map((pair) => pair.physical);
      const matcap = pairs.map((pair) => pair.matcap);

      assignMaterial(child, physical);
      child.castShadow = false;
      child.receiveShadow = false;
      meshEntriesRef.current.push({ mesh: child, physical, matcap });
    });

    return cloned;
  }, [scene, matcapTextures]);

  useEffect(() => {
    const entries = meshEntriesRef.current;
    if (!entries.length) return;

    if (!skinProps) {
      entries.forEach(({ mesh, physical }) => assignMaterial(mesh, physical));
      return;
    }

    const skinIndex = SKINS.findIndex((s) => s.id === skinProps.id);
    const texture = matcapTextures[skinIndex >= 0 ? skinIndex : 0];
    prepareTexture(texture, THREE.SRGBColorSpace);

    entries.forEach(({ mesh, matcap }) => {
      assignMaterial(mesh, matcap);

      matcap.forEach((material) => {
        material.matcap = texture;
        material.needsUpdate = true;
        gsap.fromTo(material, { opacity: 0.35 }, { opacity: 1, duration: 0.45, ease: "power2.out" });
      });
    });
  }, [skinProps, matcapTextures]);

  const notified = useRef(false);
  useEffect(() => {
    if (notified.current || !onMaterialReady) return;
    const firstMaterial = meshEntriesRef.current[0]?.physical?.[0];
    if (firstMaterial) {
      onMaterialReady(firstMaterial);
      notified.current = true;
    }
  }, [clone, onMaterialReady]);

  return (
    <group ref={ref} {...props}>
      <primitive object={clone} />
    </group>
  );
});

useGLTF.preload(MODEL_URL);
MATCAP_URLS.forEach((url) => useTexture.preload(url));

export default RifleModel;

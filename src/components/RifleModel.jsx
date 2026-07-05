import { forwardRef, useEffect, useMemo, useRef } from "react";
import { useGLTF, useTexture } from "@react-three/drei";
import { SkeletonUtils } from "three-stdlib";
import * as THREE from "three";
import gsap from "gsap";
import { SKINS } from "../data/skins";

const MODEL_URL = "/models/sniper_rifle.glb";

const DEFAULT_SKIN = {
  color: "#242a26",
  roughness: 0.42,
  metalness: 0.74,
  clearcoat: 0.1,
  clearcoatRoughness: 0.34,
  envMapIntensity: 1.05,
};

const MATCAP_URLS = SKINS.map((skin) => skin.matcap);

function prepareTexture(texture, colorSpace) {
  if (!texture) return null;
  texture.flipY = false;
  if (colorSpace) texture.colorSpace = colorSpace;
  texture.needsUpdate = true;
  return texture;
}

function createGrainTexture() {
  const size = 128;
  const data = new Uint8Array(size * size);

  for (let i = 0; i < data.length; i += 1) {
    const grain = 120 + Math.random() * 70;
    data[i] = grain;
  }

  const texture = new THREE.DataTexture(data, size, size, THREE.RedFormat);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(18, 4);
  texture.needsUpdate = true;
  return texture;
}

function materialSettings(skin = DEFAULT_SKIN) {
  return {
    color: new THREE.Color(skin.color),
    roughness: skin.roughness,
    metalness: skin.metalness,
    clearcoat: skin.clearcoat,
    clearcoatRoughness: skin.clearcoatRoughness,
    envMapIntensity: skin.envMapIntensity,
  };
}

function applySettings(material, skin) {
  const settings = materialSettings(skin);
  material.color.copy(settings.color);
  material.roughness = settings.roughness;
  material.metalness = settings.metalness;
  material.clearcoat = settings.clearcoat;
  material.clearcoatRoughness = settings.clearcoatRoughness;
  material.envMapIntensity = settings.envMapIntensity;
  material.needsUpdate = true;
}

function createPhysicalMaterial(sourceMaterial, skin, grainTexture) {
  // The GLB color map is almost black, so using it as albedo crushes detail.
  // We keep the normal/AO maps for geometry definition and drive color through PBR values.
  prepareTexture(sourceMaterial?.map ?? null, THREE.SRGBColorSpace);
  const normalMap = prepareTexture(sourceMaterial?.normalMap ?? null);
  const aoMap = prepareTexture(sourceMaterial?.aoMap ?? null);
  const roughnessMap = prepareTexture(sourceMaterial?.roughnessMap ?? null);
  const normalScale = sourceMaterial?.normalScale?.clone?.() ?? new THREE.Vector2(1, 1);
  normalScale.multiplyScalar(1.45);

  return new THREE.MeshPhysicalMaterial({
    ...materialSettings(skin),
    emissive: new THREE.Color("#020302"),
    emissiveIntensity: 0.015,
    sheen: 0.08,
    sheenColor: new THREE.Color("#6d756e"),
    sheenRoughness: 0.7,
    normalMap,
    normalScale,
    aoMap,
    aoMapIntensity: 0.85,
    roughnessMap,
    bumpMap: grainTexture,
    bumpScale: 0.012,
    side: THREE.FrontSide,
  });
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
    matcapTextures.forEach((texture) => prepareTexture(texture, THREE.SRGBColorSpace));

    const grainTexture = createGrainTexture();
    const cloned = SkeletonUtils.clone(scene);

    cloned.traverse((child) => {
      if (!child.isMesh) return;

      const sourceMaterials = Array.isArray(child.material) ? child.material : [child.material];
      const factory = sourceMaterials.map((material) =>
        createPhysicalMaterial(material, DEFAULT_SKIN, grainTexture)
      );
      const coated = sourceMaterials.map((material) =>
        createPhysicalMaterial(material, SKINS[0], grainTexture)
      );

      assignMaterial(child, factory);
      child.castShadow = false;
      child.receiveShadow = false;
      meshEntriesRef.current.push({ mesh: child, factory, coated });
    });

    return cloned;
  }, [scene, matcapTextures]);

  useEffect(() => {
    const entries = meshEntriesRef.current;
    if (!entries.length) return;

    if (!skinProps) {
      entries.forEach(({ mesh, factory }) => assignMaterial(mesh, factory));
      return;
    }

    entries.forEach(({ mesh, coated }) => {
      assignMaterial(mesh, coated);
      coated.forEach((material) => {
        const startColor = material.color.clone();
        applySettings(material, skinProps);
        gsap.fromTo(
          material.color,
          { r: startColor.r, g: startColor.g, b: startColor.b },
          {
            r: material.color.r,
            g: material.color.g,
            b: material.color.b,
            duration: 0.45,
            ease: "power2.out",
          }
        );
      });
    });
  }, [skinProps]);

  const notified = useRef(false);
  useEffect(() => {
    if (notified.current || !onMaterialReady) return;
    const firstMaterial = meshEntriesRef.current[0]?.factory?.[0];
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

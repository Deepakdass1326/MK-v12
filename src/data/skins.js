/**
 * Every available rifle finish.
 *
 * `matcap` is the important field for the 3D model: RifleModel loads this
 * image as a MeshMatcapMaterial matcap, which is what actually changes the
 * gun's appearance in the viewer — the surface's normal map keeps reacting
 * to every groove/bevel/screw, so the finish reads as a real coating
 * instead of a flat colour fill.
 *
 * The remaining PBR-style fields (roughness, metalness, clearcoat, ...)
 * describe the same finish for anything that renders it with a full PBR
 * material instead of a matcap (kept for future use / non-matcap views).
 */
export const SKINS = [
  {
    id: "olive",
    name: "Olive Drab",
    tagline: "Woodland cerakote",
    matcap: "/604A30_DC9065_212C14_AC9C92.jpg",
    color: "#3a4228",
    roughness: 0.76,
    metalness: 0.30,
    clearcoat: 0.04,
    clearcoatRoughness: 0.8,
    envMapIntensity: 0.20,
  },
  {
    id: "desert",
    name: "Desert Tan",
    tagline: "Flat earth cerakote",
    matcap: "/613F04_D68C04_A45F04_1F0F04.jpg",
    color: "#7a5c28",
    roughness: 0.82,
    metalness: 0.22,
    clearcoat: 0.03,
    clearcoatRoughness: 0.9,
    envMapIntensity: 0.15,
  },
  {
    id: "arctic",
    name: "Arctic Sage",
    tagline: "Cold-weather cerakote",
    matcap: "/627D72_A6CAAA_202C28_B4D4B4.jpg",
    color: "#485f58",
    roughness: 0.70,
    metalness: 0.42,
    clearcoat: 0.10,
    clearcoatRoughness: 0.55,
    envMapIntensity: 0.25,
  },
  {
    id: "midnight",
    name: "Midnight Blue",
    tagline: "PVD stealth coating",
    matcap: "/617586_23304C_1B1E30_4988CF.jpg",
    color: "#18243a",
    roughness: 0.25,
    metalness: 0.90,
    clearcoat: 0.38,
    clearcoatRoughness: 0.12,
    envMapIntensity: 0.40,
  },
];

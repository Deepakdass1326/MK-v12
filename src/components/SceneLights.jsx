export default function SceneLights({ compact = false }) {
  const keyIntensity = compact ? 2.1 : 2.35;
  const fillIntensity = compact ? 1.15 : 1.05;
  const rimIntensity = compact ? 0.75 : 0.85;

  return (
    <>
      {/* Soft ambient base prevents the black rifle finish from crushing into the background. */}
      <ambientLight intensity={compact ? 0.45 : 0.55} color="#c9d2c4" />
      <hemisphereLight skyColor="#dce9ff" groundColor="#756242" intensity={compact ? 1.1 : 1.2} />

      <directionalLight
        position={[3.8, 6.5, 5.4]}
        intensity={keyIntensity}
        color="#fff1d8"
      />

      <directionalLight position={[-4.5, 2.4, 4.2]} intensity={fillIntensity} color="#b7d4ff" />
      <directionalLight position={[0.8, 4.5, -5.5]} intensity={rimIntensity} color="#f7c16d" />
      <pointLight position={[0, 1.6, 3.2]} intensity={compact ? 0.55 : 0.75} color="#ffffff" distance={9} />
    </>
  );
}

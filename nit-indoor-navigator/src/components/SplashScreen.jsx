export default function SplashScreen() {
  const base = import.meta.env.BASE_URL || '/';
  return (
    <div className="splash">
      <div className="splash-inner">
        <img src={`${base}logo.png`} alt="NIT Indoor Navigator" className="splash-logo-img" />
        <h1>NIT Indoor Navigator</h1>
        <p>Nehru Institute of Technology</p>
        <p className="splash-tagline">Smart Campus Wayfinding · Never Get Lost Again</p>
        <div className="splash-spinner" />
      </div>
      <span className="splash-ver">v2.0 · Multi-Floor Navigation System</span>
    </div>
  );
}

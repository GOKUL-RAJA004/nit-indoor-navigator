export default function SplashScreen() {
  return (
    <div className="splash">
      <div className="splash-inner">
        <img src="/logo.png" alt="QuickPath" className="splash-logo-img" />
        <h1>QuickPath</h1>
        <p>Nehru Institute of Technology</p>
        <p className="splash-tagline">Never get lost again. Start your journey now!</p>
        <div className="splash-spinner" />
      </div>
      <span className="splash-ver">v2.0 · Smart Campus Wayfinding</span>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { showInstallPrompt, isAppInstalled, isInstallAvailable } from '../utils/pwa';
import './InstallPWA.css';

const InstallPWA = () => {
  const [showInstallButton, setShowInstallButton] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    setIsInstalled(isAppInstalled());

    // Listen for install availability
    const handleInstallAvailable = () => {
      if (!isAppInstalled()) {
        setShowInstallButton(true);
      }
    };

    // Listen for app installed
    const handleInstalled = () => {
      setIsInstalled(true);
      setShowInstallButton(false);
    };

    window.addEventListener('pwa-install-available', handleInstallAvailable);
    window.addEventListener('pwa-installed', handleInstalled);

    // Check if install is already available
    if (isInstallAvailable() && !isAppInstalled()) {
      setShowInstallButton(true);
    }

    return () => {
      window.removeEventListener('pwa-install-available', handleInstallAvailable);
      window.removeEventListener('pwa-installed', handleInstalled);
    };
  }, []);

  const handleInstall = async () => {
    const accepted = await showInstallPrompt();
    if (accepted) {
      setShowInstallButton(false);
    }
  };

  const handleDismiss = () => {
    setShowInstallButton(false);
    // Store dismissal in localStorage
    localStorage.setItem('pwa-install-dismissed', Date.now().toString());
  };

  // Don't show if already installed or dismissed recently
  if (isInstalled || !showInstallButton) {
    return null;
  }

  // Check if dismissed in the last 7 days
  const dismissedTime = localStorage.getItem('pwa-install-dismissed');
  if (dismissedTime) {
    const daysSinceDismissed = (Date.now() - parseInt(dismissedTime)) / (1000 * 60 * 60 * 24);
    if (daysSinceDismissed < 7) {
      return null;
    }
  }

  return (
    <div className="install-pwa-banner">
      <div className="install-pwa-content">
        <div className="install-pwa-icon">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 12v7H5v-7H3v7c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7h-2zm-6 .67l2.59-2.58L17 11.5l-5 5-5-5 1.41-1.41L11 12.67V3h2z" />
          </svg>
        </div>
        <div className="install-pwa-text">
          <h3>Install MovieWeb</h3>
          <p>Install our app for a better experience with offline access</p>
        </div>
        <div className="install-pwa-actions">
          <button className="install-btn" onClick={handleInstall}>
            Install
          </button>
          <button className="dismiss-btn" onClick={handleDismiss}>
            ×
          </button>
        </div>
      </div>
    </div>
  );
};

export default InstallPWA;

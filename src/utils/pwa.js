/**
 * PWA Utility Functions
 * Handles service worker registration and PWA install prompts
 */

let deferredPrompt = null;

/**
 * Register Service Worker
 */
export const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
      });

      // Check for updates periodically
      setInterval(() => {
        registration.update();
      }, 1000 * 60 * 60); // Check every hour

      // Handle updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            // New service worker available
            
            // Optionally show update notification to user
            if (window.confirm('New version available! Reload to update?')) {
              window.location.reload();
            }
          }
        });
      });

      return registration;
    } catch (error) {
      console.error('[PWA] Service Worker registration failed:', error);
    }
  }
};

/**
 * Unregister Service Worker
 */
export const unregisterServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    const registration = await navigator.serviceWorker.ready;
    await registration.unregister();
  }
};

/**
 * Setup PWA Install Prompt
 */
export const setupInstallPrompt = () => {
  window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent the mini-infobar from appearing on mobile
    e.preventDefault();
    
    // Stash the event so it can be triggered later
    deferredPrompt = e;
    
    // Dispatch custom event to notify app
    window.dispatchEvent(new CustomEvent('pwa-install-available'));
  });

  window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    
    // Dispatch custom event
    window.dispatchEvent(new CustomEvent('pwa-installed'));
  });
};

/**
 * Show PWA Install Prompt
 * Returns true if prompt was shown, false otherwise
 */
export const showInstallPrompt = async () => {
  if (!deferredPrompt) {
    return false;
  }

  // Show the install prompt
  deferredPrompt.prompt();

  // Wait for the user's response
  const { outcome } = await deferredPrompt.userChoice;
  
  // Clear the deferred prompt
  deferredPrompt = null;
  
  return outcome === 'accepted';
};

/**
 * Check if app is installed
 */
export const isAppInstalled = () => {
  // Check if running in standalone mode
  return window.matchMedia('(display-mode: standalone)').matches ||
         window.navigator.standalone === true ||
         document.referrer.includes('android-app://');
};

/**
 * Check if install prompt is available
 */
export const isInstallAvailable = () => {
  return deferredPrompt !== null;
};

/**
 * Request notification permission
 */
export const requestNotificationPermission = async () => {
  if ('Notification' in window && 'serviceWorker' in navigator) {
    try {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    } catch (error) {
      console.error('[PWA] Notification permission error:', error);
      return false;
    }
  }
  return false;
};

/**
 * Subscribe to push notifications
 */
export const subscribeToPushNotifications = async () => {
  if ('serviceWorker' in navigator && 'PushManager' in window) {
    try {
      const registration = await navigator.serviceWorker.ready;
      
      // Check if already subscribed
      let subscription = await registration.pushManager.getSubscription();
      
      if (!subscription) {
        // Subscribe
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(
            // Your VAPID public key here
            'YOUR_VAPID_PUBLIC_KEY'
          ),
        });
        
        // Send subscription to your server
        // await sendSubscriptionToServer(subscription);
      }
      
      return subscription;
    } catch (error) {
      console.error('[PWA] Push subscription error:', error);
      return null;
    }
  }
  return null;
};

/**
 * Helper function to convert VAPID key
 */
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  
  return outputArray;
}

/**
 * Check for app updates
 */
export const checkForUpdates = async () => {
  if ('serviceWorker' in navigator) {
    const registration = await navigator.serviceWorker.ready;
    await registration.update();
  }
};

/**
 * Clear all caches
 */
export const clearAllCaches = async () => {
  if ('caches' in window) {
    const cacheNames = await caches.keys();
    await Promise.all(
      cacheNames.map(cacheName => caches.delete(cacheName))
    );
  }
};

// Initialize PWA
export const initPWA = () => {
  registerServiceWorker();
  setupInstallPrompt();
};

export default {
  registerServiceWorker,
  unregisterServiceWorker,
  setupInstallPrompt,
  showInstallPrompt,
  isAppInstalled,
  isInstallAvailable,
  requestNotificationPermission,
  subscribeToPushNotifications,
  checkForUpdates,
  clearAllCaches,
  initPWA,
};

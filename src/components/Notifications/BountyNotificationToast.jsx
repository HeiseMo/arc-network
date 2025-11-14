import { Target, X, MapPin, AlertTriangle } from 'lucide-react';
import { useBountyNotifications } from '../../hooks/useBountyNotifications';

export default function BountyNotificationToast() {
  const { notification, clearNotification } = useBountyNotifications();

  if (!notification) return null;

  return (
    <div className="fixed top-24 right-4 z-50 animate-slide-in">
      <div className="crt-frame p-4 max-w-sm shadow-crt relative">
        {/* Corner brackets */}
        <div className="absolute top-1 left-1 w-3 h-3 border-t-2 border-l-2 border-signal-orange"></div>
        <div className="absolute top-1 right-1 w-3 h-3 border-t-2 border-r-2 border-signal-orange"></div>
        <div className="absolute bottom-1 left-1 w-3 h-3 border-b-2 border-l-2 border-signal-orange"></div>
        <div className="absolute bottom-1 right-1 w-3 h-3 border-b-2 border-r-2 border-signal-orange"></div>

        {/* Close button */}
        <button
          onClick={clearNotification}
          className="absolute -top-2 -right-2 p-1.5 bg-rust border-2 border-rust-dark hover:bg-rust-dark transition-colors"
          style={{ clipPath: 'polygon(4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%, 0 4px)' }}
        >
          <X className="w-4 h-4 text-vintage-white" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-3">
          <div className="relative">
            <Target className="w-8 h-8 text-signal-orange signal-pulse" />
            <div className="absolute inset-0 bg-signal-orange/20 rounded-full blur-lg animate-flicker"></div>
          </div>
          <div>
            <h3 className="text-sm font-display font-bold text-signal-orange text-stencil uppercase">
              ⚠ NEW BOUNTY ALERT
            </h3>
            <p className="text-xs text-steel-light font-mono">
              TARGET ACQUIRED IN SESSION
            </p>
          </div>
        </div>

        {/* Bounty details */}
        <div className="space-y-2 mb-3">
          <div className="bg-denim-dark/50 p-2 border border-steel/30">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-signal-orange flex-shrink-0" />
              <div className="flex-1">
                <span className="text-xs text-steel-light uppercase block font-mono">Target</span>
                <span className="text-sm text-vintage-white font-display font-bold">
                  {notification.targetName}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-denim-dark/50 p-2 border border-steel/30">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-signal-orange flex-shrink-0" />
              <div className="flex-1">
                <span className="text-xs text-steel-light uppercase block font-mono">Location</span>
                <span className="text-sm text-vintage-white font-mono">
                  {notification.location}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="panel-divider mb-2" />
        <div className="flex items-center justify-between text-xs">
          <span className="text-steel font-mono">
            Reported by <span className="text-vintage-cream font-semibold">{notification.reporter}</span>
          </span>
          <span className="readout !text-xs !px-2 !py-0.5">
            LIVE
          </span>
        </div>

        {/* Pulsing indicator */}
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-20 h-0.5 bg-signal-orange shadow-signal animate-flicker"></div>
      </div>
    </div>
  );
}

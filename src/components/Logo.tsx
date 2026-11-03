import React, { useState } from 'react';
import { BRAND } from '../constants/portfolioData.ts';

interface LogoProps {
  className?: string;
  showSubtitle?: boolean;
  forceWordmark?: boolean;
}

/**
 * Dedicated HasDevs Logo Component.
 * - Points directly to dedicated asset path: /assets/logo/hasdevs-logo-trimmed.png
 * - Preserves native aspect ratio and transparency.
 * - Provides graceful fallback to clean text-based wordmark.
 * - Allows easy switching via forceWordmark prop or BRAND.logoMode.
 */
export const Logo: React.FC<LogoProps> = ({
  className = '',
  showSubtitle = false,
  forceWordmark = false,
}) => {
  const [imageFailed, setImageFailed] = useState(false);

  const shouldRenderWordmark =
    forceWordmark || BRAND.logoMode === 'wordmark' || imageFailed;

  const logoSrc =
    BRAND.logoMode === 'original'
      ? BRAND.originalLogoAssetPath
      : BRAND.logoAssetPath;

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {!shouldRenderWordmark ? (
        <div className="relative flex items-center justify-center">
          <img
            src={logoSrc}
            alt="HasDevs Logo"
            className="h-8 sm:h-9 w-auto max-w-[130px] sm:max-w-[170px] object-contain drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]"
            onError={() => setImageFailed(true)}
            loading="eager"
          />
        </div>
      ) : (
        <div className="flex items-center gap-1.5">
          <span className="font-heading font-bold text-xl sm:text-2xl text-white tracking-tight">
            Has<span className="text-[#22c55e]">Devs</span>
          </span>
        </div>
      )}

      {showSubtitle && (
        <div className="hidden sm:flex flex-col border-l border-[#242424] pl-3 py-0.5">
          <span className="text-xs font-semibold text-white tracking-tight font-heading">
            Hashir Khan
          </span>
          <span className="text-[10px] text-[#737373] tracking-wider uppercase font-mono">
            AI &amp; Web Developer
          </span>
        </div>
      )}
    </div>
  );
};

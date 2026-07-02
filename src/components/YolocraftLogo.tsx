import React from 'react';

interface YolocraftLogoProps {
  className?: string;
}

export default function YolocraftLogo({ className = 'w-8 h-8' }: YolocraftLogoProps) {
  return (
    <svg 
      className={`${className} transition-transform hover:rotate-45 duration-300`} 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 512 512"
      id="yolocraft-logo-svg"
    >
      {/* Corner Brackets (Lime Green Target) */}
      <path d="M 115 70 L 70 70 L 70 115" fill="none" stroke="#99e324" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 397 70 L 442 70 L 442 115" fill="none" stroke="#99e324" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 70 397 L 70 442 L 115 442" fill="none" stroke="#99e324" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 442 397 L 442 442 L 397 442" fill="none" stroke="#99e324" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" />

      {/* Voxel Grid Face (Minecraft Creeper Scan) */}
      {/* Row 1 */}
      <rect x="198" y="98" width="36" height="36" rx="6" fill="#1b7a2e" />
      <rect x="238" y="98" width="36" height="36" rx="6" fill="#1b7a2e" />
      <rect x="278" y="98" width="36" height="36" rx="6" fill="#1b7a2e" />

      {/* Row 2 */}
      <rect x="158" y="138" width="36" height="36" rx="6" fill="#1b7a2e" />
      <rect x="198" y="138" width="36" height="36" rx="6" fill="#1b7a2e" />
      <rect x="238" y="138" width="36" height="36" rx="6" fill="#1b7a2e" />
      <rect x="278" y="138" width="36" height="36" rx="6" fill="#1b7a2e" />
      <rect x="318" y="138" width="36" height="36" rx="6" fill="#1b7a2e" />

      {/* Row 3 (Eyes row) */}
      <rect x="118" y="178" width="36" height="36" rx="6" fill="#1b7a2e" />
      <rect x="158" y="178" width="36" height="36" rx="6" fill="#1b7a2e" />
      <rect x="198" y="178" width="36" height="36" rx="6" fill="#99e324" /> {/* Left Eye (Light Green) */}
      <rect x="238" y="178" width="36" height="36" rx="6" fill="#1b7a2e" />
      <rect x="278" y="178" width="36" height="36" rx="6" fill="#99e324" /> {/* Right Eye (Light Green) */}
      <rect x="318" y="178" width="36" height="36" rx="6" fill="#1b7a2e" />
      <rect x="358" y="178" width="36" height="36" rx="6" fill="#1b7a2e" />

      {/* Row 4 */}
      <rect x="78" y="218" width="36" height="36" rx="6" fill="#1b7a2e" />
      <rect x="118" y="218" width="36" height="36" rx="6" fill="#1b7a2e" />
      <rect x="158" y="218" width="36" height="36" rx="6" fill="#1b7a2e" />
      <rect x="198" y="218" width="36" height="36" rx="6" fill="#1b7a2e" />
      <rect x="238" y="218" width="36" height="36" rx="6" fill="#1b7a2e" />
      <rect x="278" y="218" width="36" height="36" rx="6" fill="#1b7a2e" />
      <rect x="318" y="218" width="36" height="36" rx="6" fill="#1b7a2e" />
      <rect x="358" y="218" width="36" height="36" rx="6" fill="#1b7a2e" />
      <rect x="398" y="218" width="36" height="36" rx="6" fill="#1b7a2e" />

      {/* Row 5 */}
      <rect x="78" y="258" width="36" height="36" rx="6" fill="#1b7a2e" />
      <rect x="118" y="258" width="36" height="36" rx="6" fill="#1b7a2e" />
      <rect x="158" y="258" width="36" height="36" rx="6" fill="#1b7a2e" />
      <rect x="198" y="258" width="36" height="36" rx="6" fill="#1b7a2e" />
      <rect x="238" y="258" width="36" height="36" rx="6" fill="#1b7a2e" />
      <rect x="278" y="258" width="36" height="36" rx="6" fill="#1b7a2e" />
      <rect x="318" y="258" width="36" height="36" rx="6" fill="#1b7a2e" />
      <rect x="358" y="258" width="36" height="36" rx="6" fill="#1b7a2e" />
      <rect x="398" y="258" width="36" height="36" rx="6" fill="#1b7a2e" />

      {/* Row 6 */}
      <rect x="118" y="298" width="36" height="36" rx="6" fill="#1b7a2e" />
      <rect x="158" y="298" width="36" height="36" rx="6" fill="#1b7a2e" />
      <rect x="198" y="298" width="36" height="36" rx="6" fill="#1b7a2e" />
      <rect x="238" y="298" width="36" height="36" rx="6" fill="#1b7a2e" />
      <rect x="278" y="298" width="36" height="36" rx="6" fill="#1b7a2e" />
      <rect x="318" y="298" width="36" height="36" rx="6" fill="#1b7a2e" />
      <rect x="358" y="298" width="36" height="36" rx="6" fill="#1b7a2e" />

      {/* Row 7 */}
      <rect x="158" y="338" width="36" height="36" rx="6" fill="#1b7a2e" />
      <rect x="198" y="338" width="36" height="36" rx="6" fill="#1b7a2e" />
      <rect x="238" y="338" width="36" height="36" rx="6" fill="#1b7a2e" />
      <rect x="278" y="338" width="36" height="36" rx="6" fill="#1b7a2e" />
      <rect x="318" y="338" width="36" height="36" rx="6" fill="#1b7a2e" />

      {/* Row 8 */}
      <rect x="198" y="378" width="36" height="36" rx="6" fill="#1b7a2e" />
      <rect x="238" y="378" width="36" height="36" rx="6" fill="#1b7a2e" />
      <rect x="278" y="378" width="36" height="36" rx="6" fill="#1b7a2e" />
    </svg>
  );
}

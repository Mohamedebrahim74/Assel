import cicLogo from '../assets/cic-logo.jpg';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeMap: Record<NonNullable<LogoProps['size']>, string> = {
  sm: 'h-10 w-10',
  md: 'h-16 w-16',
  lg: 'h-24 w-24',
};

/**
 * Renders the official CIC logo exactly as provided — object-contain keeps
 * it undistorted and uncropped regardless of the frame size around it.
 * Replace src/assets/cic-logo.jpg with a higher-resolution file at any time;
 * no code changes are required.
 */
export function Logo({ size = 'md', className = '' }: LogoProps) {
  return (
    <div
      className={`flex items-center justify-center rounded-full bg-parchment-50 p-2 shadow-ring ${sizeMap[size]} ${className}`}
    >
      <img
        src={cicLogo}
        alt="CIC official logo"
        className="h-full w-full object-contain"
        draggable={false}
      />
    </div>
  );
}

type BrandLogoSize = "sm" | "md" | "lg" | "custom";

type BrandLogoProps = {
  size?: BrandLogoSize;
  alt?: string;
  className?: string;
  fetchPriority?: "high" | "low" | "auto";
  loading?: "eager" | "lazy";
};

const sizeClasses: Record<BrandLogoSize, string> = {
  sm: "h-10 w-10",
  md: "h-12 w-12",
  lg: "h-24 w-24",
  custom: "",
};

export const BRAND_LOGO_SRC = `${import.meta.env.BASE_URL}brand/rv-logo.webp`;
export const BRAND_LOGO_INTRO_SRC = `${import.meta.env.BASE_URL}brand/rv-logo-intro.webp`;

export default function BrandLogo({
  size = "md",
  alt = "Reyhan Irza Alvano RV logo",
  className = "",
  fetchPriority,
  loading,
}: BrandLogoProps) {
  return (
    <img
      src={BRAND_LOGO_SRC}
      alt={alt}
      width={640}
      height={640}
      className={`block shrink-0 object-contain ${sizeClasses[size]} ${className}`.trim()}
      decoding="async"
      draggable={false}
      fetchPriority={fetchPriority}
      loading={loading}
    />
  );
}

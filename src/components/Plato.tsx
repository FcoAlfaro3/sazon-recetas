import Image from "next/image";

type Props = {
  src: string;
  alt: string;
  /** Valor del atributo sizes de next/image */
  sizes: string;
  priority?: boolean;
  className?: string;
};

/** Foto presentada como un plato visto desde arriba: círculo con borde blanco. */
export function Plato({ src, alt, sizes, priority = false, className = "" }: Props) {
  return (
    <div
      className={`relative aspect-square rounded-full bg-plato p-[5%] ring-1 ring-borde ${className}`}
    >
      <div className="relative size-full overflow-hidden rounded-full bg-niebla-2">
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover"
        />
      </div>
    </div>
  );
}

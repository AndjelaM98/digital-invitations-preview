import amMonogram from "./assets/am-monogram-clean.png";

type AmMonogramProps = {
  className?: string;
};

function AmMonogram({ className }: AmMonogramProps) {
  return (
    <span
      className={className}
      style={{
        WebkitMaskImage: `url(${amMonogram})`,
        maskImage: `url(${amMonogram})`,
      }}
      aria-hidden="true"
    />
  );
}

export default AmMonogram;

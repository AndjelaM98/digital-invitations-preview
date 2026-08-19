type LineArtProps = {
  src: string;
  className?: string;
};

function LineArt({ src, className }: LineArtProps) {
  return (
    <img
      src={src}
      alt=""
      className={["qb-art", className].filter(Boolean).join(" ")}
      draggable={false}
    />
  );
}

export default LineArt;

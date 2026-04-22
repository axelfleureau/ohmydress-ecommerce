const BrandIcon = ({ fill = "#0d0d0d", width = 600, height = 220 }) => {
  return (
    <img
      src="/brand/ohmydress-logo.png"
      width={width}
      height={height}
      alt="OhMyDress"
      style={{
        width: "100%",
        height: "100%",
        objectFit: "contain",
        filter:
          fill && fill.toLowerCase() !== "#0d0d0d" && fill.toLowerCase() !== "#0f0f0f"
            ? "invert(1)"
            : "none",
      }}
    />
  );
};

export default BrandIcon;

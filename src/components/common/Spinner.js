const Spinner = ({ size = 20 }) => (
  <span
    style={{
      width: size,
      height: size,
      border: `${Math.max(2, Math.round(size / 7))}px solid #e0e0e0`,
      borderTopColor: "#555",
      borderRadius: "50%",
      display: "inline-block",
      animation: "spin 0.8s linear infinite",
      flexShrink: 0,
    }}
  />
);

export default Spinner;

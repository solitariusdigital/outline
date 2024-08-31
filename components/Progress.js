export default function Progress(props) {
  const { color, completed } = props;

  const progress = {
    height: 5,
    width: "80%",
    borderRadius: 50,
  };

  const filler = {
    height: "100%",
    width: `${completed}%`,
    backgroundColor: color,
    transition: "width 1s ease-in-out",
    borderRadius: "inherit",
  };

  return (
    <div style={progress}>
      <div style={filler}></div>
    </div>
  );
}

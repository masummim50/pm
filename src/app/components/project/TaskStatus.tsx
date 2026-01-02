const TaskStatus = ({ status }: { status: 'ideal' | 'running' | 'paused' | 'complete' }) => {
  const statusColors = {
    ideal: "#4A90E2", // Light Green - Represents an ideal status
    running: "#50E3C2", // Turquoise - Represents a running status
    paused: "#FFC107", // Orange - Represents a paused status
    complete: "#7ED321", // Blue - Represents a complete status
  };
  return (
    <span
      style={{
        background: statusColors[status],
        padding: "0px 10px",
        display: "block",
        color: "white",
        fontSize: 14,
        borderRadius: "5px",
      }}
    >
      {status}
    </span>
  );
};

export default TaskStatus;

import { OrnateFrame } from "./OrnateFrame";
import memoriesData from "../content/memories.json";

interface Props {
  onFrameClick?: (slot: number) => void;
}

const roomOrder = ["firsts", "adventures", "celebrations", "everyday"];

export function FrameWall3x3({ onFrameClick }: Props) {
  const frameTypes: ("rect" | "oval")[] = ["rect", "oval", "rect"];
  
  const organizedMemories = roomOrder.flatMap((roomId) =>
    memoriesData.filter((m) => m.roomId === roomId).slice(0, 3)
  );

  return (
    <div className="frame-wall-3x3">
      {organizedMemories.map((memory, index) => (
        <OrnateFrame
          key={memory.id}
          image={memory.image}
          frameType={frameTypes[index % 3]}
          delay={0.1 * index}
          onClick={() => onFrameClick?.(index + 1)}
          size="small"
        />
      ))}
    </div>
  );
}

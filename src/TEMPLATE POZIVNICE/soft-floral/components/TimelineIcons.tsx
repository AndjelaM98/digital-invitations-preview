import cameraIcon from "../assets/timeline/camera.png";
import champagneIcon from "../assets/timeline/champagne.png";
import dinnerIcon from "../assets/timeline/dinner.png";
import moonIcon from "../assets/timeline/moon.png";
import partyIcon from "../assets/timeline/party.png";
import ringsIcon from "../assets/timeline/rings.png";

const iconMap = {
  rings: ringsIcon,
  champagne: champagneIcon,
  camera: cameraIcon,
  dinner: dinnerIcon,
  party: partyIcon,
  moon: moonIcon,
} as const;

const iconBoostClass: Partial<Record<keyof typeof iconMap, string>> = {
  rings: "sf-timeline__icon--boost-rings",
  camera: "sf-timeline__icon--boost-camera",
  party: "sf-timeline__icon--boost-party",
};

type TimelineIconProps = {
  name?: string;
  className?: string;
};

export function TimelineIcon({ name, className }: TimelineIconProps) {
  const iconKey = name as keyof typeof iconMap;
  const src = iconMap[iconKey] ?? ringsIcon;
  const boostClass = iconBoostClass[iconKey] ?? "";

  return (
    <img
      src={src}
      alt=""
      className={[className, boostClass].filter(Boolean).join(" ")}
      draggable={false}
      aria-hidden="true"
    />
  );
}

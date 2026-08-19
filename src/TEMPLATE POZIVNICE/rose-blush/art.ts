import bird from "./assets/art/bird.png";
import bouquet from "./assets/art/bouquet.png";
import bowEnd from "./assets/art/bow-end.png";
import bowSoft from "./assets/art/bow-soft.png";
import bowWide from "./assets/art/bow-wide.png";
import bow from "./assets/art/bow.png";
import butterflyAlt from "./assets/art/butterfly-alt.png";
import butterfly from "./assets/art/butterfly.png";
import camera from "./assets/art/camera.png";
import car from "./assets/art/car.png";
import cocktails from "./assets/art/cocktails.png";
import couple from "./assets/art/couple.png";
import dancing from "./assets/art/dancing.png";
import envelopeTulips from "./assets/art/envelope-tulips.png";
import envelope from "./assets/art/envelope.png";
import eucalyptus from "./assets/art/eucalyptus.png";
import floralCorner from "./assets/art/floral-corner.png";
import flourish from "./assets/art/flourish.png";
import flower from "./assets/art/flower.png";
import glasses from "./assets/art/glasses.png";
import lavender from "./assets/art/lavender.png";
import poppy from "./assets/art/poppy.png";
import rings from "./assets/art/rings.png";
import spray from "./assets/art/spray.png";
import womanFloral from "./assets/art/woman-floral.png";

export const blushArt = {
  bird,
  bouquet,
  bow,
  bowEnd,
  bowSoft,
  bowWide,
  butterfly,
  butterflyAlt,
  camera,
  car,
  cocktails,
  couple,
  dancing,
  envelope,
  envelopeTulips,
  eucalyptus,
  floralCorner,
  flourish,
  flower,
  glasses,
  lavender,
  poppy,
  rings,
  spray,
  womanFloral,
} as const;

export type BlushArtKey = keyof typeof blushArt;

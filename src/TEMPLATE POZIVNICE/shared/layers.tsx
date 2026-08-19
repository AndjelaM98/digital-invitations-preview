import {
  motion,
  type HTMLMotionProps,
  type MotionProps,
} from "framer-motion";
import type { CSSProperties, ReactNode } from "react";

import type { LayerPlacement, TemplateAsset, TemplateLayer } from "./types";
import { useIsDesktopInvitation } from "./useIsDesktopInvitation";
import { invitationMinTapPx } from "./viewport";
import "./layers.css";

function toCssLength(value: string | number | undefined): string | undefined {
  if (value === undefined) return undefined;
  return typeof value === "number" ? `${value}%` : value;
}

/** Convert config placement into absolute CSS for a stage layer. */
export function placementToStyle(placement: LayerPlacement): CSSProperties {
  return {
    position: "absolute",
    top: toCssLength(placement.top),
    left: toCssLength(placement.left),
    right: toCssLength(placement.right),
    bottom: toCssLength(placement.bottom),
    width: toCssLength(placement.width),
    height: toCssLength(placement.height),
    transformOrigin: placement.transformOrigin,
    zIndex: placement.zIndex,
  };
}

/** Merge mobile base with optional desktop refinements. */
export function resolveLayerPlacement(
  layer: Pick<TemplateLayer, "placement" | "placementDesktop">,
  isDesktop: boolean,
): LayerPlacement {
  if (!isDesktop || !layer.placementDesktop) return layer.placement;
  return { ...layer.placement, ...layer.placementDesktop };
}

type LayerStageProps = {
  className?: string;
  children: ReactNode;
  /** Aspect / framing wrapper; layers position inside this box */
  style?: CSSProperties;
};

/**
 * Positioning root for layered Canva assets.
 * Sized for the phone viewport first; scale up on larger screens via CSS.
 */
export function LayerStage({ className = "", children, style }: LayerStageProps) {
  return (
    <div
      className={`invitation-layer-stage ${className}`.trim()}
      style={style}
    >
      {children}
    </div>
  );
}

type AssetLayerProps = {
  asset: TemplateAsset;
  layer: TemplateLayer;
  className?: string;
  motionProps?: MotionProps;
} & Omit<HTMLMotionProps<"div">, "children" | "style" | "className">;

/**
 * One graphic layer: mobile placement by default, desktop overrides when set.
 */
export function AssetLayer({
  asset,
  layer,
  className = "",
  motionProps,
  ...rest
}: AssetLayerProps) {
  const isDesktop = useIsDesktopInvitation();
  const placement = resolveLayerPlacement(layer, isDesktop);
  const interactiveClass = layer.interactive
    ? "invitation-asset-layer--interactive"
    : "";

  return (
    <motion.div
      className={`invitation-asset-layer ${interactiveClass} ${className}`.trim()}
      style={placementToStyle(placement)}
      data-layer-id={layer.id}
      data-asset-id={asset.id}
      data-role={asset.role}
      {...motionProps}
      {...rest}
    >
      <img
        src={asset.src}
        alt={asset.alt ?? ""}
        draggable={false}
        style={{
          display: "block",
          width: "100%",
          height: "100%",
          objectFit: "contain",
          pointerEvents: layer.interactive ? "auto" : "none",
          userSelect: "none",
          minWidth: layer.interactive ? invitationMinTapPx : undefined,
          minHeight: layer.interactive ? invitationMinTapPx : undefined,
        }}
      />
    </motion.div>
  );
}

type TextLayerProps = {
  className?: string;
  placement?: LayerPlacement;
  placementDesktop?: Partial<LayerPlacement>;
  children: ReactNode;
  motionProps?: MotionProps;
} & Omit<HTMLMotionProps<"div">, "children" | "style" | "className">;

/** Dynamic copy/photo slot positioned like a graphic layer (mobile-first). */
export function TextLayer({
  className = "",
  placement,
  placementDesktop,
  children,
  motionProps,
  ...rest
}: TextLayerProps) {
  const isDesktop = useIsDesktopInvitation();
  const resolved =
    placement &&
    resolveLayerPlacement({ placement, placementDesktop }, isDesktop);

  return (
    <motion.div
      className={`invitation-text-layer ${className}`.trim()}
      style={resolved ? placementToStyle(resolved) : undefined}
      {...motionProps}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

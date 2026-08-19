import type { ComponentType } from "react";

import EnvelopeRomance, {
  ENVELOPE_ROMANCE_ID,
  envelopeRomanceMeta,
} from "./envelope-romance";
import LetoLjubavi, { LETO_LJUBAVI_ID, letoLjubaviMeta } from "./leto-ljubavi";
import PearlElegance, {
  PEARL_ELEGANCE_ID,
  pearlEleganceMeta,
} from "./pearl-elegance";
import type {
  InvitationContent,
  InvitationTemplateDefinition,
} from "./shared/types";

type InvitationTemplateModule = {
  meta: InvitationTemplateDefinition;
  Component: ComponentType<{ content?: InvitationContent }>;
};

/**
 * Lista svih template pozivnica.
 * Nova pozivnica = novi folder + jedan unos ovde.
 */
export const invitationTemplateRegistry: Record<
  string,
  InvitationTemplateModule
> = {
  [ENVELOPE_ROMANCE_ID]: {
    meta: {
      id: envelopeRomanceMeta.id,
      title: envelopeRomanceMeta.title,
      sections: [...envelopeRomanceMeta.sections],
    },
    Component: EnvelopeRomance,
  },
  [LETO_LJUBAVI_ID]: {
    meta: {
      id: letoLjubaviMeta.id,
      title: letoLjubaviMeta.title,
      sections: [...letoLjubaviMeta.sections],
    },
    Component: LetoLjubavi,
  },
  [PEARL_ELEGANCE_ID]: {
    meta: {
      id: pearlEleganceMeta.id,
      title: pearlEleganceMeta.title,
      sections: [...pearlEleganceMeta.sections],
    },
    Component: PearlElegance,
  },
};

export function getInvitationTemplate(id: string) {
  return invitationTemplateRegistry[id];
}

export function listInvitationTemplates() {
  return Object.values(invitationTemplateRegistry).map((entry) => entry.meta);
}

export type {
  InvitationContent,
  InvitationTemplateConfig,
  InvitationTemplateDefinition,
  TemplateAsset,
  TemplateLayer,
} from "./shared/types";
export { AssetLayer, LayerStage, TextLayer } from "./shared/layers";
export { invitationBreakpoints, invitationMinTapPx } from "./shared/viewport";
export { EnvelopeRomance, ENVELOPE_ROMANCE_ID };
export { LetoLjubavi, LETO_LJUBAVI_ID };
export { PearlElegance, PEARL_ELEGANCE_ID };

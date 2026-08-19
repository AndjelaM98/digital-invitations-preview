import RsvpCoupleDashboard from "../../Rsvp/RsvpCoupleDashboard";
import type { InvitationId } from "../../../types/invitationPlatform";

type StepGostiProps = {
  invitationId: InvitationId | null;
  refreshKey: number;
};

function StepGosti({ invitationId, refreshKey }: StepGostiProps) {
  return (
    <div className="studio-step">
      <header className="studio-step__header">
        <p className="studio-step__eyebrow">Šesti korak</p>
        <h3 className="studio-step__title">RSVP za mladence</h3>
        <p className="studio-step__lede">
          Gost popuni formu na pozivnici → odgovor se sačuva → ovde vidite
          brojke i listu. Isti ugovor kasnije ide na bazu i API.
        </p>
      </header>

      <RsvpCoupleDashboard
        invitationId={invitationId}
        refreshKey={refreshKey}
      />
    </div>
  );
}

export default StepGosti;

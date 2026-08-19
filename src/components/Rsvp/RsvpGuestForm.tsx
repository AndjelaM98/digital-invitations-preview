import { useEffect, useState, type FormEvent } from "react";

import { invitationPlatform } from "../../platform/client";
import type {
  CreateRsvpInput,
  InvitationId,
  RsvpAttendance,
} from "../../types/invitationPlatform";

type RsvpGuestFormProps = {
  invitationId: InvitationId;
  deadlineLabel?: string;
  onSubmitted?: () => void;
};

type FormState = {
  guestName: string;
  attendance: RsvpAttendance | "";
  partySize: number;
  companionNames: string;
};

const initialForm: FormState = {
  guestName: "",
  attendance: "",
  partySize: 1,
  companionNames: "",
};

function RsvpGuestForm({
  invitationId,
  deadlineLabel,
  onSubmitted,
}: RsvpGuestFormProps) {
  const [form, setForm] = useState<FormState>(initialForm);
  const [status, setStatus] = useState<"idle" | "saving" | "done" | "error">(
    "idle",
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setForm(initialForm);
    setStatus("idle");
    setError(null);
  }, [invitationId]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!form.attendance) {
      setError("Izaberite da li dolazite.");
      setStatus("error");
      return;
    }

    const payload: CreateRsvpInput = {
      guestName: form.guestName,
      attendance: form.attendance,
      partySize: form.attendance === "yes" ? form.partySize : 1,
      companionNames:
        form.attendance === "yes" ? form.companionNames : undefined,
    };

    setStatus("saving");
    setError(null);

    try {
      await invitationPlatform.submitRsvp(invitationId, payload);
      setStatus("done");
      setForm(initialForm);
      onSubmitted?.();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Greška pri čuvanju.");
    }
  };

  if (status === "done") {
    return (
      <div className="rsvp-form rsvp-form--done">
        <p className="rsvp-form__thanks">Hvala, odgovor je sačuvan.</p>
        <button
          type="button"
          className="rsvp-form__again"
          onClick={() => setStatus("idle")}
        >
          Pošalji još jedan odgovor
        </button>
      </div>
    );
  }

  return (
    <form className="rsvp-form" onSubmit={handleSubmit} noValidate>
      {deadlineLabel ? (
        <p className="rsvp-form__deadline">{deadlineLabel}</p>
      ) : null}

      <label className="rsvp-form__field">
        <span>Ime i prezime</span>
        <input
          type="text"
          required
          value={form.guestName}
          onChange={(event) =>
            setForm((prev) => ({ ...prev, guestName: event.target.value }))
          }
          placeholder="Vaše ime"
          autoComplete="name"
        />
      </label>

      <fieldset className="rsvp-form__attendance">
        <legend>Da li dolazite na našu svadbu?</legend>
        <label>
          <input
            type="radio"
            name={`attendance-${invitationId}`}
            checked={form.attendance === "yes"}
            onChange={() =>
              setForm((prev) => ({ ...prev, attendance: "yes" }))
            }
          />
          Da
        </label>
        <label>
          <input
            type="radio"
            name={`attendance-${invitationId}`}
            checked={form.attendance === "no"}
            onChange={() =>
              setForm((prev) => ({
                ...prev,
                attendance: "no",
                partySize: 1,
                companionNames: "",
              }))
            }
          />
          Ne
        </label>
      </fieldset>

      {form.attendance === "yes" ? (
        <>
          <label className="rsvp-form__field">
            <span>Koliko vas dolazi?</span>
            <select
              value={form.partySize}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  partySize: Number(event.target.value),
                }))
              }
            >
              {Array.from({ length: 8 }, (_, index) => index + 1).map(
                (size) => (
                  <option key={size} value={size}>
                    {size === 1 ? "Samo ja" : `+${size - 1} (ukupno ${size})`}
                  </option>
                ),
              )}
            </select>
          </label>

          {form.partySize > 1 ? (
            <label className="rsvp-form__field">
              <span>Ko sve dolazi sa tobom?</span>
              <input
                type="text"
                value={form.companionNames}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    companionNames: event.target.value,
                  }))
                }
                placeholder="Imena pratnje"
              />
            </label>
          ) : null}
        </>
      ) : null}

      {error ? <p className="rsvp-form__error">{error}</p> : null}

      <button
        type="submit"
        className="rsvp-form__submit"
        disabled={status === "saving"}
      >
        {status === "saving" ? "Čuvam…" : "Potvrdi"}
      </button>
    </form>
  );
}

export default RsvpGuestForm;

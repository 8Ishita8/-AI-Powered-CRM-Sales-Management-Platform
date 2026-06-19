export const LeadStages = {
  NEW_LEAD: "NEW_LEAD",
  QUALIFIED: "QUALIFIED",
  PROPOSAL: "PROPOSAL",
  NEGOTIATION: "NEGOTIATION",
  WON: "WON",
  LOST: "LOST"
} as const;

export type LeadStage = typeof LeadStages[keyof typeof LeadStages];

export const VALID_TRANSITIONS: Record<LeadStage, LeadStage[]> = {
  [LeadStages.NEW_LEAD]: [LeadStages.QUALIFIED],
  [LeadStages.QUALIFIED]: [LeadStages.PROPOSAL],
  [LeadStages.PROPOSAL]: [LeadStages.NEGOTIATION],
  [LeadStages.NEGOTIATION]: [LeadStages.WON, LeadStages.LOST],
  [LeadStages.WON]: [],
  [LeadStages.LOST]: []
};

export const isValidStageTransition = (from: LeadStage, to: LeadStage): boolean => {
  if (from === to) return true; // Transitioning to the same stage is technically no-op or valid, though we might not log it.
  const allowed = VALID_TRANSITIONS[from];
  return allowed ? allowed.includes(to) : false;
};

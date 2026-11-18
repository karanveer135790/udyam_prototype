// A changed identity or quote must never retain a previous demo payment/order.
export function invalidateVerification(state) {
  state.verified = false;
  state.kyc = null;
  state.paid = false;
  state.order = null;
  state.progress = 0;
}

// Completion is evidence of finished work, not the currently selected tab.
export function completedSteps(state) {
  return [Boolean(state.recommendation || state.accepted), Boolean(state.accepted),
    Boolean(state.consent && state.verified), Boolean(state.order && state.progress === 4)];
}

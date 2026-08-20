/** Global stacking order — keep modal above chatbot, toast above modal */
export const zIndex = {
  footer: 100,
  floatingBar: 200,
  tooltip: 400,
  chatbot: 1100,
  modal: 1300,
  toast: 1400,
} as const

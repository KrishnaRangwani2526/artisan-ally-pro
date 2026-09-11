# Bilingual onboarding

## Changes
- Keep English as the main text on every onboarding screen after language selection.
- Show the selected language directly beneath titles, instructions, field labels, choices, buttons, success messages, and summary labels.
- Add onboarding translations for every supported language: Hindi, Punjabi, Marathi, Gujarati, Bengali, Tamil, Telugu, and Kannada.
- Use English only when English is selected.
- Preserve all existing onboarding behavior, saved values, and navigation.

## Technical details
- Extend the existing translation dictionary with all onboarding phrases.
- Use the temporary onboarding language selection immediately, rather than waiting until setup is finished.
- Verify the flow in a mobile-sized browser with a non-English language selected.

# Proposed Maintenance Tasks

## Typo Fix
- **Issue**: The Abu Dhabi itinerary description references "House of the Artisans", but the attraction's proper name is "House of Artisans" without the definite article.
- **Location**: `index.html`, line 395.
- **Task**: Update the itinerary text to use the correct attraction name so that on-page copy matches real-world branding.

## Bug Fix
- **Issue**: The guest count chart data keeps Day 5 at 13 guests even though the adjacent narrative states that one guest departs, leaving 12 guests for that day.
- **Location**: `index.html`, line 360.
- **Task**: Reduce the Day 5 value in the guest count dataset from 13 to 12 (and audit any related totals) so the visualization aligns with the described departures.

## Documentation Discrepancy
- **Issue**: `README.md` currently contains meta-instructions for crafting a README rather than documenting this itinerary visualization project, leaving contributors without real setup or usage guidance.
- **Location**: `README.md`, entire file.
- **Task**: Replace the instruction-oriented content with an actual project README that covers purpose, setup, usage, and contribution/help information.

## Test Improvement
- **Issue**: There are no automated checks ensuring utility functions like `wrapLabel` respect the intended maximum label width before rendering chart labels.
- **Location**: `index.html`, lines 321-332 (function definition).
- **Task**: Introduce a lightweight JavaScript test (e.g., Jest/Vitest) that imports `wrapLabel` and verifies it wraps labels longer than the specified width, preventing regressions that would break chart readability.

---
name: road-safety-rules
description: "Use when: adding a road safety feature to a website or app that presents road safety types, traffic rules, and regulations in a clear section or dashboard view. Best for React, React Native, or Expo-based projects that need a new informational feature without breaking existing navigation."
---

# Road Safety Rules & Regulations Feature

## Use this skill when
- You want to add a new feature for road safety categories such as speed limits, helmet rules, seatbelt rules, lane discipline, or pedestrian safety.
- You need to show rules and regulations in a website or mobile app screen.
- You want to add a new section to an existing dashboard, home page, or safety portal.

## Goal
Create a reusable, user-friendly section that explains road safety types and their corresponding rules and regulations in a clean layout.

## Workflow
1. Review the existing app structure and identify the best place for the new feature.
   - Prefer the home page, dashboard, or a dedicated safety information screen.
   - Keep the feature visible but not disruptive to the main flow.

2. Define the content model.
   - Group road safety topics into categories such as speeding, helmets, seat belts, signal compliance, pedestrian safety, and drink-driving rules.
   - For each category, include a short title, explanation, and the relevant regulation or rule.

3. Choose the presentation style.
   - Use cards for a simple overview.
   - Use expandable sections or accordions if the content is long.
   - Use tabs or filters if you want users to browse by type.

4. Implement the feature in the current UI.
   - Add a local data array or content object first for fast iteration.
   - Render each item with a title, description, and rule/regulation details.
   - Keep the layout responsive and readable on both web and mobile.

5. Style and polish the section.
   - Add icons, colors, spacing, and headings to make the feature easier to scan.
   - Ensure text remains readable and buttons are touch-friendly in mobile views.

6. Verify quality before finishing.
   - Confirm the section appears in the intended screen.
   - Check that content is accurate and easy to understand.
   - Ensure navigation and layout remain intact.

## Decision points
- If the content is small and static, hardcode an array of items directly in the component.
- If the content will grow over time, move it to a separate data file or API endpoint.
- If the feature must be interactive, use accordions, tabs, or filters.
- If the feature is intended for public-facing use, keep language simple, concise, and regulation-focused.

## Suggested content structure
Use a shape similar to this:

```ts
const roadSafetyRules = [
  {
    id: '1',
    type: 'Speed Limits',
    summary: 'Follow posted speed limits at all times.',
    regulation: 'Drivers must obey local speed limits and reduce speed near schools, hospitals, and residential areas.'
  },
  {
    id: '2',
    type: 'Helmet Compliance',
    summary: 'Wear a helmet when riding a two-wheeler.',
    regulation: 'All riders and pillion passengers must wear approved helmets.'
  }
];
```

## Completion checklist
- The new road safety feature appears in the intended view.
- Categories are clearly grouped and readable.
- Rules and regulations are presented in a concise format.
- Layout remains consistent across screen sizes.
- No broken navigation, compile errors, or runtime warnings appear.

## Example prompts to reuse this skill
- Add a road safety rules section to the homepage dashboard.
- Create a card-based list of road safety categories with regulations.
- Add an accordion for traffic safety rules and guidance to the website.
- Show road safety rules and regulations in a new section for users.

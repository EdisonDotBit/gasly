# Gasly — AI Development Guide (Step-by-Step)

## 1. Project purpose

Build **Gasly**, an Angular web app for checking and exploring fuel stations in the Philippines, inspired by the user experience of https://metrofueltracker.com/.

Use the reference site to understand the general product idea and user flow. Do not copy its branding, source code, or assets. Gasly should have its own UI and implementation.

The app should eventually help users:
- See fuel stations on an interactive map.
- See a list of the same stations shown by the map.
- Select a station from the list and locate it on the map, where practical.
- See station details that are actually available from the data source.
- Later, support fuel prices and filtering **only when a trustworthy data source is identified**. Do not invent prices or imply OpenStreetMap contains live fuel prices.

## 2. How to work with this guide

**Work one step at a time. Do not generate the entire application in one response.**

At the start of each step:
1. Inspect the existing files related to that step.
2. Explain briefly what already exists and what needs to change.
3. State the goal and the files you expect to touch.
4. Implement only that step.
5. Explain the important code and how data moves through it.
6. Give me the exact command(s) or browser action(s) to test it.
7. Stop and wait for me to confirm the result before proceeding.

Do not rewrite files unrelated to the current step. Prefer small changes that preserve working code. Do not add packages unless they are needed; explain why before adding one. Do not assume a file's current contents—read it first.

If I report an error, help debug the current step before moving forward. Do not skip ahead or replace the app with a fresh scaffold.

## 3. Current technology and project context

- Project name: **Gasly**
- Front end: **Angular 22**, standalone components, TypeScript
- Styling: **Tailwind CSS 4**
- Map: **Leaflet**
- Station source currently being tested: **OpenStreetMap Overpass API**
- HTTP: Angular `HttpClient`
- Reactive data: RxJS `Observable`
- No ASP.NET Core backend is currently part of this app. Prefer direct API calls from Angular for the current prototype unless we later identify a clear reason to add a backend.
- Development machine: Windows
- Project folder: `C:\Users\H2 Software\source\repos\gasly`

Use the Angular style already present in the repository. Avoid introducing NgModules or older Angular patterns unless the current code specifically requires them. Explain TypeScript concepts simply and concretely; I am still learning Angular.

## 4. Current project structure and implementation

The project already contains these relevant files:

```text
src/app/
  app.ts
  app.html
  app.css
  header/
    header.ts
    header.html
    header.css
  map/
    map.ts
    map.html
    map.css
  station-list/
    station-list.ts
    station-list.html
    station-list.css
  models/
    station.ts
    overpass-response.ts
  services/
    station-service.ts
```

Other relevant files include `src/app/app.config.ts`, `src/styles.css`, and `package.json`.

### Existing implementation notes

- `App` imports `Header`, `StationList`, and `Map`.
- `app.html` renders `<app-header>` and `<app-map>`. The station-list component is currently commented out.
- `Map` currently creates the Leaflet map in `ngAfterViewInit()`, calls `StationService.getStations()`, stores the result in `stations: Station[]`, and adds a marker for each returned station.
- `map.html` currently contains both the Leaflet map element and the station-list markup. This means the station list is currently inside the map component's template.
- `StationService` calls the Overpass API with a bounding box around Metro Manila: `(14.4, 120.8, 14.8, 121.2)`.
- The service maps Overpass elements into the app's `Station` model.
- `Station` currently has `id`, `name`, `latitude`, `longitude`, and `address`.
- `app.config.ts` already provides `provideHttpClient()`.
- Leaflet and its TypeScript definitions are already installed. Tailwind CSS is also installed.
- The current station source returns OpenStreetMap fuel-station map data. A station may be unnamed, missing tags, duplicated by data quality, or absent from OpenStreetMap. Do not promise complete coverage.
- The current Leaflet marker-icon configuration in `map.ts` points at `assets/marker-icon.png`, `assets/marker-icon-2x.png`, and `assets/marker-shadow.png`. Inspect the actual assets and Angular asset configuration before changing this. Do not assume those files exist.

Before making changes, verify the repository's actual current contents. These notes are context, not permission to overwrite working code blindly.

## 5. Intended data flow and component responsibilities

Keep the first version simple. The important end point of the initial data flow is the **Map component holding the loaded `Station[]` array and using that same array for both the station list and Leaflet markers**.

Target mental model:

```text
Overpass API
    ↓ raw Overpass response
StationService
    ↓ converts API elements to Station[]
Map component
    ├── uses Station[] to create Leaflet markers
    └── provides Station[] to the station-list UI
```

The list and map must represent the same loaded station data. Avoid making separate API calls from the map and list for the initial implementation.

For component ownership, prefer this simple approach:
- `StationService`: fetches and maps external API data into `Station[]`.
- `Map`: owns the map lifecycle, holds the loaded `stations` array, and passes that array to the station-list component through an Angular input when we reach that step.
- `StationList`: receives a `Station[]` input and renders the list. It should not independently fetch stations.
- `App`: arranges the page components and header; it should not duplicate the station-fetching logic.

The map may continue to own the station-loading flow for now. Do not introduce a global store, NgRx, signals-based state architecture, a backend, or extra abstraction layers unless a concrete need appears.

## 6. Step-by-step roadmap

Only work on the current step. The order can be adjusted if repository inspection reveals a dependency or a bug that must be fixed first.

### Step 1 — Inspect and establish the baseline
- Read the current files listed above and relevant configuration.
- Explain the existing execution flow from app startup to the API request and marker creation.
- Check whether the app builds and runs before changing code.
- Identify any obvious current errors (for example, verify that the Angular decorator in `station-service.ts` is valid and that required Leaflet marker assets are configured).
- Make only necessary baseline fixes, explaining each one.
- Test with `npm start` and `npm run build`.

**Done when:** the app starts, and we know whether stations are fetched and markers are displayed.

### Step 2 — Confirm the station data model and API mapping
- Inspect the Overpass response shape and the `Station` model.
- Keep the external API response interface separate from the app's `Station` interface.
- Map only fields that are actually present. Handle absent names and tags safely.
- Make API failure/loading states understandable; do not silently pretend an empty result means no stations exist.
- Avoid claiming a station has a current fuel price unless a source actually provides it.

**Done when:** `getStations()` returns a predictable `Observable<Station[]>` and its mapping is understood.

### Step 3 — Separate the station list into its own component
- Move the list markup out of `map.html` and into `station-list.html`.
- Add an appropriate Angular input to `StationList` for the station array.
- Have `Map` pass its existing `stations` array to the list component.
- Render the list using Angular's current template syntax and a stable tracking key.
- Keep the current station-loading logic in one place. Do not add a second API call to `StationList`.
- Render `<app-map>` from the page and ensure the list is displayed in the intended layout without duplicate lists.

**Done when:** the station list appears from the array loaded by `Map`, and the list does not fetch data independently.

### Step 4 — Keep Leaflet markers synchronized with the station array
- Use the same `stations` array to create markers.
- Ensure markers are added only after the map has been initialized and station data has loaded.
- Avoid creating duplicate markers if data is reloaded. If reloads are supported, keep a marker layer or another simple cleanup approach.
- Use safe popup content and display available station details without assuming optional fields exist.
- Keep Leaflet DOM work in the map component and respect Angular's lifecycle.

**Done when:** each valid station in the array can appear in the list and as a map marker, without duplicate markers after a reload.

### Step 5 — Improve list/map interaction
- When a user selects a station in the list, pan or zoom the map to that station and open its marker popup, if feasible.
- Keep the interaction understandable; avoid adding complex state management.
- Explain how the selected station is identified and how its marker is found.

**Done when:** selecting a listed station focuses the corresponding marker.

### Step 6 — Improve layout and usability
- Create a responsive layout inspired by the general usability of the reference site, while keeping Gasly's own identity.
- Make the map and list usable on desktop and mobile.
- Add clear loading, empty, and error states.
- Keep Tailwind usage consistent with the existing project.
- Do not redesign the entire app in one step; make and test focused layout changes.

**Done when:** users can understand the page and use the list/map on typical screen sizes.

### Step 7 — Improve the station search area
- Decide which search/filter behaviors can be supported by the fields currently available.
- Start with simple name search or other filters only when the underlying data supports them.
- Do not show nonfunctional controls.
- Consider a configurable search area or map movement later; avoid repeated expensive Overpass requests without explaining the implications and limits.

**Done when:** every visible search/filter control has a real, tested effect.

### Step 8 — Investigate reliable fuel-price data
- Research whether a lawful, reliable, current source of Philippine fuel prices is available and what its access rules are.
- Distinguish station-location data from fuel-price data. Overpass/OpenStreetMap does not automatically provide current prices.
- Before implementing prices, define the fields and source, how freshness is shown, and how unavailable prices are represented.
- Never fabricate prices, update timestamps, discounts, or brand data.
- If no suitable data source exists, keep the app honest as a station finder rather than displaying invented prices.

**Done when:** a real data source and its limitations are documented before fuel-price UI is built.

### Step 9 — Verification and cleanup
- Run `npm run build`.
- Run relevant tests where practical.
- Check loading, successful response, empty response, API failure, unnamed station, and missing coordinates.
- Check for duplicate markers and console errors.
- Summarize changed files, behavior, and any remaining limitations.

**Done when:** the current feature works and the build passes, or any remaining failure is clearly identified.

## 7. Coding rules for this project

- Explain **what calls what**, **where the data is stored**, and **when it becomes available**.
- When explaining an object or array, say which class/component owns it and when it is assigned.
- Do not give vague explanations such as “Angular handles it”; explain the specific binding, input, lifecycle hook, or subscription involved.
- Prefer small edits over replacing entire files.
- Preserve existing naming and formatting unless there is a clear reason to change them.
- Do not create sample station data as if it came from the API.
- Do not add a backend or a state-management library for this initial flow.
- Do not refactor working code just for style.
- Keep API errors visible and actionable.
- Do not expose API secrets in source code if a future provider requires credentials.
- If the reference site cannot be accessed, say so and ask me for screenshots or describe the missing details rather than inventing its exact layout.

## 8. How to start each AI session

Paste this instruction after giving the AI access to the repository:

> Read `GASLY_AI_GUIDE.md` first. We are working step by step, not generating the entire app at once. Start with the current roadmap step I name. Inspect the relevant existing files before proposing or making edits. Briefly explain the current code flow, make the smallest necessary change for this step, tell me how to test it, and then stop for my confirmation. Do not proceed to the next step automatically.
>
> Current step: **[WRITE THE STEP NUMBER AND GOAL HERE]**

## 9. Current first task

Start with **Step 1 — Inspect and establish the baseline**.

Do not jump straight to a redesign or implement every roadmap item. First inspect the current project and establish that it builds and runs. Then stop and report the baseline and any immediate issues.

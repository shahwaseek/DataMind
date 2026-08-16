# DataMind — DESIGN.md

## Purpose

`DESIGN.md` is the visual and interaction source of truth for DataMind, a local-first AI Data Analyst for 2026–2027.

DataMind should feel like a professional analytical instrument—not a generic AI chatbot or a traditional BI dashboard.

## Design Principles

- **Calm intelligence:** precise typography, restrained color, subtle borders, purposeful motion.
- **Evidence before hype:** every meaningful AI result connects to dataset, method, execution, validation, and evidence.
- **Progressive disclosure:** concise answer first; SQL, execution details, and evidence available on demand.
- **One primary action:** each screen has a clear next step.
- **AI is not the calculator:** deterministic computation is visually distinguished from AI interpretation.
- **Local-first:** privacy and local processing are visible but unobtrusive.

## Product Personality

DataMind should feel:

**Professional · Intelligent · Precise · Calm · Technical · Trustworthy · Fast · Privacy-conscious · Modern**

Avoid:

**Childish · Cyberpunk · Gaming-like · Visually noisy · Generic ChatGPT clone**

## Inspiration

Use principles from products such as Linear, Vercel, Stripe, Notion, Attio, Hex, PostHog, and Supabase.

Do not copy their branding, logos, exact layouts, or proprietary visual assets. Borrow only UX principles such as information hierarchy, density, keyboard-first interaction, progressive disclosure, analytical clarity, and restrained visual design.

## Visual System

### Dark theme

```text
Background        #0B0D10
Surface           #111418
Surface Elevated  #171B21
Surface Hover     #1C2128
Border            #252A32
Border Strong     #343B46
Text Primary      #F5F7FA
Text Secondary    #A0A7B2
Text Muted        #6F7784
Accent            #7C6CFF
Accent Hover      #8C7FFF
Accent Soft       #24213F
Success           #32C48D
Warning           #F5B94C
Danger            #F26D78
Info              #5DA9FF
```

### Light theme

```text
Background        #F8F9FB
Surface           #FFFFFF
Surface Hover     #F2F4F7
Border            #E3E6EB
Border Strong     #D1D6DE
Text Primary      #171A1F
Text Secondary    #59616D
Text Muted        #858D99
Accent            #6557E8
Accent Hover      #5749D8
Accent Soft       #EEECFF
Success           #18865E
Warning           #A86B00
Danger            #C43D4C
Info              #2875C7
```

Use accent color primarily for active navigation, primary actions, selections, and AI actions. Do not use it everywhere. Semantic colors must never be the only indicator of state.

## Typography

Primary font: **Inter**

Fallback:

```text
Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif
```

Code font: **JetBrains Mono**

Recommended scale:

```text
Page title       28–32px
Section title    18–20px
Body             14–15px
Secondary        13px
Caption          12px
Code             13px
```

Weights: 400, 500, 600, 700.

## Spacing

Use an 8px system:

```text
4, 8, 12, 16, 24, 32, 40, 48, 64, 80px
```

## Radius

```text
4px  compact controls
6px  inputs/buttons
8px  cards
10px panels
12px modals/drawers
```

Avoid excessive pill-shaped UI.

## Layout

Desktop:

```text
┌────────────────────────────────────────────────────────────┐
│ Header                                                     │
├───────────────┬────────────────────────────────────────────┤
│ Sidebar       │ Main Workspace                             │
│ 240px         │                                            │
│               │                                            │
└───────────────┴────────────────────────────────────────────┘
```

Sidebar collapses to approximately 68px.

Tablet: collapse sidebar.

Mobile: use bottom navigation:

```text
Home · Data · Ask · Insights · More
```

Prioritize Ask → Results → Evidence on mobile.

## Navigation

```text
DATAMIND

WORKSPACE
  Overview
  Datasets
  Analyst
  Insights
  Reports

PROJECTS
  Sales Analytics
  Marketing Analytics
  Customer Analytics

SYSTEM
  Settings
```

## Header

Include:

- DataMind logo
- project selector
- global search
- command palette shortcut
- help
- avatar

Keep it compact.

## Command Palette

Support `Ctrl+K` / `Cmd+K`.

Commands:

```text
Ask DataMind
Upload Dataset
Open Dataset
View Insights
Open Reports
Settings
```

## Core Screens

### Landing

Headline:

> Understand your data. Without writing the query.

Subheadline:

> DataMind turns natural-language questions into local, verifiable data analysis.

Primary CTA: **Try DataMind**

Secondary CTA: **View Demo**

Show a real analytical UI preview rather than decorative artwork.

### Onboarding

Headline:

> Let's understand your data.

Provide drag-and-drop upload for:

CSV · XLSX · JSON · Parquet

Actions:

- Browse files
- Use sample dataset

Show trust indicators:

- Local-first
- Fast analytics
- AI-assisted

### Project Overview

Show:

- Revenue
- Orders
- Customers
- Data Quality

Then prioritize:

- Revenue trend
- Regional performance
- Data quality
- Recent analyses

Avoid a wall of charts.

### Dataset Overview

Show:

- dataset name
- file type
- updated time
- rows
- columns
- quality score

Show data-quality findings such as missing values, duplicates, invalid dates, and suspicious values.

Column table:

```text
Name | Type | Nulls | Unique | Example
```

### AI Analyst

This is the central screen.

Do **not** make it look like ChatGPT.

Use a large analytical input:

> What would you like to understand?

Placeholder:

> Ask anything about your dataset...

Suggested prompts:

- Which products generate the most revenue?
- Show revenue trends
- Compare regions
- Find unusual patterns
- Why did revenue decline?

Keep dataset context visible.

### Analysis Progress

Show safe observable operations only:

```text
✓ Understanding question
✓ Inspecting schema
✓ Defining metric
✓ Generating analysis
● Validating query
○ Preparing visualization
```

Never expose hidden chain-of-thought.

### Analysis Result

Hierarchy:

```text
Question
↓
Short Answer
↓
Primary Metric
↓
Visualization
↓
Key Findings
↓
Evidence
↓
Technical Details
```

Example:

> Revenue decreased 12.8% compared with Q1. The West region was the largest contributor.

Actions:

- View Evidence
- View SQL
- Re-run Analysis
- Export Report

### Evidence Drawer

Open from the right.

Show:

```text
Question
Dataset
Dataset Version
Analysis Method

SQL

Validation
✓ Read-only
✓ Query validated
✓ Result verified

Execution
142 ms
248,921 rows
```

Actions:

- Copy SQL
- Re-run

### Dataset Explorer

Professional analytical table with:

- search
- filters
- column controls
- sorting
- sticky header
- column resizing
- horizontal scrolling

Example columns:

```text
ID | Date | Product | Category | Region | Quantity | Price | Revenue
```

### Insights

Headline:

> DataMind found 7 notable patterns.

Insight cards should include:

- title
- short explanation
- metric
- why it matters
- Investigate action

Examples:

- Revenue decline
- Product opportunity
- Regional anomaly
- Unusual customer behavior
- Growth trend

### Reports

Report cards contain:

- title
- dataset
- created date
- summary
- Open
- Export PDF
- Duplicate
- Delete

### Evaluation

Developer-facing screen:

```text
DataMind Evaluation

Answer Accuracy
SQL Success
Execution Success
Average Latency
Retry Rate
```

Show evaluation history and failed questions.

This screen is important for the portfolio because it demonstrates measurement and engineering discipline.

### Settings

Sections:

- General
- Appearance
- AI Provider
- Models
- Data
- Security
- Storage
- Evaluation

Show local Ollama configuration and privacy information.

## Component System

Create reusable components and variants:

```text
Button
Input
Search
Select
Dropdown
Tooltip
Dialog
Drawer
Toast
Badge
Tabs
Card
KPI Card
Data Table
Chart
Code Block
Command Palette
Progress
Skeleton
Empty State
Error State
AI Status
Evidence Panel
```

Use Auto Layout, components, variants, variables, and semantic design tokens in Figma.

## Buttons

Primary: main actions such as Upload, Analyze, Create Report.

Secondary: View Evidence, View SQL, Export.

Ghost: low-priority actions.

Danger: destructive actions only.

## AI Input

Large but controlled. Show current dataset:

```text
Analyzing: sales_2026.parquet
```

Suggested prompts appear below.

## KPI Cards

Structure:

```text
Revenue
₹24.8M

↑ 18.4%
vs previous period
```

## Data Quality

Example:

```text
Data Quality
94 / 100

██████████████████░░

✓ No duplicate IDs
✓ Dates complete
⚠ Missing customer values
⚠ Unusual prices
```

Do not rely only on the score; expose underlying issues.

## Charts

Prefer:

- line
- bar
- histogram
- scatter
- area when appropriate

Use charts only when visual shape communicates useful information.

Avoid unnecessary pie charts.

Use:
- clear labels
- useful tooltips
- accessible contrast
- consistent number formatting
- minimal gridlines

## Tables

Requirements:

- sticky header
- row hover
- resizing
- sorting
- filtering
- search
- horizontal scrolling
- compact rows
- readable numeric alignment

## Empty States

Every empty state must teach the user what to do.

Example:

> No datasets yet.  
> Upload a CSV, Excel, JSON or Parquet file to start analyzing your data.

Actions:

- Upload Dataset
- Try Sample Dataset

## Error States

Every error must explain:

1. What happened?
2. Why?
3. What should the user do next?

Example:

> Query could not be executed.  
> The generated query attempted an unsupported operation.  
> Your dataset was not modified.

Actions:

- View Details
- Try Again

Do not show raw stack traces by default.

## Loading

Use skeletons for cards, tables, and charts.

Use progress for long operations such as dataset ingestion and report generation.

## Motion

Default transitions: 150–250ms, ease-out.

Use subtle:

- drawer transitions
- fades
- button feedback
- skeletons
- chart reveals

Respect reduced-motion preferences.

Avoid bouncing, excessive parallax, and decorative animation.

## Accessibility

Design with WCAG-conscious contrast.

Support:

- keyboard navigation
- visible focus
- semantic labels
- accessible controls
- non-color status indicators
- readable chart labels

Never rely only on color.

## Trust UX

Subtle trust indicators:

```text
Local analysis
Read-only query
Result verified
```

Do not use intrusive security banners unless a real security event occurs.

## AI Transparency

Prefer:

```text
DataMind found:

Revenue decreased 12.8%.

Evidence:
DuckDB query over 248,921 rows.
```

Never present unsupported AI interpretation as deterministic fact.

## Frontend Component Structure

```text
components/
├── ui/
├── navigation/
├── datasets/
├── analyst/
├── analytics/
└── reports/
```

Suggested reusable components:

```text
ui/
  Button
  Input
  Badge
  Dialog
  Drawer
  Tooltip
  Tabs
  Toast

navigation/
  Sidebar
  Header
  CommandPalette

datasets/
  DatasetCard
  DatasetTable
  DatasetProfile
  DataQuality

analyst/
  AnalystInput
  AnalysisProgress
  AnalysisResult
  EvidencePanel
  SQLViewer

analytics/
  KPICard
  Chart
  InsightCard
  Metric

reports/
  ReportCard
  ReportViewer
```

## Figma Organization

Create pages:

```text
00 — Cover
01 — Foundations
02 — Components
03 — Landing
04 — Onboarding
05 — Dashboard
06 — Datasets
07 — Analyst
08 — Analysis Results
09 — Evidence
10 — Insights
11 — Reports
12 — Evaluation
13 — Settings
14 — Mobile
15 — Prototype Flows
```

## Prototype Flow

Connect:

```text
Landing
→ Onboarding
→ Upload
→ Dataset
→ Analyst
→ Analysis Progress
→ Result
→ Evidence
→ Explorer
→ Insights
→ Reports
```

Include interactions for:

- upload
- dataset selection
- analyst prompt
- suggested prompts
- Analyze
- progress
- View Evidence
- View SQL
- Copy SQL
- chart tooltip
- sidebar navigation
- command palette
- theme switch
- report opening

## Sample Data

Use realistic sales data:

```text
order_id
date
product
category
region
customer
quantity
price
revenue
```

Example questions:

```text
Which region generated the highest revenue?
Why did revenue decline in Q2?
Which products grew the fastest?
Show monthly revenue.
Find unusual sales patterns.
Compare average order value by region.
```

## Portfolio Focus

The primary portfolio view should demonstrate:

```text
DataMind Analyst
+
Analysis Result
+
Chart
+
Evidence Panel
```

This immediately communicates the project's differentiator: AI-assisted analysis with verifiable evidence.

## Design Acceptance Criteria

The design is ready for implementation when:

- all core screens exist;
- dark and light themes exist;
- components are reusable;
- typography is consistent;
- spacing follows the design system;
- primary user journey is clickable;
- empty, loading, and error states exist;
- responsive behavior is defined;
- accessibility is considered;
- evidence UX is designed;
- AI states are designed;
- developers can implement the design without guessing.

## Final UX Promise

DataMind should make the user feel:

```text
I asked a question.
        ↓
DataMind understood it.
        ↓
DataMind analyzed my data.
        ↓
I can see the result.
        ↓
I can verify the evidence.
        ↓
I can investigate further.
```

The product should feel like:

> **A professional data analyst sitting beside me.**

Not:

> **A chatbot with a spreadsheet.**

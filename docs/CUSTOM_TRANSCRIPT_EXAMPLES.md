# Custom Transcript Examples

Test the Cognitive Load Monitor's dynamic name detection by trying these example transcripts:

## Example 1: Marketing Team Sprint

```
Marketing Sprint Planning — April 2026
Attendees: Alex (Marketing Lead), Jordan (Designer), Taylor (Content Writer), Morgan (Analytics)

Alex: We need to launch the summer campaign by May 15th. Jordan, can you create the visual assets?
Jordan: Yes, I'll have mockups ready by May 1st. I need Taylor's copy first though.
Taylor: I can deliver all copy by April 28th. Morgan, I'll need the Q1 performance data.
Morgan: Analytics report will be ready by April 25th. I'll also set up tracking for the new campaign.
Alex: Perfect. Jordan delivers finals May 5th, Taylor reviews May 7th, launch May 15th.
```

**Expected Cognitive Load Monitor Names**: Alex, Jordan, Taylor, Morgan

---

## Example 2: Product Development Team

```
Product Roadmap Meeting — April 2026
Attendees: Sam (Product Manager), Casey (Backend Dev), Riley (Frontend Dev), Drew (QA Lead)

Sam: We're building the new payment integration. Casey, can you handle the API work?
Casey: Sure, I'll complete the backend by May 10th. Need Drew to test it thoroughly.
Riley: I'll build the UI once Casey's API is ready. Give me 5 days after that.
Drew: I need at least 3 days for full QA testing before we ship.
Sam: Timeline: Casey done May 10, Riley done May 15, Drew testing May 18, ship May 20.
```

**Expected Cognitive Load Monitor Names**: Sam, Casey, Riley, Drew

---

## Example 3: Research Team

```
Research Project Kickoff — April 2026
Attendees: Dr. Kim (Lead Researcher), Dr. Patel (Data Scientist), Dr. Chen (Lab Manager), Dr. Lopez (Grant Writer)

Dr. Kim: We need to submit the grant proposal by June 1st. Dr. Lopez, can you draft it?
Dr. Lopez: I'll have the first draft by May 15th. I need Dr. Patel's preliminary data analysis.
Dr. Patel: Data analysis will be complete by May 10th. Dr. Chen, I need the lab results first.
Dr. Chen: Lab work finishes May 5th. I'll send you the full dataset immediately.
Dr. Kim: Perfect timeline. Dr. Lopez submits final draft May 25th, we review May 28th, submit June 1st.
```

**Expected Cognitive Load Monitor Names**: Dr. Kim, Dr. Patel, Dr. Chen, Dr. Lopez

---

## How to Test

1. Copy one of the example transcripts above
2. Paste it into the Transcript Input box (replacing the default text)
3. Click "Launch Workflow"
4. Watch the Cognitive Load Monitor - it will show the names from YOUR custom transcript!
5. The monitor will display a "Custom Transcript" badge when non-default names are detected

---

## Tips for Creating Your Own Transcripts

For best results with Gemini AI parsing:

- Include clear attendee names at the start
- Use natural conversation format
- Mention specific tasks and deadlines
- Reference who is responsible for each task
- Include dependencies between tasks
- Use realistic dates and priorities

The system will automatically:
- Extract all task owners
- Calculate cognitive load based on task priorities
- Display all team members dynamically
- Update in real-time as tasks progress

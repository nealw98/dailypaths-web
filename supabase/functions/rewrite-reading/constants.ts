// ============================================
// AI REWRITE PROMPTS - Edit this file to adjust AI behavior
// ============================================

// Word count targets for each field
export const WORD_COUNT_TARGETS: Record<string, { min: number; max: number; target: number }> = {
  body: { min: 160, max: 180, target: 170 },
  application: { min: 25, max: 35, target: 30 },
  default: { min: 15, max: 40, target: 25 },
};

// Field descriptions for output format
export const FIELD_DESCRIPTIONS: Record<string, string> = {
  title: "title (keep original if it fits well, or improve it if needed)",
  body: "body (2–3 tight paragraphs, 160-180 words total)",
  quote: "quote"
};

// ============================================
// TITLE REWRITE PROMPT
// ============================================
export const TITLE_SYSTEM_PROMPT = `You are writing a title for an Al-Anon daily reflection. The title should capture the essence of the reading in a clear, meaningful way.

REQUIREMENTS:
• 2-6 words (shorter is often stronger)
• Reflects the core theme or emotional journey
• Clear and accessible language
• Avoids clichés or overly abstract phrases
• Should resonate with the reading's message

STYLE:
• Direct and honest
• Emotionally grounded
• Recovery-focused but not preachy
• Can be improved from the original if a better fit exists

Return ONLY the title text with no labels, quotes, or additional commentary.`;

export const TITLE_USER_PROMPT = `Based on this reading, write a title:

Opening:
{OPENING}

Body:
{BODY}

Quote:
{QUOTE}

Generate a title that captures the essence of this reflection.`;

// ============================================
// THOUGHT FOR THE DAY REWRITE PROMPT
// ============================================
export const THOUGHT_FOR_DAY_SYSTEM_PROMPT = `You are writing a "Thought for the Day" for an Al-Anon daily reflection. This should be a quotable statement with embedded wisdom—transforming the specific situation in the BODY TEXT into a universal principle that could become an idiom.

IMPORTANT: Base this on the BODY TEXT, not the quote. The body tells the story—your job is to distill that story into timeless wisdom.

CORE PRINCIPLE:
Transform the concrete scenario from the body into timeless wisdom. Like "Panic won't fix a leaking pipe — or anything else" turns a specific basement crisis into a universal truth about panic and problem-solving.

REQUIREMENTS:
• Quotable and memorable—something that sticks in the mind
• Embedded wisdom—contains a universal principle applicable beyond the specific story
• Idiom quality—could be repeated in many life situations
• Grounded in the BODY'S specific scenario but transcends it
• 15-30 words maximum (shorter is often stronger)
• Can use concrete imagery from the body to anchor the wisdom

STYLE:
• Direct and clear (punchy, not poetic)
• Strong opening—often states what doesn't work or what is
• Creates an "aha" moment of recognition
• Authentic Al-Anon voice—recovery wisdom, not generic inspiration
• Avoid "I" statements—these are universal truths, not personal affirmations

EXAMPLES OF THE APPROACH:
• From panic about leaking pipes → "Panic won't fix a leaking pipe — or anything else."
• From people-pleasing at work → "Saying yes to everyone means saying no to myself."
• From controlling a family member → "I can't manage someone else's life when I'm barely managing my own."

Return ONLY the thought for the day text with no labels, quotes, or additional commentary.`;

export const THOUGHT_FOR_DAY_USER_PROMPT = `Based on this reading, write a "Thought for the Day":

Title: {TITLE}

Opening:
{OPENING}

Body:
{BODY}

Quote:
{QUOTE}

Generate a thought for the day that captures the essence of this reflection.`;

// ============================================
// SECTION REWRITE PROMPTS (single field with full context)
// ============================================

// Field-specific guidance
export const FIELD_GUIDANCE: Record<string, string> = {
  body: `The body is the complete narrative arc in 160-180 words (2-3 tight paragraphs). It must:
- Open with a grounded, specific moment that sets up the emotional situation
- Show the old pattern and moment of NEW SELF-AWARENESS
- Reveal the Al-Anon shift and insight

SOURCE OF AWARENESS (VARY THESE):
The new self-awareness can come from different sources—vary across readings:
• A specific situation that reveals the pattern (e.g., a conversation, an event, noticing my reaction)
• Quiet self-reflection or journaling
• A conversation with another member or my sponsor
• Something I heard at a meeting that clicked
• A moment of clarity while doing something ordinary

CRITICAL: Use the quote as a JUMPING-OFF POINT, not as something to describe or paraphrase. The body should have depth and insight that goes BEYOND the quote—the quote sparks the reflection, but the story and wisdom must stand on their own. Never summarize or explain what the quote means.`,
  application: `A specific, first-person action I will take, derived from the BODY TEXT (not the quote). The application should flow naturally from the story and insight in the body. Write in FIRST PERSON as something I can or will do—NOT as instructions or commands. No embellishment or descriptive detail—just what I will do. Example: 'Today I will stay after my meeting. I'll make eye contact with someone who looks lost and offer to exchange numbers.'`,
  thought_for_day: `Distill the BODY TEXT into timeless, quotable wisdom. The thought should capture the universal principle from the body's specific story—not from the quote directly.`,
  default: "Clear and concise content.",
};

// Body text condensing prompt (when over max words)
export const BODY_CONDENSE_PROMPT = `Edit this Al-Anon body text to EXACTLY {MIN}-{MAX} words. 

⚠️ CRITICAL: The result MUST be at least {MIN} words. Do NOT go below {MIN} words under any circumstances.

Editing principles:
- Remove redundant adjectives and adverbs that repeat the same idea
- Cut phrases that over-explain what's already clear
- Tighten endings that restate the point
- Use sentence fragments for lists/examples when appropriate
- Trust the reader to understand implications without spelling everything out
- Maintain the authentic meeting-share voice and emotional core

BEFORE RETURNING: Count the words. If under {MIN}, you have cut too much—add back meaningful detail until you reach at least {MIN} words.

Output only the revised text with paragraph breaks as \\n\\n.`;

// Body text expanding prompt (when under min words)
export const BODY_EXPAND_PROMPT = `Expand this Al-Anon body text to {MIN}-{MAX} words (target {TARGET}) by adding meaningful depth:

- Add more emotional depth and internal experience details
- Expand on the moments of awareness with sensory or emotional detail
- Flesh out the narrative with specific examples or moments that illustrate the pattern
- Develop the Al-Anon principles or insights more fully
- Add texture to the story without changing the core situation or lesson
- Show more of the "before and after" journey
- Maintain the authentic meeting-share voice

DO NOT just restate what's there. ADD substantial new detail that enriches the story.

Output only the expanded text with paragraph breaks as \\n\\n.`;

// Generic condense prompt (for non-body fields)
export const GENERIC_CONDENSE_PROMPT = `Condense this {FIELD} text to between {MIN}-{MAX} words (target {TARGET}). {GUIDANCE} Keep all key points and the same tone. Make it more concise by trimming excess words and tightening sentences.`;

// Generic expand prompt (for non-body fields)
export const GENERIC_EXPAND_PROMPT = `Expand this {FIELD} text to between {MIN}-{MAX} words (target {TARGET}). {GUIDANCE} Add meaningful detail and depth - DO NOT just restate what's there. Enrich with:
- Specific sensory or emotional details
- More vivid examples that illustrate the point
- Deeper exploration of the internal experience
- Additional context that makes the scene more real
Keep the same core message and tone, but make it substantially richer.`;

// Generic refine prompt (when word count is in range)
export const GENERIC_REFINE_PROMPT = `Refine this {FIELD} text while keeping it between {MIN}-{MAX} words. {GUIDANCE} Improve clarity and flow without changing the meaning.`;

// Section rewrite system prompt wrapper (DEPRECATED - only used as fallback)
export const SECTION_SYSTEM_PROMPT = `You are a text editor focused on word count adjustment. {INSTRUCTION} Use \\n\\n for paragraph breaks. Return ONLY the adjusted text with no additional commentary, labels, or JSON formatting.`;

// ============================================
// CONTEXTUAL SECTION REWRITE (with full reading context)
// ============================================
export const CONTEXTUAL_SECTION_SYSTEM_PROMPT = `You are editing the {FIELD} section of an Al-Anon daily reflection. You have access to the full reading context to ensure coherence.

⚠️ CRITICAL - READ THIS FIRST:
{INSTRUCTION}

HOW TO HANDLE USER REQUESTS:
• If the user gave SPECIFIC instructions above (grammar fix, particular edits, tone adjustment, etc.), do ONLY what they asked. Do NOT rewrite or restructure content they didn't mention.
• If the user asked for a "rewrite" OR if no specific instructions were given, then create a fresh version following all base guidelines below.
• Always preserve the core situation, relationships, and emotional journey unless explicitly asked to change them.
• The user's instructions define exactly what you should and should not change.

CONTEXT ABOUT THIS READING (reference when doing full rewrites):
This is a Daily Paths reading—a personal Al-Anon share meant to feel like someone speaking at a meeting. The reading uses a quote as inspiration and explores how recovery principles apply to everyday life.

AL-ANON WRITING STYLE (apply only when doing full rewrites or if user asks for style improvements):
• Personal, human, emotionally specific
• Rooted in real-life moments (work, family, parenting, relationships)
• Honest about emotions and patterns
• Reflective of internal change, not trying to fix others
• Natural relational language ("my daughter," "my partner")
• Avoid formulaic phrases like "For years I..." or "I used to..."
• CRITICAL: Create FRESH, ORIGINAL content. Do NOT recycle patterns, phrases, or structures from other readings. Each rewrite should feel unique and spontaneous.

FIELD-SPECIFIC GUIDANCE FOR {FIELD} (apply when doing full rewrites):
{FIELD_GUIDANCE}

TARGET WORD COUNT: {MIN}-{MAX} words (apply when doing full rewrites, or if user explicitly asks about length)

Use \\n\\n for paragraph breaks. Return ONLY the edited text with no labels, quotes, or commentary.`;

export const CONTEXTUAL_SECTION_USER_PROMPT = `Here is the full reading context:

Title: {TITLE}
Quote: {QUOTE}

Body:
{BODY}

Application:
{APPLICATION}

Thought for the Day:
{THOUGHT_FOR_DAY}

---

Current {FIELD} text ({WORD_COUNT} words):
{CURRENT_CONTENT}

Apply the instructions given in the system prompt to this {FIELD} section. Return only the updated text.`;

// ============================================
// FULL READING REWRITE PROMPTS
// ============================================
export const FULL_REWRITE_SYSTEM_PROMPT = `Rewrite specific fields of this Daily Paths reading at a higher quality, using the depth, specificity, and authenticity of the strongest February readings.

Keep these EXACT elements from the original:
• step_theme
• secondary_theme
• the SAME basic situation, scenario, and life context
• the SAME relationships and characters (if any)
• the SAME core emotional journey
{KEEP_FIELDS}

Rewrite to improve quality (SAME situation, better writing):
{REGENERATE_FIELDS}

QUALITY REQUIREMENTS

⚠️ CRITICAL: You are REWRITING the same situation, NOT creating a new one.
• Keep the same life scenario (e.g., if it's about a work meeting, keep it about that work meeting)
• Keep the same characters/relationships mentioned (e.g., if it mentions "my daughter," keep that same daughter)
• Keep the same context and setting
• DO NOT change the situation to something entirely different
• Your job is to IMPROVE THE WRITING of the existing situation using the criteria below

Write like an authentic Al-Anon share grounded in real lived experience.

The rewrite must be:
• personal, human, emotionally specific
• rooted in a real-life moment (work, family, parenting, relationships, internal struggle)
• honest about emotions and patterns
• reflective of internal change, not trying to influence or fix others
• aligned with the original day's theme and emotional arc
• rich enough to match February-level depth (never generic or surface-level)

Avoid formulaic language, such as:
• "For years I…"
• "I used to…"
• "Al-Anon literature teaches…"
• generic slogans inserted mechanically

The phrase "Step X asks me to…" is allowed if it fits naturally.

Use normal double quotes " for any dialogue.
Do not overuse dialogue; only include where it strengthens the story.

Use natural relational language ("my daughter," "my partner," etc.) rather than clinical terms.

STRUCTURE

Body (2–3 tight paragraphs, ABSOLUTELY 160–180 words total):
⚠️ CRITICAL WORD COUNT REQUIREMENT ⚠️
The body text MUST be between 160-180 words. This is NON-NEGOTIABLE.

The body is the COMPLETE narrative—it opens with a grounded, specific moment, then shows the arc:
1. The emotional setup / specific situation
2. The old pattern and moment of NEW SELF-AWARENESS
3. The Al-Anon shift and insight

SOURCE OF AWARENESS (VARY THESE across readings):
• A specific situation that reveals the pattern (conversation, event, noticing my reaction)
• Quiet self-reflection or journaling
• A conversation with another member or my sponsor
• Something heard at a meeting that clicked
• A moment of clarity during something ordinary

⚠️ CRITICAL: USE THE QUOTE AS A JUMPING-OFF POINT ⚠️
Do NOT describe, paraphrase, or explain the quote. The quote sparks the reflection, but the story and wisdom must go BEYOND the quote. The body should have depth and insight that stands on its own. Never write "The quote says..." or summarize what the quote means.

BEFORE writing the body:
1. Plan to write EXACTLY 2-3 short paragraphs
2. Target 170 words (middle of the range)
3. Keep sentences concise and direct

AFTER writing the body:
1. Count every single word
2. If over 180 words, CUT content immediately
3. If under 160 words, ADD specific detail
4. VERIFY final count is 160-180 words

Let principles appear through action and reflection, not instruction.

Today's Application (1–2 sentences):
A simple, practical action or mindset I can apply for the day (no "Today I will…" phrasing).

Use \\n\\n for paragraph breaks in the body.

MANDATORY WORD COUNT VERIFICATION BEFORE RETURNING:
- Body: 160–180 words (COUNT EVERY WORD - this is the most important requirement)
- Today's Application: 1–2 sentences (count and verify)

If body word count is outside 160-180 range, you MUST revise it until it fits.

OUTPUT FORMAT

Return ONLY valid JSON with the regenerated fields (no commentary, no markdown):
{OUTPUT_FORMAT}`;

export const FULL_REWRITE_USER_PROMPT = `Original reading to rewrite:

Title: {TITLE}
Step Theme: {STEP_THEME}
Secondary Theme: {SECONDARY_THEME}
Day: {DAY_OF_YEAR}

Opening:
{OPENING}

Body:
{BODY}

Quote:
{QUOTE}

Rewrite this reading following all quality requirements and structure guidelines. Keep the SAME basic situation and scenario - just improve the writing quality, depth, and authenticity.`;

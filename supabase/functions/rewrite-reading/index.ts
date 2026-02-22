import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { 
  FIELD_DESCRIPTIONS, 
  WORD_COUNT_TARGETS,
  FIELD_GUIDANCE,
  TITLE_SYSTEM_PROMPT,
  TITLE_USER_PROMPT,
  THOUGHT_FOR_DAY_SYSTEM_PROMPT,
  THOUGHT_FOR_DAY_USER_PROMPT,
  CONTEXTUAL_SECTION_SYSTEM_PROMPT,
  CONTEXTUAL_SECTION_USER_PROMPT,
  FULL_REWRITE_SYSTEM_PROMPT,
  FULL_REWRITE_USER_PROMPT,
} from "./constants.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function countWords(text: string): number {
  return text
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { reading, fields = ["title", "opening", "body", "quote"], additionalInstructions } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log(`Rewriting reading: ${reading.title} (Day ${reading.day_of_year}) - Fields: ${fields.join(", ")}${additionalInstructions ? ` - Extra: ${additionalInstructions}` : ''}`);

    // TITLE REWRITE: Generate based on entire reading context
    if (fields.length === 1 && fields[0] === "title") {
      console.log("Title rewrite detected");
      
      const userPrompt = TITLE_USER_PROMPT
        .replace("{OPENING}", reading.opening)
        .replace("{BODY}", reading.body)
        .replace("{QUOTE}", reading.quote);

      const systemPrompt = additionalInstructions 
        ? `${TITLE_SYSTEM_PROMPT}\n\nADDITIONAL USER INSTRUCTIONS:\n${additionalInstructions}`
        : TITLE_SYSTEM_PROMPT;

      const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
        }),
      });

      if (!response.ok) {
        if (response.status === 429) {
          return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        if (response.status === 402) {
          return new Response(JSON.stringify({ error: "AI credits exhausted. Please add funds to continue." }), {
            status: 402,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        const errorText = await response.text();
        console.error("AI gateway error:", response.status, errorText);
        return new Response(JSON.stringify({ error: "AI service error. Please try again." }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const data = await response.json();
      const title = data.choices?.[0]?.message?.content?.trim();

      if (!title) {
        throw new Error("No content in AI response");
      }

      console.log(`Title generated: ${title}`);

      return new Response(JSON.stringify({ title }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // THOUGHT FOR DAY REWRITE: Generate based on entire reading context
    if (fields.length === 1 && fields[0] === "thought_for_day") {
      console.log("Thought for day rewrite detected");
      
      const userPrompt = THOUGHT_FOR_DAY_USER_PROMPT
        .replace("{TITLE}", reading.title)
        .replace("{OPENING}", reading.opening)
        .replace("{BODY}", reading.body)
        .replace("{QUOTE}", reading.quote);

      const systemPrompt = additionalInstructions 
        ? `${THOUGHT_FOR_DAY_SYSTEM_PROMPT}\n\nADDITIONAL USER INSTRUCTIONS:\n${additionalInstructions}`
        : THOUGHT_FOR_DAY_SYSTEM_PROMPT;

      const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
        }),
      });

      if (!response.ok) {
        if (response.status === 429) {
          return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        if (response.status === 402) {
          return new Response(JSON.stringify({ error: "AI credits exhausted. Please add funds to continue." }), {
            status: 402,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        const errorText = await response.text();
        console.error("AI gateway error:", response.status, errorText);
        return new Response(JSON.stringify({ error: "AI service error. Please try again." }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const data = await response.json();
      const thoughtForDay = data.choices?.[0]?.message?.content?.trim();

      if (!thoughtForDay) {
        throw new Error("No content in AI response");
      }

      console.log(`Thought for day generated: ${thoughtForDay}`);

      return new Response(JSON.stringify({ thought_for_day: thoughtForDay }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // SECTION REWRITE: Single field with full reading context
    if (fields.length === 1) {
      const field = fields[0];
      const fieldContent = reading[field];
      
      if (typeof fieldContent !== "string") {
        throw new Error(`Field ${field} is not a string`);
      }

      console.log("Single field contextual rewrite detected");
      
      const wordCount = countWords(fieldContent);
      
      // Get word count targets for this field
      const targets = WORD_COUNT_TARGETS[field] || WORD_COUNT_TARGETS.default;
      const { min: minWords, max: maxWords } = targets;
      const fieldGuidance = FIELD_GUIDANCE[field] || FIELD_GUIDANCE.default;
      
      // Build the instruction based on user input or default behavior
      let instruction = "";
      if (additionalInstructions && additionalInstructions.trim()) {
        // User provided specific instructions - these OVERRIDE default rewrite behavior
        instruction = `USER'S SPECIFIC REQUEST: "${additionalInstructions.trim()}"

Do exactly what the user asked. If they want grammar fixes, only fix grammar. If they want one paragraph edited, only edit that paragraph. Do NOT do a full rewrite unless they explicitly ask for it.`;
      } else {
        // Default: create a fresh rewrite following all base guidelines
        instruction = `FULL REWRITE REQUESTED: Create a fresh rewrite of this ${field} section. Follow all the Al-Anon guidelines to produce authentic, emotionally resonant content with new self-awareness and depth.`;
      }
      
      // Build system prompt with full context
      const systemPrompt = CONTEXTUAL_SECTION_SYSTEM_PROMPT
        .replace(/{FIELD}/g, field)
        .replace(/{FIELD_GUIDANCE}/g, fieldGuidance)
        .replace(/{MIN}/g, String(minWords))
        .replace(/{MAX}/g, String(maxWords))
        .replace(/{INSTRUCTION}/g, instruction);
      
      // Build user prompt with full reading context
      const userPrompt = CONTEXTUAL_SECTION_USER_PROMPT
        .replace(/{TITLE}/g, reading.title || '')
        .replace(/{QUOTE}/g, reading.quote || '')
        .replace(/{OPENING}/g, reading.opening || '')
        .replace(/{BODY}/g, reading.body || '')
        .replace(/{APPLICATION}/g, reading.application || '')
        .replace(/{THOUGHT_FOR_DAY}/g, reading.thought_for_day || '')
        .replace(/{FIELD}/g, field)
        .replace(/{WORD_COUNT}/g, String(wordCount))
        .replace(/{CURRENT_CONTENT}/g, fieldContent);

      const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
        }),
      });

      if (!response.ok) {
        if (response.status === 429) {
          return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        if (response.status === 402) {
          return new Response(JSON.stringify({ error: "AI credits exhausted. Please add funds to continue." }), {
            status: 402,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        const errorText = await response.text();
        console.error("AI gateway error:", response.status, errorText);
        return new Response(JSON.stringify({ error: "AI service error. Please try again." }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const data = await response.json();
      const rewrittenContent = data.choices?.[0]?.message?.content?.trim();

      if (!rewrittenContent) {
        throw new Error("No content in AI response");
      }

      const finalWordCount = countWords(rewrittenContent);
      console.log(`Contextual section rewrite complete. Word count: ${wordCount} → ${finalWordCount}`);

      return new Response(JSON.stringify({ [field]: rewrittenContent }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // FULL READING REWRITE: Multiple fields - use comprehensive Al-Anon prompt
    console.log("Full reading rewrite detected");

    // Build the fields to regenerate list
    const fieldsToRegenerate = fields.map((f: string) => `• ${FIELD_DESCRIPTIONS[f] || f}`).join("\n");

    // Build the "keep fields" list (fields NOT being regenerated)
    const keepFields = [];
    if (!fields.includes("title")) keepFields.push("• title");
    if (!fields.includes("opening")) keepFields.push("• opening");
    if (!fields.includes("body")) keepFields.push("• body");
    if (!fields.includes("quote")) keepFields.push("• quote");

    // Build system prompt
    const systemPrompt = FULL_REWRITE_SYSTEM_PROMPT
      .replace("{KEEP_FIELDS}", keepFields.join("\n"))
      .replace("{REGENERATE_FIELDS}", fieldsToRegenerate)
      .replace("{OUTPUT_FORMAT}", fields.map((f: string) => `  "${f}": "[...]"`).join(",\n"));

    // Build user prompt
    const userPrompt = FULL_REWRITE_USER_PROMPT
      .replace("{TITLE}", reading.title)
      .replace("{STEP_THEME}", reading.step_theme || "N/A")
      .replace("{SECONDARY_THEME}", reading.secondary_theme || "N/A")
      .replace("{DAY_OF_YEAR}", reading.day_of_year)
      .replace("{OPENING}", reading.opening)
      .replace("{BODY}", reading.body)
      .replace("{QUOTE}", reading.quote);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        console.error("Rate limit exceeded");
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        console.error("Payment required");
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add funds to continue." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "AI service error. Please try again." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No content in AI response");
    }

    console.log("Full reading rewrite successful");

    // Parse the JSON response
    const rewrittenReading = JSON.parse(content);

    // CRITICAL: Only return the fields that were explicitly requested
    // Filter out any extra fields the AI might have included
    const filteredResult: Record<string, string> = {};
    for (const field of fields) {
      if (rewrittenReading[field]) {
        filteredResult[field] = rewrittenReading[field];
      }
    }

    return new Response(JSON.stringify(filteredResult), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error rewriting reading:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "An error occurred" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

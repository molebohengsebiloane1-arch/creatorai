import {
  VideoScriptData,
  YouTubePackageData,
  SocialCaptionsData,
  VideoPlanData,
  ContentIdeasData,
} from '../types';

/**
 * Built-in Demo Generator
 * Generates rich, realistic, topic-customized content without requiring an AI API call.
 * This guarantees creators can test all workflows and features even during upstream API outages.
 */

// Helper to clean topic
function cleanTopic(topic: string, fallback: string): string {
  const trimmed = (topic || '').trim();
  return trimmed.length > 0 ? trimmed : fallback;
}

// 1. Demo Video Script
export function generateDemoVideoScript(params: {
  topic: string;
  platform?: string;
  tone?: string;
  duration?: string;
  audience?: string;
}): VideoScriptData {
  const topic = cleanTopic(params.topic, 'Content Creation Mastery');
  const platform = params.platform || 'YouTube';
  const duration = params.duration || '60 seconds';
  const audience = params.audience || 'Creators & Solo Entrepreneurs';

  return {
    title: `How to Master ${topic} (The Fast & Actionable Way)`,
    platform,
    estimatedDuration: duration,
    targetAudience: audience,
    hookOptions: [
      {
        type: 'Curiosity Gap Hook',
        spokenLine: `If you want to master ${topic} in 2026, stop doing what 99% of people are doing right now.`,
        visualAction: `Creator looks directly into camera lens with urgent intensity, holding up a smartphone showing high-velocity metrics.`,
      },
      {
        type: 'Problem & Agitation Hook',
        spokenLine: `The biggest mistake people make with ${topic} is overcomplicating step one and burning out after 2 weeks.`,
        visualAction: `Fast montage cut of overwhelmed creator staring at confusing charts and blank documents.`,
      },
      {
        type: 'Bold Claim / Proof Hook',
        spokenLine: `Here is the exact 3-step formula I used to completely simplify ${topic} in less than 30 days.`,
        visualAction: `Dynamic kinetic text badge appearing on screen with subtle neon purple glow outline.`,
      },
    ],
    scriptSections: [
      {
        sectionName: 'Pattern Interrupt & Cold Open',
        duration: '0:00 - 0:08',
        spokenWords: `Before you spend hours getting frustrated with ${topic}, listen to this 60-second shortcut that changed everything for me.`,
        visualNotes: `Tight punch-in cut, creator centered, studio edge lighting with electric purple backlights.`,
        screenText: `THE ${topic.toUpperCase()} SHORTCUT`,
      },
      {
        sectionName: 'Core Insight / Step 1',
        duration: '0:08 - 0:25',
        spokenWords: `Step one: Strip away the noise. Most tutorials give you 10 things to do, but only 2 of them actually move the needle for ${topic}. Focus on foundational consistency first.`,
        visualNotes: `Split screen: left side shows messy manual workflow, right side shows clean streamlined process.`,
        screenText: `1. FOCUS ON THE 20% THAT MATTERS`,
      },
      {
        sectionName: 'Demonstration / Step 2',
        duration: '0:25 - 0:45',
        spokenWords: `Step two: Build a repeatable workflow. When you templatize your approach to ${topic}, you go from taking all weekend to finishing in under 45 minutes flat.`,
        visualNotes: `Dynamic B-roll footage showing rapid execution on laptop with stopwatch timer ticking down.`,
        screenText: `2. TEMPLATIZE & AUTOMATE`,
      },
      {
        sectionName: 'The Payoff & Actionable Rule',
        duration: '0:45 - 0:55',
        spokenWords: `Step three: Test, measure, and iterate. Stop waiting for perfection—action produces clarity every single time with ${topic}.`,
        visualNotes: `Punchy cut back to creator holding up notebook with 3 checklist boxes checked green.`,
        screenText: `3. ACTION PRODUCES CLARITY`,
      },
    ],
    callsToAction: [
      {
        goal: 'Follow & Save',
        phrase: `Hit follow and save this video for your next project on ${topic}!`,
        visualCue: `Animated pointer taps glowing save and follow buttons on screen.`,
      },
      {
        goal: 'Comment Debate',
        phrase: `What is your single biggest question about ${topic}? Drop it below and I will answer every comment!`,
        visualCue: `Animated comment bubble appears with subtle chime sound.`,
      },
    ],
    audioAndMusicVibe: `Modern lofi synthwave, 124 BPM, subtle bass drop on transition cues.`,
    viralRetentionTips: [
      `Keep intro pacing under 4.5 seconds before delivering the first value point to maximize ${platform} watch time.`,
      `Add dynamic text overlays for every core keyword so sound-off mobile scrollers stay engaged.`,
      `Place your most counter-intuitive tip around the 35-second mark to maintain algorithmic velocity.`,
    ],
  };
}

// 2. Demo YouTube Package
export function generateDemoYouTubePackage(params: {
  topic: string;
  channelNiche?: string;
  audience?: string;
  videoType?: string;
}): YouTubePackageData {
  const topic = cleanTopic(params.topic, 'YouTube Automation & AI');
  const niche = params.channelNiche || 'Tech & Content Creation';

  return {
    titles: [
      {
        title: `How to Master ${topic} (Full 2026 Step-by-Step Guide)`,
        style: 'High Search Intent (SEO)',
        estimatedCTR: '12.4% Estimated CTR',
        reason: 'Targeting exact high-volume queries with clear authority and timeframe relevance.',
      },
      {
        title: `I Tested ${topic} for 30 Days (Here is What Happened)`,
        style: 'High Curiosity Gap',
        estimatedCTR: '15.8% Viral Potential',
        reason: 'Experiments and tangible results trigger irresistible curiosity in feed recommendations.',
      },
      {
        title: `Stop Doing ${topic} The Hard Way! (Do This Instead)`,
        style: 'Contrarian / Urgent Hook',
        estimatedCTR: '13.9% High CTR',
        reason: 'Loss aversion triggers immediate clicks by warning creators their method is outdated.',
      },
      {
        title: `The Ultimate ${topic} Starter Pack (Free Tools & Templates)`,
        style: 'Beginner-Friendly Value',
        estimatedCTR: '14.1% High Save Rate',
        reason: 'Free resources and starter pack framing dramatically reduces beginner friction.',
      },
      {
        title: `5 Secret ${topic} Hacks Top Channels Keep Hidden`,
        style: 'Insider Knowledge',
        estimatedCTR: '13.2% High Watch Time',
        reason: 'Promises exclusive insider tactics that competitors do not want viewers to know.',
      },
    ],
    description: {
      aboveTheFold: `In this complete guide, learn how to conquer ${topic} in 2026 without wasting weeks on trial and error. Download the free workflow checklist below ⬇️`,
      summary: `Are you struggling to get results with ${topic}? You are not alone.\n\nIn this video, I break down the entire blueprint step-by-step. Whether you are just getting started in ${niche} or looking to optimize your existing system, these tested strategies will give you the exact framework you need.\n\nMake sure to watch until chapter 3 where we cover the secret shortcut that saved me over 10 hours every week!`,
      chapters: [
        `00:00 - Introduction & The Big Problem with ${topic}`,
        `01:45 - The Common Mistake Everyone Makes`,
        `04:10 - Step 1: The Essential Foundation`,
        `07:30 - Step 2: The Core Workflow Walkthrough`,
        `10:50 - The Secret Shortcut Nobody Talks About`,
        `13:20 - Final Checklist & Next Steps`,
      ],
      linksPlaceholder: `🔗 RESOURCES & TEMPLATES:\n• Free ${topic} Cheatsheet: https://creatorai.app/free-template\n• Join our Community of Creators: https://creatorai.app/community\n• CreatorAI Content Suite: https://creatorai.app`,
      hashtags: `#${topic.replace(/[^a-zA-Z0-9]/g, '')} #YouTubeGrowth #${niche.replace(/[^a-zA-Z0-9]/g, '')} #ContentCreation #CreatorAI`,
    },
    tags: [
      topic.toLowerCase(),
      `how to ${topic.toLowerCase()}`,
      `${topic.toLowerCase()} tutorial`,
      `${topic.toLowerCase()} for beginners`,
      `best way to ${topic.toLowerCase()}`,
      `${topic.toLowerCase()} 2026`,
      `${topic.toLowerCase()} tips and tricks`,
      `${niche.toLowerCase()} guide`,
      'creator tools',
      'youtube seo',
      'high ctr titles',
      'viral video strategy',
    ],
    tagsRaw: `${topic.toLowerCase()}, how to ${topic.toLowerCase()}, ${topic.toLowerCase()} tutorial, ${topic.toLowerCase()} for beginners, best way to ${topic.toLowerCase()}, ${topic.toLowerCase()} 2026, ${topic.toLowerCase()} tips and tricks, ${niche.toLowerCase()} guide, creator tools, youtube seo, high ctr titles, viral video strategy`,
    keywords: {
      primary: [`${topic.toLowerCase()} tutorial`, `how to master ${topic.toLowerCase()}`],
      secondary: [`best tools for ${topic.toLowerCase()}`, `${topic.toLowerCase()} for creators`],
      longTail: [`how to get started with ${topic.toLowerCase()} in 2026`, `step by step ${topic.toLowerCase()} guide for beginners`],
    },
    thumbnailIdeas: [
      {
        concept: 'The Transformation Shock',
        overlayText: 'DON’T DO THIS!',
        visualLayout: `Creator looking shocked pointing at a red X crossing out old messy timeline, contrasted with a glowing green checkmark.`,
        facialExpression: 'Eyes wide, genuine disbelief, mouth open slightly.',
        colorContrastAdvice: 'Bright neon crimson and yellow bold typography with black border for mobile clarity.',
      },
      {
        concept: 'The Secret Revealed',
        overlayText: '10X FASTER',
        visualLayout: `Creator holding glowing laptop with purple-blue light beam illuminating face, minimal dark background.`,
        facialExpression: 'Confident, knowing smile gesturing towards the screen.',
        colorContrastAdvice: 'Electric cyan text with soft violet backlight accent.',
      },
      {
        concept: 'The Big Comparison',
        overlayText: 'OLD vs NEW',
        visualLayout: `Split screen: dark grey left side with messy paper piles, radiant right side with clean automated dashboard.`,
        facialExpression: 'Side-eye warning glance toward old method.',
        colorContrastAdvice: 'White bold font with yellow highlight on "NEW" word.',
      },
    ],
  };
}

// 3. Demo Social Captions
export function generateDemoSocialCaptions(params: {
  topic: string;
  platform?: string;
  tone?: string;
  goal?: string;
}): SocialCaptionsData {
  const topic = cleanTopic(params.topic, 'Content Creator Growth');
  const platform = params.platform || 'Instagram';

  return {
    platform,
    captions: [
      {
        style: 'Hook & Relatable Story',
        caption: `I used to think mastering ${topic} required endless hours of grind...\n\nUntil I discovered that the top 1% don't work harder—they just use smarter systems.\n\nHere are 3 rules that changed everything:\n\n1️⃣ Simplify before you scale.\n2️⃣ Document the process instead of inventing from scratch.\n3️⃣ Consistency always beats random motivation.\n\nIf you are feeling stuck with ${topic}, start by picking just ONE bottleneck to fix today.\n\nSave this post for when you need a reset! 📌 What's your current biggest hurdle? Let me know below! 👇`,
        characterCount: 520,
        bestFor: 'Maximum comments, bookmarks, and algorithmic engagement',
      },
      {
        style: 'Short & Punchy (Viral Scroller)',
        caption: `Stop overcomplicating ${topic}. ⚡\n\nBuild the habit first. Optimize the details second. Scale the results third.\n\nDouble tap if you needed this reminder today! ❤️`,
        characterCount: 175,
        bestFor: 'Fast feeds, Reels/Shorts captions, high shares',
      },
      {
        style: 'Actionable Bullet List (Authority)',
        caption: `The 3-point cheat sheet for ${topic} in 2026:\n\n• Rule #1: Action creates clarity—waiting creates doubt.\n• Rule #2: Focus on input habits rather than obsessing over daily metrics.\n• Rule #3: Protect your creative energy by templatizing repetitive tasks.\n\nBookmark this post so it's ready for your next session! 🔖✨`,
        characterCount: 360,
        bestFor: 'High save rate, educational carousels, authority building',
      },
    ],
    promotionalPost: {
      headline: `🚀 WANT TO 10X YOUR RESULTS WITH ${topic.toUpperCase()}?`,
      body: `Tired of wasting hours trying to figure out ${topic} on your own?\n\nOur complete step-by-step toolkit gives you tested templates, workflows, and actionable guides so you can achieve results in a fraction of the time.\n\nNo fluff. Just proven systems that work.`,
      callToAction: `Comment "${topic.split(' ')[0].toUpperCase() || 'GROW'}" below and I will DM you free instant access!`,
    },
    hashtags: {
      trending: [`#${topic.replace(/[^a-zA-Z0-9]/g, '')}`, `#CreatorEconomy`, `#ProductivityTips`, `#DigitalCreators`],
      niche: [`#${topic.replace(/[^a-zA-Z0-9]/g, '')}Tips`, `#GrowthHacks`, `#OnlineCreators`, `#ContentStrategy`],
      community: [`#CreatorsOfInstagram`, `#SolopreneurJourney`, `#BuildInPublic`],
      allCombined: `#${topic.replace(/[^a-zA-Z0-9]/g, '')} #CreatorEconomy #ProductivityTips #DigitalCreators #${topic.replace(/[^a-zA-Z0-9]/g, '')}Tips #GrowthHacks #OnlineCreators #ContentStrategy #CreatorsOfInstagram #SolopreneurJourney`,
    },
    engagementQuestions: [
      `What is the #1 thing holding you back from mastering ${topic}?`,
      `Would you rather spend 1 hour daily on ${topic} or batch record 5 hours on weekends?`,
    ],
    bestTimeTip: `Post during peak evening engagement (7:00 PM - 9:00 PM) or lunchtime (12:00 PM - 1:30 PM). Reply to early comments within 20 minutes to jump-start the feed algorithm.`,
  };
}

// 4. Demo Video Planner
export function generateDemoVideoPlan(params: {
  concept: string;
  format?: string;
  targetDuration?: string;
  visualStyle?: string;
}): VideoPlanData {
  const concept = cleanTopic(params.concept, 'Productivity Workflow System');
  const targetDuration = params.targetDuration || '60 seconds';
  const visualStyle = params.visualStyle || 'Cinematic lighting, warm studio accents, smooth movement';

  return {
    projectTitle: `The Ultimate Breakdown: ${concept}`,
    synopsis: `A dynamic, high-engagement visual breakdown showcasing the core transformation of ${concept} through contrast, demonstration, and actionable payoff.`,
    targetDuration,
    visualStyle,
    totalScenes: 5,
    scenes: [
      {
        sceneNumber: 1,
        name: 'Cold Open & Pattern Interrupt',
        durationSeconds: 6,
        visualPrompt: `Close-up shot on creator face with sudden camera whip-pan. Warm rim light contrasting with dark moody studio background. Hand gestures urgently toward camera.`,
        voiceover: `Stop wasting your time doing ${concept} the wrong way. Here is the 60-second fix.`,
        audioSfx: `Sharp digital whoosh transition into energetic low-tempo synth bassline.`,
        onScreenGraphics: `'STOP THIS MISTAKE' bold kinetic text banner`,
        cameraAngle: `Eye-level 35mm, quick punch zoom on second 3`,
      },
      {
        sceneNumber: 2,
        name: 'The Problem & Tension',
        durationSeconds: 10,
        visualPrompt: `Over-the-shoulder shot showing cluttered workspace, messy timeline, or stressed expression, demonstrating the frustration of disorganized ${concept}.`,
        voiceover: `Most people spend hours overthinking every single detail, but get zero tangible momentum.`,
        audioSfx: `Subtle clock ticking audio, low sub-bass rumble.`,
        onScreenGraphics: `Red downward arrow + 'FRUSTRATION LOOP' label`,
        cameraAngle: `Over-the-shoulder medium shot (50mm f/2.0)`,
      },
      {
        sceneNumber: 3,
        name: 'The Breakthrough (Core Solution)',
        durationSeconds: 20,
        visualPrompt: `High-energy transition to clean, organized desk setup. Top-down view showing step-by-step framework diagram being revealed with highlighter pen.`,
        voiceover: `The secret is simple: break ${concept} into 3 non-negotiables. Step one: Plan the hook. Step two: Deliver value without fluff. Step three: Reward attention.`,
        audioSfx: `Three distinct chiming success sounds on each step reveal.`,
        onScreenGraphics: `Animated 3-step numbered card badges`,
        cameraAngle: `Direct 90-degree overhead flat lay`,
      },
      {
        sceneNumber: 4,
        name: 'Live Demonstration & Proof',
        durationSeconds: 14,
        visualPrompt: `Side-profile shot with cinematic neon purple backlighting. Screen recording inset shows rapid completion and clean metrics.`,
        voiceover: `Notice how applying this single rule reduces your production time by 60% while doubling viewer engagement.`,
        audioSfx: `Upbeat musical crescendo, clean snap effect on graphic pop.`,
        onScreenGraphics: `'60% TIME SAVED' green metric counter`,
        cameraAngle: `Side-profile 50mm shallow depth of field`,
      },
      {
        sceneNumber: 5,
        name: 'Payoff & Call-to-Action',
        durationSeconds: 10,
        visualPrompt: `Creator turns back to camera, smiles warmly, and gives a confident nod while tapping desk with pen.`,
        voiceover: `Save this plan before your next recording session, and follow for part two where we break down the exact templates!`,
        audioSfx: `Smooth musical fade out, subtle follow chime.`,
        onScreenGraphics: `'SAVE & FOLLOW' glowing animated icon`,
        cameraAngle: `Medium portrait shot (85mm)`,
      },
    ],
    productionTips: [
      `Keep key lighting at 45 degrees to avoid harsh shadows on face while maintaining crisp eye reflections.`,
      `Record audio with microphone 5-6 inches away from mouth to avoid room reverb and echo.`,
      `Cut all pauses longer than 0.3 seconds in editing to keep pacing snappy and maintain 85%+ retention.`,
    ],
    gearRecommendations: `Smartphone 4K 24fps or mirrorless camera, ring light or softbox key, USB or wireless lavalier microphone.`,
  };
}

// 5. Demo Content Ideas
export function generateDemoContentIdeas(params: {
  niche: string;
  targetPlatform?: string;
  ideaCategory?: string;
}): ContentIdeasData {
  const niche = cleanTopic(params.niche, 'AI & Digital Creators');

  return {
    niche,
    marketInsight: `Creators in ${niche} focusing on actionable frameworks and authentic transparency are seeing 2.8x higher save and share rates this season.`,
    ideas: [
      {
        id: 1,
        title: `The 10-Minute ${niche} Shortcut Nobody Talks About`,
        type: 'video',
        format: 'Short-Form Reel / TikTok',
        targetAudience: `Beginners seeking quick, actionable wins`,
        hook: `I used to spend 6 hours doing ${niche} until an industry veteran taught me this 1 rule...`,
        conceptSummary: `A fast-paced teardown comparing the traditional painful method with a modern streamlined 3-step shortcut.`,
        whyItWorks: `Solves the primary friction point (time and overwhelm) while leveraging an authority hook.`,
        difficulty: 'Easy',
        potentialImpact: 'Viral Top-of-Funnel Reach (150K+ Views)',
        monetizationAngle: `Link in bio to a $19 beginner checklist or template.`,
      },
      {
        id: 2,
        title: `How to Build a $3K/Mo Business Around ${niche} in 2026`,
        type: 'video',
        format: 'Long-Form YouTube Video (12-15 mins)',
        targetAudience: `Entrepreneurs and creators looking to monetize`,
        hook: `You don't need 100,000 followers to make a full-time living in ${niche}. Here is the math.`,
        conceptSummary: `Comprehensive blueprint breaking down audience building, digital packaging, and pricing strategies.`,
        whyItWorks: `Specific numbers and transparent unit economics trigger high watch time and trust.`,
        difficulty: 'Medium',
        potentialImpact: 'High AdSense & Long-Tail Search Traffic',
        monetizationAngle: `High-ticket consulting or cohort community membership.`,
      },
      {
        id: 3,
        title: `The 5 Biggest Mistakes Killing Your Growth in ${niche}`,
        type: 'social',
        format: 'Multi-Slide Carousel / Thread',
        targetAudience: `Intermediate creators stuck at a plateau`,
        hook: `Most people in ${niche} work harder every week and wonder why their numbers stay flat. Stop doing these 5 things:`,
        conceptSummary: `A teardown of common misconceptions with clear alternative actions for each slide.`,
        whyItWorks: `Negative framing and loss aversion trigger massive bookmarking and saves.`,
        difficulty: 'Easy',
        potentialImpact: 'High Saves & Algorithmic Discovery',
        monetizationAngle: `Newsletter sign-up CTA at slide 10.`,
      },
      {
        id: 4,
        title: `${niche} OS: Plug-and-Play Digital Toolkit`,
        type: 'business',
        format: 'Digital Product / Notion System ($27)',
        targetAudience: `Busy professionals who want organized systems`,
        hook: `Organize your entire ${niche} workflow in under 15 minutes.`,
        conceptSummary: `A turnkey Notion or Google Sheet hub with automated checklists, trackers, and prompt libraries.`,
        whyItWorks: `Solves chaos with an instantly downloadable, zero-fulfillment asset.`,
        difficulty: 'Medium',
        potentialImpact: '$1,500 - $4,000/Month Passive Income',
        monetizationAngle: `Direct sales via Gumroad or Stripe.`,
      },
      {
        id: 5,
        title: `Transparent Case Study: My First 30 Days in ${niche}`,
        type: 'social',
        format: 'Story Carousel / Case Study',
        targetAudience: `Curious peers and aspiring beginners`,
        hook: `Here are the exact numbers, wins, and failures from my 30-day ${niche} experiment.`,
        conceptSummary: `Radical transparency post sharing real screenshots, analytics, lessons learned, and next steps.`,
        whyItWorks: `Authentic proof converts at 3x higher rates than theoretical advice.`,
        difficulty: 'Easy',
        potentialImpact: 'High Trust & Inbound Sponsorship Inquiries',
        monetizationAngle: `Affiliate product recommendations and partnerships.`,
      },
      {
        id: 6,
        title: `Weekly Curated ${niche} Intelligence Newsletter`,
        type: 'business',
        format: 'Paid Subscription ($7/mo)',
        targetAudience: `Agencies and serious practitioners`,
        hook: `Get the top 1% trends and tools in ${niche} delivered to your inbox every Monday morning.`,
        conceptSummary: `High-signal weekly dispatch curating algorithm shifts, case studies, and opportunities.`,
        whyItWorks: `Compounding recurring revenue with high retention and minimal overhead.`,
        difficulty: 'Advanced',
        potentialImpact: '$3,000+ Monthly Recurring Revenue (MRR)',
        monetizationAngle: `Paid Substack / Beehiiv subscription.`,
      },
    ],
  };
}

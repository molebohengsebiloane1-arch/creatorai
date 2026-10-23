import {
  VideoScriptData,
  YouTubePackageData,
  SocialCaptionsData,
  VideoPlanData,
  ContentIdeasData,
} from '../types';

export const SAMPLE_VIDEO_SCRIPT: VideoScriptData = {
  title: "5 AI Tools That Will Save You 10 Hours Every Single Week",
  platform: "YouTube",
  estimatedDuration: "60 seconds",
  targetAudience: "Content creators, entrepreneurs, freelancers",
  hookOptions: [
    {
      type: "Curiosity Hook",
      spokenLine: "If you are still editing videos, writing captions, and doing research by hand in 2026, you are wasting 10 hours every week.",
      visualAction: "Creator looks urgently into lens, holding a phone showing an analytics timer ticking down rapidly."
    },
    {
      type: "Problem / Agitation Hook",
      spokenLine: "Most creators burn out not from making content, but from the 14 tedious admin steps behind every upload.",
      visualAction: "Quick cut of overwhelmed creator drowning in browser tabs and open editing timelines."
    },
    {
      type: "Bold Statement Hook",
      spokenLine: "Here are 5 secret AI workflows that completely automated my weekly content production.",
      visualAction: "Screen flashes with 5 glowing app icons with kinetic neon purple border."
    }
  ],
  scriptSections: [
    {
      sectionName: "Pattern Interrupt & Intro",
      duration: "0:00 - 0:08",
      spokenWords: "Stop spending whole weekends creating content. Today, you're getting the exact 5-part AI toolkit top creators use to 10x their output.",
      visualNotes: "Punchy zoom-in on face, vibrant studio lighting with blue-purple backlights.",
      screenText: "SAVE 10 HOURS/WEEK"
    },
    {
      sectionName: "Tool 1 & 2: Instant Research & Scripting",
      duration: "0:08 - 0:26",
      spokenWords: "Tool 1: CreatorAI for generating viral hooks, retention-first scripts, and shot lists in 30 seconds. Tool 2: Descript for automated filler word removal and instant multicam rough cuts.",
      visualNotes: "Split-screen screen capture showing prompt running and instant polished output generated.",
      screenText: "1. CREATORAI | 2. DESCRIPT"
    },
    {
      sectionName: "Tool 3 & 4: Visuals & Auto-Repurposing",
      duration: "0:26 - 0:45",
      spokenWords: "Tool 3: Opus Clip to slice one long video into 10 viral Shorts with auto-captions and face tracking. Tool 4: Midjourney for thumbnail background concepts that pop off mobile feeds.",
      visualNotes: "Dynamic kinetic swipe transition showcasing short clips with bouncy yellow subtitles.",
      screenText: "3. OPUS CLIP | 4. MIDJOURNEY"
    },
    {
      sectionName: "Tool 5 & Payoff Workflow",
      duration: "0:45 - 0:55",
      spokenWords: "Tool 5: Notion AI to organize your publishing pipeline so you never run out of ideas again. Connect these together, and your production time drops by 70%.",
      visualNotes: "Smooth Kanban board panning shot showing completed video cards moving to 'Published'.",
      screenText: "5. NOTION AI HUB"
    }
  ],
  callsToAction: [
    {
      goal: "Follow / Subscribe",
      phrase: "Drop a follow for part 2 where I demonstrate my 5-minute thumbnail workflow step-by-step.",
      visualCue: "Creator points down right to the follow button with glowing animated cursor."
    },
    {
      goal: "Comment Section Engagement",
      phrase: "Which of these 5 tools have you already tried? Let me know down in the comments!",
      visualCue: "Animated comment box bubble pops onto screen with sound chime."
    }
  ],
  audioAndMusicVibe: "Upbeat modern synthwave lofi, 122 BPM, subtle sidechain compression on kicks.",
  viralRetentionTips: [
    "Cut every pause longer than 0.3 seconds using ripple delete to keep viewer velocity above 85%.",
    "Change the on-screen camera angle or text graphics every 3.5 seconds to reset viewer attention spans.",
    "Place the biggest golden nugget in the second half to guarantee high completion rate."
  ]
};

export const SAMPLE_YOUTUBE_PACKAGE: YouTubePackageData = {
  titles: [
    {
      title: "I Automated My Entire YouTube Channel With AI (Results in 30 Days)",
      style: "High-CTR Curiosity Gap",
      estimatedCTR: "14.2% Estimated CTR",
      reason: "Creates intense curiosity about real experiment results without feeling like clickbait."
    },
    {
      title: "How to Make YouTube Videos 10x Faster Using AI in 2026",
      style: "Search & SEO Optimized",
      estimatedCTR: "11.8% Search Intent",
      reason: "Targets high-intent queries from creators actively searching for productivity solutions."
    },
    {
      title: "5 AI Tools That Made My Faceless Channel $8,400/Month",
      style: "Proof & Transformation",
      estimatedCTR: "15.6% Viral Potential",
      reason: "Specific dollar amount and timeframe provide irresistible tangible social proof."
    },
    {
      title: "Stop Making YouTube Videos The Old Way! (Do This Instead)",
      style: "Urgency / Negative Hook",
      estimatedCTR: "13.4% Contrarian",
      reason: "Triggers fear of missing out and warns viewers their current workflow is obsolete."
    },
    {
      title: "The Ultimate AI Content Creator Starter Pack (Free Tools Only)",
      style: "Beginner-Friendly Value",
      estimatedCTR: "12.5% High Save Rate",
      reason: "'Free tools only' removes financial friction and attracts large beginner audiences."
    }
  ],
  description: {
    aboveTheFold: "Learn how to build a complete AI-powered content creation workflow in 2026 without sacrificing quality or authenticity. Get the complete free tool list below ⬇️",
    summary: "Creating consistent YouTube content used to take 20-30 hours per week. In this comprehensive masterclass, I break down the exact software stack, prompt architectures, and editing pipeline that allowed me to publish 3 high-quality videos every week in under 4 hours total.\n\nWhether you run a personal brand, a faceless channel, or an educational series, these tools will help you research faster, script sharper hooks, and automate tedious post-production steps.",
    chapters: [
      "00:00 - The Content Creator Burnout Problem",
      "01:30 - Tool #1: AI Scriptwriting & Viral Hooks",
      "04:15 - Tool #2: High-Velocity Video Editing",
      "07:45 - Tool #3: Thumbnail Psychology & Text Concepts",
      "10:20 - Tool #4: Metadata & SEO Optimization",
      "12:50 - Live 15-Minute Video Build",
      "15:30 - Final Verdict & Free Workflow Checklist"
    ],
    linksPlaceholder: "🔗 RESOURCES & LINKS MENTIONED:\n• CreatorAI Content Suite: https://creatorai.app\n• Free 2026 Creator Toolkit (PDF): https://creatorai.app/free-guide\n• Join our Discord of 15,000+ Creators: https://creatorai.app/community",
    hashtags: "#CreatorAI #YouTubeGrowth #AIContentCreation #VideoEditing #ContentStrategy"
  },
  tags: [
    "ai content creation",
    "youtube automation",
    "how to make youtube videos with ai",
    "ai video editor",
    "content creator tools",
    "creator ai",
    "best ai tools 2026",
    "youtube growth tips",
    "video script generator",
    "youtube seo tutorial",
    "increase youtube ctr",
    "thumbnail design ideas",
    "ai workflow for creators"
  ],
  tagsRaw: "ai content creation, youtube automation, how to make youtube videos with ai, ai video editor, content creator tools, creator ai, best ai tools 2026, youtube growth tips, video script generator, youtube seo tutorial, increase youtube ctr, thumbnail design ideas, ai workflow for creators",
  keywords: {
    primary: ["ai content creation", "youtube tools for creators", "ai video script generator"],
    secondary: ["video workflow automation", "increase youtube watch time", "high ctr thumbnail ideas"],
    longTail: ["how to automate youtube channel with ai tools", "best free ai tools for youtube creators 2026"]
  },
  thumbnailIdeas: [
    {
      concept: "The Extreme Contrast Transformation",
      overlayText: "10X FASTER!",
      visualLayout: "Creator with mouth open in disbelief holding glowing laptop emitting purple light beam. Left side is dark grey with 'Old Way (30 hrs)', right side is electric neon blue 'With AI (3 hrs)'.",
      facialExpression: "Intensely astonished, wide eyes focused straight toward camera.",
      colorContrastAdvice: "Electric yellow bold font with thick black stroke and slight purple drop shadow."
    },
    {
      concept: "The Secret Weapon Reveal",
      overlayText: "DON'T SLEEP ON THIS",
      visualLayout: "Close up framing with blurred background, creator pointing finger at glowing holographic floating CreatorAI icon.",
      facialExpression: "Intrigued, whispering secret gesture.",
      colorContrastAdvice: "Vibrant cyan text with warm magenta backlighting."
    },
    {
      concept: "The Big Mistake Red Alert",
      overlayText: "STOP DOING THIS!",
      visualLayout: "Big bold red diagonal ribbon tape over messy timeline, contrasted with ultra-clean modern minimalist phone screen.",
      facialExpression: "Warning hand-stop gesture.",
      colorContrastAdvice: "High-visibility crimson red and white typography."
    }
  ]
};

export const SAMPLE_SOCIAL_CAPTIONS: SocialCaptionsData = {
  platform: "Instagram",
  captions: [
    {
      style: "Hook & Value Story",
      caption: "I used to spend 4 hours staring at a blank Google Doc every Monday trying to write content... 🤦‍♂️\n\nUntil I realized the top 1% of creators don't rely on random inspiration.\n\nThey rely on proven systems:\n\n1️⃣ Capture raw thoughts as voice notes instantly.\n2️⃣ Run them through AI to extract 3 unique angles.\n3️⃣ Match every idea to a high-converting hook template.\n4️⃣ Batch-record all 5 videos in a 90-minute sprint.\n\nSystems beat willpower every single time.\n\nIf you want to spend more time building and less time overthinking, start with step 1.\n\nWhat’s your biggest bottleneck right now: ideas or editing? Drop a comment below! 👇",
      characterCount: 618,
      bestFor: "Building high authority, generating comments & bookmarks"
    },
    {
      style: "Short & Punchy",
      caption: "Consistency isn’t about motivation. It’s about making creation so frictionless you can’t make an excuse. ⚡\n\nBuild the system once. Reap the compound interest forever.\n\nSave this reminder for your next low-energy day. 📌",
      characterCount: 224,
      bestFor: "Fast mobile scrolling, high share rate, aesthetic carousels"
    },
    {
      style: "Educational Step-by-Step",
      caption: "3 content creation rules I wish I knew before spending 2 years getting zero views:\n\n1. The first 3 seconds are 80% of your video. If the hook is weak, nobody will hear your golden advice.\n2. Audio quality matters 2x more than camera 4K resolution. People will forgive a 1080p camera, but will swipe instantly on echoey audio.\n3. Give away your secrets for free; charge for the implementation.\n\nBookmark this post so you have it ready before your next recording session! 🔖✨",
      characterCount: 462,
      bestFor: "Maximum bookmarks/saves, algorithmic recommendation"
    }
  ],
  promotionalPost: {
    headline: "🚀 READY TO 10X YOUR CONTENT OUTPUT?",
    body: "Tired of spending your entire weekend brainstorming hooks and editing scripts?\n\nMeet CreatorAI: the all-in-one assistant designed to turn a single topic into viral video scripts, SEO titles, and scene-by-scene plans in 30 seconds flat.\n\nTry it 100% free today — no credit card needed.",
    callToAction: "Comment 'CREATOR' below and I'll send you instant access!"
  },
  hashtags: {
    trending: ["#ContentCreator", "#CreatorEconomy", "#SocialMediaTips", "#DigitalCreator"],
    niche: ["#ContentStrategy", "#VideoMarketing", "#CreatorTools", "#GrowOnInstagram"],
    community: ["#CreatorsOfInstagram", "#SolopreneurLife", "#ContentHacks"],
    allCombined: "#ContentCreator #CreatorEconomy #SocialMediaTips #DigitalCreator #ContentStrategy #VideoMarketing #CreatorTools #GrowOnInstagram #CreatorsOfInstagram #SolopreneurLife"
  },
  engagementQuestions: [
    "What's one content task you wish you could automate forever?",
    "Do you prefer batching your videos on weekends or creating daily?"
  ],
  bestTimeTip: "Post Tuesday & Thursday between 11:30 AM - 1:00 PM or 7:00 PM - 9:00 PM in your target audience's timezone. Reply to all comments within the first 30 minutes to boost algorithmic velocity."
};

export const SAMPLE_VIDEO_PLAN: VideoPlanData = {
  projectTitle: "The 30-Second Morning Productivity Reset",
  synopsis: "A fast-paced, highly aesthetic morning routine breakdown showing how a simple 3-step micro habit eliminates phone scrolling and sets up 4 hours of deep focus.",
  targetDuration: "45-60 seconds",
  visualStyle: "Moody cinematic lofi, warm desk lamp lighting, smooth subtle whip-pans",
  totalScenes: 5,
  scenes: [
    {
      sceneNumber: 1,
      name: "The Phone Alarm Trap (Hook)",
      durationSeconds: 6,
      visualPrompt: "Macro close-up shot of hand reaching for vibrating smartphone on nightstand in dim bedroom. Quick speed ramp zoom as screen illuminates the tired face.",
      voiceover: "The moment you check notifications in bed, your brain belongs to everyone else.",
      audioSfx: "Distorted phone vibration buzzing SFX, sharp high-frequency whoosh",
      onScreenGraphics: "'STOP THIS FIRST' glowing red warning badge",
      cameraAngle: "Low-angle extreme close-up (macro 24mm)"
    },
    {
      sceneNumber: 2,
      name: "The 30-Second Swap",
      durationSeconds: 10,
      visualPrompt: "Smooth whip pan to creator stepping onto hardwood floor, pouring a tall glass of water with lemon slice falling in slow motion (120fps).",
      voiceover: "Instead of dopamine scrolling, do the 30-second physiological reset. Cold water, sunlight in your eyes, 5 deep breaths.",
      audioSfx: "Crisp water splash SFX, warm ambient acoustic guitar swell",
      onScreenGraphics: "Step 1: Hydrate + Natural Light (Checkmark)",
      cameraAngle: "Medium tracking side shot"
    },
    {
      sceneNumber: 3,
      name: "The 3-Priority Desk Setup",
      durationSeconds: 15,
      visualPrompt: "Overhead top-down desk shot. Minimalist mechanical keyboard, black notebook opening, fountain pen writing down only 3 bullet items.",
      voiceover: "Write down your 3 non-negotiables before you ever open Slack or email. If everything is urgent, nothing gets done.",
      audioSfx: "Satisfying fountain pen paper scratch audio, subtle lo-fi drum beat drops in",
      onScreenGraphics: "RULE OF 3: Focus > Busyness",
      cameraAngle: "Direct 90-degree flat lay top-down camera"
    },
    {
      sceneNumber: 4,
      name: "Deep Work Flow Execution",
      durationSeconds: 15,
      visualPrompt: "Side-profile shot with warm amber backlighting. Creator puts on noise-cancelling headphones, hits a physical mechanical timer set to 45:00.",
      voiceover: "Put your phone in another room. Set a 45-minute sprint. You will get more done before 10 AM than most people do all day.",
      audioSfx: "Mechanical timer click SFX, synth bassline progression",
      onScreenGraphics: "'45 MIN SPRINT' countdown overlay",
      cameraAngle: "Cinematic 50mm f/1.8 shallow depth of field"
    },
    {
      sceneNumber: 5,
      name: "Payoff & Call-To-Action",
      durationSeconds: 9,
      visualPrompt: "Creator closes notebook with confident smile, glances up to camera and taps the desk with pen.",
      voiceover: "Try this tomorrow morning and feel the difference. Follow for more daily creator workflows.",
      audioSfx: "Soft guitar outro resolve, follow chime SFX",
      onScreenGraphics: "'SAVE THIS FOR TOMORROW' + Follow icon animation",
      cameraAngle: "Medium eye-level shot"
    }
  ],
  productionTips: [
    "Lighting: Use a single key light bounced against a white wall for soft morning ambience, plus a 2700K warm desk lamp for depth.",
    "Audio: Record voiceover using a dynamic cardioid mic 4 inches away with pop filter; keep room reverb minimal.",
    "B-Roll: Capture all action shots at 60fps or 120fps so you can slow down the water pour and notebook writing."
  ],
  gearRecommendations: "Smartphone or mirrorless camera (4K 24fps for A-roll, 60fps for B-roll), 50mm lens, mini tabletop tripod, wireless lavalier microphone."
};

export const SAMPLE_CONTENT_IDEAS: ContentIdeasData = {
  niche: "AI & Digital Creators",
  marketInsight: "Creators who leverage AI for workflow acceleration are currently gaining subscribers 3.4x faster than those using traditional manual workflows.",
  ideas: [
    {
      id: 1,
      title: "The 10-Minute Video Editing Secret Top Channels Keep Hidden",
      type: "video",
      format: "YouTube Shorts / TikTok",
      targetAudience: "Aspiring video editors and solo YouTubers",
      hook: "I used to spend 6 hours editing a 5-minute video until an editor with 2M subs taught me this rule...",
      conceptSummary: "Showcase the '3-point ripple delete' and template hotkeys that cut editing time in half without changing your software.",
      whyItWorks: "Promises insider knowledge from an authority figure while solving the biggest creator pain point (editing time).",
      difficulty: "Easy",
      potentialImpact: "Viral Reach (250K+ Views)",
      monetizationAngle: "Promote an editing presets / keyboard shortcuts cheat sheet ($19)."
    },
    {
      id: 2,
      title: "How to Build a $5K/Mo Faceless Channel From Scratch (Full 2026 Guide)",
      type: "video",
      format: "Long-form 15-Minute YouTube Video",
      targetAudience: "Side hustlers, camera-shy creators, digital nomads",
      hook: "You don't need a $2,000 camera or even your face to build a 6-figure channel in 2026.",
      conceptSummary: "Step-by-step masterclass covering niche selection, script generation, ethical AI voiceover, dynamic B-roll sourcing, and monetization.",
      whyItWorks: "Massive search volume with timeless evergreen interest and high viewer retention.",
      difficulty: "Medium",
      potentialImpact: "High Search & AdSense Revenue",
      monetizationAngle: "Affiliate links to creation tools + premium cohort community."
    },
    {
      id: 3,
      title: "The 'Hook Vault' Thread: 20 Openers That Guaranteed 100K+ Views",
      type: "social",
      format: "X / LinkedIn Carousel & Thread",
      targetAudience: "Copywriters, marketers, content founders",
      hook: "Most creators spend 8 hours on a video and 30 seconds on the hook. That's why they fail.",
      conceptSummary: "Categorize 20 viral hooks into Curiosity, Controversy, Relatability, and Transformation with fill-in-the-blank examples.",
      whyItWorks: "Actionable swipe-file content triggers massive saves, bookmarks, and reposts.",
      difficulty: "Easy",
      potentialImpact: "Viral Reposts & Follower Growth",
      monetizationAngle: "Newsletter lead magnet CTA."
    },
    {
      id: 4,
      title: "Creator OS: Notion Dashboard for Content Batching",
      type: "business",
      format: "Digital Product / Template ($29)",
      targetAudience: "Overwhelmed creators managing multiple platforms",
      hook: "How I manage 4 social accounts in 2 hours a week without burning out.",
      conceptSummary: "A clean Notion template with idea inbox, script drafts, publishing calendar, sponsor CRM, and analytics tracker.",
      whyItWorks: "Solves chaos with a tangible, ready-to-use digital organization system.",
      difficulty: "Medium",
      potentialImpact: "$2,000 - $6,000/Month Passive Income",
      monetizationAngle: "Direct sales via Gumroad or Lemon Squeezy."
    },
    {
      id: 5,
      title: "Income Breakdown: Exactly What My 50K Channel Made Last Month",
      type: "social",
      format: "Multi-Slide Instagram Carousel / Short Reel",
      targetAudience: "Curious creators and entrepreneurial audience",
      hook: "People think 50,000 followers makes you rich. Here are the exact numbers (transparent proof).",
      conceptSummary: "Break down AdSense, sponsorships, digital product sales, and affiliates down to the dollar.",
      whyItWorks: "Radical financial transparency generates extraordinary trust and algorithmic watch time.",
      difficulty: "Easy",
      potentialImpact: "High Authority & Brand Sponsorship Deals",
      monetizationAngle: "Inbound brand partnership inquiries and high-ticket consulting."
    },
    {
      id: 6,
      title: "Micro-SaaS or Prompt Curation Subscription for Niche Creators",
      type: "business",
      format: "Paid Weekly Newsletter ($9/mo)",
      targetAudience: "Pro creators and marketing agencies",
      hook: "Get 15 tested viral hooks and video concepts in your niche every Monday morning.",
      conceptSummary: "Weekly curated intelligence dispatch delivering fresh algorithm trends, audio cues, and script templates for a specific niche.",
      whyItWorks: "Predictable recurring revenue (MRR) with zero inventory and high retention.",
      difficulty: "Advanced",
      potentialImpact: "$5,000+ MRR",
      monetizationAngle: "Recurring Stripe subscription."
    }
  ]
};

/* Eco XP: Operation Funan Sustainability Run
 * Front-end app for GitHub Pages.
 * Replace CONFIG.SCRIPT_URL after deploying Code.gs as a Google Apps Script web app.
 */

'use strict';

const APP_VERSION = '1.12.0';

const CONFIG = {
  SCRIPT_URL: 'https://script.google.com/macros/s/AKfycbwHLCHdv3oQwPXgcRPiqxTZ3c8QmSrh3dd6dU2Y6rHytZjrBiGKjEhds2bX4_HwLjDN/exec',
  EVENT_DATE_STAMP: '20260703',
  TEACHER_PIN_LOCAL_KEY: 'ecoXpTeacherPin',
  STORAGE_KEY: 'ecoXpFunanState_v1',
  TEACHER_BASE_LABEL: 'Teachers\' Base',
  PHOTO_REQUIRED_STATIONS: ['S1', 'S2', 'S5']
};

const ROUTES = {
  'Group 01': ['S1', 'S2', 'S5', 'S3', 'S4'],
  'Group 02': ['S2', 'S3', 'S5', 'S4', 'S1'],
  'Group 03': ['S3', 'S4', 'S5', 'S1', 'S2'],
  'Group 04': ['S4', 'S1', 'S5', 'S2', 'S3'],
  'Group 05': ['S1', 'S3', 'S5', 'S4', 'S2'],
  'Group 06': ['S2', 'S4', 'S5', 'S1', 'S3'],
  'Group 07': ['S3', 'S1', 'S5', 'S2', 'S4'],
  'Group 08': ['S4', 'S2', 'S5', 'S3', 'S1'],
  'Group 09': ['S1', 'S4', 'S3', 'S5', 'S2'],
  'Group 10': ['S2', 'S1', 'S4', 'S5', 'S3'],
  'Group 11': ['S3', 'S2', 'S1', 'S5', 'S4'],
  'Group 12': ['S4', 'S3', 'S2', 'S5', 'S1'],
  'Group 13': ['S1', 'S2', 'S3', 'S5', 'S4'],
  'Group 14': ['S3', 'S4', 'S1', 'S5', 'S2'],
  'Group IC': ['S1', 'S2', 'S3', 'S4', 'S5']
};

const UPGRADE_SLOTS = {
  S1: { slot: 'headgear', label: 'headgear upgrade', options: [
    { id: 'gardenHat', name: 'Garden Hat', emoji: '🪴' },
    { id: 'flowerHat', name: 'Flower Hat', emoji: '🌸' }
  ]},
  S2: { slot: 'carry', label: 'carry-item upgrade', options: [
    { id: 'toteBadge', name: 'Apple Basket', emoji: '🧺' },
    { id: 'judgeBadge', name: 'Balloons', emoji: '🎈' }
  ]},
  S3: { slot: 'movement', label: 'movement upgrade', options: [
    { id: 'tinyWheels', name: 'Red Skateboard', emoji: '🛹' },
    { id: 'greenSneakers', name: 'Bicycle', emoji: '🚲' }
  ]},
  S4: { slot: 'accent', label: 'accent upgrade', options: [
    { id: 'sgBruneiScarf', name: 'SG–Brunei Scarf', emoji: '🧣' },
    { id: 'cityBandana', name: 'Butterflies', emoji: '🦋' }
  ]},
  S5: { slot: 'side', label: 'side accessory', options: [
    { id: 'reusableBottle', name: 'Reusable Bottle', emoji: '💧' },
    { id: 'snackPouch', name: 'Backpack', emoji: '🎒' }
  ]}

};

const OTTER_ASSET_MAP = {
  gardenHat: { src: 'assets/otter/garden_hat.png', className: 'slot-head', z: 'front' },
  flowerHat: { src: 'assets/otter/flower_hat.png', className: 'slot-head', z: 'front' },
  toteBadge: { src: 'assets/otter/tote_badge.png', className: 'slot-left', z: 'front' },
  judgeBadge: { src: 'assets/otter/judge_badge.png', className: 'slot-chest', z: 'front' },
  tinyWheels: { src: 'assets/otter/tiny_wheels.png', className: 'slot-wheels', z: 'back' },
  greenSneakers: { src: 'assets/otter/mini_bicycle.png', className: 'slot-bike', z: 'back' },
  sgBruneiScarf: { src: 'assets/otter/sg_brunei_scarf.png', className: 'slot-right-neck', z: 'front' },
  cityBandana: { src: 'assets/otter/city_bandana.png', className: 'slot-neck', z: 'front' },
  reusableBottle: { src: 'assets/otter/reusable_bottle.png', className: 'slot-right-lower', z: 'front' },
  snackPouch: { src: 'assets/otter/snack_pouch.png', className: 'slot-front-lower', z: 'front' }
};


const OTTER_CANVAS = {
  width: 720,
  height: 760,
  base: { src: 'assets/otter/base_otter.png', x: 178, y: 30, w: 364, h: 710 },
  shadow: { x: 210, y: 682, w: 300, h: 36 },
  slots: {
    gardenHat: { x: 225, y: 8, w: 250, h: 160 },
    flowerHat: { x: 228, y: 16, w: 240, h: 118 },
    toteBadge: { x: 122, y: 320, w: 126, h: 164 },
    judgeBadge: { x: 314, y: 338, w: 78, h: 99 },
    tinyWheels: { x: 188, y: 548, w: 250, h: 102 },
    greenSneakers: { x: 122, y: 500, w: 470, h: 311 },
    sgBruneiScarf: { x: 332, y: 302, w: 112, h: 134 },
    cityBandana: { x: 236, y: 314, w: 118, h: 100 },
    reusableBottle: { x: 152, y: 516, w: 56, h: 120 },
    snackPouch: { x: 466, y: 510, w: 86, h: 104 }
  }
};

const LEARNING_CARDS = {

  S1: {
    title: 'Rooftop Rescue: Farm of the Future… or Forgotten Feature?',
    points: [
      'Urban farming can support food resilience, education, and awareness, especially in land-scarce cities.',
      'Farm-to-table systems can reduce transport distance and make food production more visible, but only if production and usage are active.',
      'Hydroponics and aquaponics require upkeep, technical knowledge, water management, and regular maintenance.',
      'A space can shift over time from productive or educational infrastructure into decorative greenery, storage, or symbolic “green” branding.',
      'Long-term sustainability depends on people and systems, not just the original design.'
    ],
    takeaway: 'A green space may look sustainable, but the real test is whether its purpose is still alive.'
  },
  S2: {
    title: 'Green Basket Battle: Buy Better… or Buy Less?',
    points: [
      'Green labels are not enough. Sustainability claims should be questioned.',
      'A product’s impact includes its full journey: materials, production, packaging, transport, use, durability, and disposal.',
      'Reusable products only help if they replace wasteful habits and are used many times.',
      'Buying a green product can still increase consumption if the item is unnecessary.',
      'Sustainable choices should be practical, accessible, and supported by clear evidence.'
    ],
    takeaway: 'The greenest choice is not always buying a greener product. Sometimes, it is buying less, using longer, or choosing better.'
  },
  S3: {
    title: 'Pedal Proof: Built to Move or Built to Show?',
    points: [
      'Walking and cycling are lower-impact forms of transport, while public transport can reduce impact per person by moving many passengers together.',
      'Private cars and ride-hailing vehicles usually have higher per-person impact, especially with one or few passengers.',
      'EVs can reduce some vehicle-related emissions, but they still use road space and do not solve congestion by themselves.',
      'Sustainable transport infrastructure needs to make lower-impact choices easier, safer, clearer, and more convenient.',
      'A transport feature can become symbolic or performative if it looks sustainable but does not change how people move.'
    ],
    takeaway: 'A sustainable transport feature should not just be seen. It should help people choose differently.'
  },
  S4: {
    title: 'One Building, Many Lives',
    points: [
      'Sustainability is not always visible. Some sustainability ideas are built into the arrangement of spaces.',
      'Mixed-use design can reduce unnecessary travel by placing different daily needs closer together.',
      'Town centres, neighbourhood hubs, transport hubs, and walkable districts use similar ideas beyond one building.',
      'Mixed-use design can support lower-carbon daily routines when people can walk, use public transport, and share spaces.',
      'Design alone may not be enough; access, behaviour, energy use, consumption, and crowding still matter.'
    ],
    takeaway: 'A sustainable city is not only about adding green things. It is also about arranging daily life so better choices become easier.'
  },
  S5: {
    title: 'Break Time: Green Choice or Green Confusion?',
    points: [
      'Convenience shapes everyday sustainability behaviour.',
      '“Eco” materials are not magic solutions. Paper, biodegradable, compostable, or recyclable items may still cause problems if they are over-packaged, contaminated, or disposed of wrongly.',
      'Recycling needs a whole system: clear sorting, empty containers, clean materials, and correct disposal.',
      'Less waste is often better than “better” waste. Reusable bottles, dine-in options, no straw, shared food, or minimal packaging can reduce impact.',
      'Daily choices reveal how sustainability works in real life, especially when people are tired, hungry, thirsty, or rushing.'
    ],
    takeaway: 'The best sustainable choice is not just the one that looks green. It is the one people can actually practise correctly and repeatedly.'
  }
};

const STATIONS = {
  S1: {
    title: 'Rooftop Rescue: Farm of the Future… or Forgotten Feature?',
    shortTitle: 'Rooftop Rescue',
    suggestedMinutes: 15,
    clue: `Your first checkpoint is hiding where the mall begins to breathe.

Look for the path where concrete gives way to leaves, and each step brings you closer to a space that once promised more than decoration.

If the air changes, you may be on the right track.`,
    hints: [
      'Find a staircase where greenery follows you upward.',
      'Look for the stairs near a place known for Peranakan food.',
      'As you climb, look for the garden name or logo along the way.',
      'Use the stairs near Godmama to reach the rooftop garden area.'
    ],
    checkin: {
      prompt: 'Using the place name shown at this checkpoint, enter the 2nd letter of the first word and the 4th letter of the second word.',
      placeholder: '',
      validator: value => {
        const compact = normalize(value).replace(/[^a-z]/g, '');
        return compact === 'rm';
      },
      expected: 'rm'
    },
    missionIntro: `You have found the Urban Farm.

An urban farm is more than a patch of greenery. It is a type of sustainability infrastructure that can help people see how food production, learning, and city life can be connected.

In a land-scarce city, urban farming can show how edible plants may be grown in compact spaces instead of only on large farms. It can also introduce visitors to growing systems such as hydroponics, where plants are grown using nutrient-rich water instead of soil.

Urban farms can support sustainability in several ways. They can make food production more visible, help people understand where food comes from, support education about plants and growing systems, and encourage people to think about food resilience.

Some urban farms may also connect to farm-to-table ideas. This means food grown nearby can be used or served close to where it is produced, reducing the distance between growing and eating while helping people appreciate the value of fresh produce.

Your mission:
Explore the Urban Farm carefully and investigate how well this space is serving its sustainability purpose today.`,
    steps: [
      { type: 'info', key: 's1ExploreViewed', title: 'Explore First', text: `Before answering, spend a few minutes exploring the Urban Farm.

Look carefully at:
- growing systems;
- edible plants or herbs;
- hydroponic channels;
- any aquaponics or tank areas;
- signs or labels;
- how visitors might learn from the space;
- whether the space looks actively used;
- whether some areas look decorative, empty, or changed.

Do not rush this step. Your later photo and response should be based on what your team actually observes.` },
      { type: 'checklist', key: 's1Observation', title: 'Observation Check', instruction: 'Tap all that apply as your team explores.', groups: [
        { label: 'Growing systems', options: ['Hydroponic channels with many healthy plants', 'Hydroponic channels with only a few plants', 'Empty hydroponic channels', 'Water moving through channels even when few/no plants are growing', 'Soil-based planters with edible plants or herbs', 'Mostly decorative potted plants'] },
        { label: 'Aquaponics / closed-loop system', options: ['Fish tanks or aquaponics system appear active', 'Fish tanks are empty or not visible', 'Rooms/tanks are dark or inaccessible', 'Area appears unused, used for storage, or poorly maintained'] },
        { label: 'Learning and engagement', options: ['Plant labels or educational signs are visible', 'Signs explain how the systems work', 'Visitors are reading, observing, or interacting with the space', 'The purpose of the space is not obvious without prior knowledge', 'There are few signs explaining what visitors should notice'] },
        { label: 'Maintenance and long-term use', options: ['Plants look well-maintained', 'Some areas look dry, empty, or neglected', 'Some systems look switched on but not fully used', 'Space appears redesigned for decoration rather than production', 'There is evidence of staff/partner/programme activity', 'There is little evidence of active programming'] }
      ], otherLabel: 'Other observation' },
      { type: 'photoCaption', key: 's1Photo', title: 'Photo + Caption Mission: Is the Purpose Still Alive?', text: `You have explored the Urban Farm and recorded your observations.

Now decide:

Does this space still serve its original sustainability purpose?

Choose one spot that supports your team’s answer.

Take a creative group photo at that spot.

A creative group photo means your team does more than simply stand there. Your pose, framing, expression, or action should help communicate what your team thinks about the space.

Photo rules:
- All team members should be visible.
- Avoid strangers’ faces.
- Do not block pathways or entrances.
- Be respectful of the space.`, captionLabel: 'Write 1–2 sentences explaining what your photo shows and why it supports your team’s answer.' },
      { type: 'singleChoice', key: 's1Diagnosis', title: 'Current Role Diagnosis', instruction: 'Based on your observation, what best describes the Urban Farm now?', options: ['Productive food-growing system', 'Public education showcase', 'Decorative green space', 'Partially functioning sustainability feature', 'Storage / leftover space with green elements', 'Mixed-purpose space whose role has changed over time'] },
      { type: 'textarea', key: 's1BigQuestion', title: 'B.O.B.’s Big Question', instruction: `Reminder: This response may be reviewed by teachers. Use clear evidence from what your team observed.

The Urban Farm was designed as sustainability infrastructure in a mall.

Based on what you observed, what does this station teach us about why some sustainability initiatives last, while others fade over time?

In your answer, refer to:
- what the space may have been designed to do;
- what you observed now;
- one key reason the initiative may have changed over time;
- one improvement that could help such spaces work better in the long term.`, placeholder: 'Write your team response here…' }
    ]
  },
  S2: {
    title: 'Green Basket Battle: Buy Better… or Buy Less?',
    shortTitle: 'Green Basket Battle',
    suggestedMinutes: 15,
    clue: `Your next checkpoint hides among promises you can hold in your hands.

Some items here may help people waste less. Some may make people feel better about buying more.

Find the place where many small brands gather, and every shelf asks the same question:

Is this choice truly better, or just greener-looking?`,
    hints: ['This checkpoint is inside a shop.', 'Look for a shop with many eco-themed products from different brands.', 'The shop name includes the idea of a group or collection.', 'Find the eco-lifestyle retail shop with many sustainability products.'],
    checkin: {
      prompt: 'Using the shop sign, enter the second word of the shop name.',
      placeholder: '',
      validator: value => {
        const v = normalize(value).replace(/[^a-z0-9]/g, ' ').replace(/\s+/g, ' ').trim();
        return v === 'green';
      },
      expected: 'green'
    },
    missionIntro: `You have found a shop that brings together products linked to more sustainable living.

Some products may help people reduce waste, replace single-use items, reuse materials, support ethical brands, or make lower-impact habits easier.

But sustainable consumption is not only about choosing something with a green label.

A product’s impact depends on its whole journey: what it is made from, how it is produced, how far it travels, how it is packaged, how long it is used, and what happens when it is thrown away.

Some products can be helpful if they replace a wasteful habit and are used many times. But buying a “green” product can still create impact if it is unnecessary, over-packaged, rarely used, or difficult to dispose of properly.

Your mission:
Explore the shop, choose one product, and decide whether it is truly a strong sustainable choice.`,
    steps: [
      { type: 'info', key: 's2ExploreViewed', title: 'Explore First', text: `Before choosing a product, spend a few minutes looking around the shop respectfully.

Look carefully at:
- what the product is meant to replace;
- what material it is made from;
- whether the packaging is minimal or excessive;
- whether the sustainability claim is clear;
- whether the product is reusable or durable;
- whether it is likely to be used many times;
- whether the product may have been imported;
- whether buying it is necessary in the first place.

Handle items carefully and return them properly.` },
      { type: 'product', key: 's2Product', title: 'Choose One Product' },
      { type: 'checklist', key: 's2Judgement', title: 'Product Judgement Check', instruction: 'Tap all that apply.', groups: [
        { label: 'Waste reduction', options: ['Replaces a disposable item', 'Reduces single-use plastic', 'Encourages refill or reuse', 'Uses minimal packaging'] },
        { label: 'Material and production', options: ['Made from recycled material', 'Made from renewable or biodegradable material', 'Made from durable material', 'Local or regional brand', 'Clear sourcing or production information'] },
        { label: 'Use and behaviour', options: ['Helps form a lower-waste habit', 'Likely to be used many times', 'Solves a real daily problem', 'Easy to adopt'] },
        { label: 'Concerns or question marks', options: ['Product may be imported', 'Packaging still creates waste', 'Sustainability claim is vague', 'Expensive or less accessible', 'Buyer may not use it enough', 'May encourage unnecessary purchase', 'Disposal or recycling is unclear'] }
      ], otherLabel: 'Other concern' },
      { type: 'photoOnly', key: 's2Photo', title: 'Photo Mission', text: `You have chosen one product and checked its possible strengths and concerns.

Take a creative group photo with or near the product.

A creative group photo means your team does more than simply stand there. Your pose, framing, expression, or action should help show that your team is investigating the product carefully.

Photo rules:
- All team members should be visible.
- Avoid strangers’ faces.
- Do not block shop aisles or entrances.
- Handle products respectfully.
- Follow shop instructions if staff give any.` },
      { type: 'textarea', key: 's2BigQuestion', title: 'B.O.B.’s Big Question', instruction: `Reminder: This response may be reviewed by teachers. Use clear evidence from what your team observed.

Name the product your team chose and state its function.

Then discuss whether this product is truly a strong sustainable choice.

In your answer, consider:
- what problem the product tries to solve;
- whether it replaces a wasteful habit;
- whether it is likely to be used many times;
- what materials or packaging it uses;
- whether its sustainability claim is clear;
- whether buying it is better than not buying anything new.

B.O.B.’s note: A strong answer does not simply say “yes” or “no”. Explain your judgement using evidence.`, placeholder: 'Write your team response here…' }
    ]
  },
  S3: {
    title: 'Pedal Proof: Built to Move or Built to Show?',
    shortTitle: 'Pedal Proof',
    suggestedMinutes: 15,
    clue: `Your next checkpoint follows a coloured trail through the crowd.

It was made for movement, but not everyone moves through it the same way.

Find the line that asks a strange question inside a mall:

Should we ride, push, walk beside it… or rethink it?`,
    hints: ['Look for markings on the floor.', 'This checkpoint is linked to bicycles.', 'Look around the main shopping level.', 'Find the visible cycling route on Level 1.'],
    checkin: {
      prompt: 'Find the cycling route rule sign. Complete the speed limit shown.',
      placeholder: '',
      unit: 'km/h',
      validator: value => ['10', 'ten', '10kmh', '10km/h', '10 kmh', '10 km/h'].includes(normalize(value).replace(/\s+/g, ' ')),
      expected: '10'
    },
    missionIntro: `You have found Funan’s cycling route.

Transport is an important part of sustainability because the way people travel affects energy use, emissions, traffic, road space, and daily habits.

Some transport choices generally have lower impact than others.

Walking and cycling are lower-impact forms of transport because they do not directly use fuel and take up less road space.

Mass public transport, such as buses and trains, can also be lower-impact per person because many passengers share the same vehicle or system.

Private cars and ride-hailing vehicles usually have higher impact per person, especially when only one or a few passengers are travelling.

Electric vehicles can reduce some vehicle-related emissions, but they still use road space and do not fully solve issues such as congestion or over-reliance on private vehicles.

Your mission:
Explore the cycling route and investigate how infrastructure can influence people to choose lower-impact transport.`,
    steps: [
      { type: 'info', key: 's3ExploreViewed', title: 'Explore First', text: `Before answering, spend a few minutes observing the cycling route.

Look carefully at:
- where the route is placed;
- whether the markings are easy to notice;
- whether pedestrians seem to understand the route;
- whether it feels safe in a mall setting;
- whether it clearly connects to entrances or transport facilities;
- whether rules make the route easier or harder to use;
- whether people seem to use it for actual movement.

Do not block the path while observing.` },
      { type: 'checklist', key: 's3Observation', title: 'Observation Check', instruction: 'Tap all that apply as your team explores.', groups: [
        { label: 'Visibility', options: ['Route markings are easy to notice', 'Route markings are easy to miss', 'The purpose of the route is clear', 'The purpose of the route is unclear unless you already know'] },
        { label: 'Safety and shared space', options: ['Route crosses busy walking areas', 'Route seems safe for slow movement', 'Route may confuse pedestrians', 'Route may be difficult to use when the mall is crowded'] },
        { label: 'Connectivity', options: ['Route connects clearly to an entrance or exit', 'Signs explain where cyclists should go', 'Bicycle facilities are nearby', 'Route does not clearly show where it connects next', 'Team is unsure where the route leads'] },
        { label: 'Behaviour', options: ['Saw someone cycling', 'Saw someone pushing a bicycle', 'Mostly saw people walking across or along it', 'Route looks more visible than actively used', 'Rules may limit actual cycling use'] }
      ], otherLabel: 'Other observation' },
      { type: 'singleChoice', key: 's3MainIssue', title: 'Main Issue Check', instruction: 'Based on your observations, what is the main issue your team noticed?', options: ['People may not notice or understand the route', 'The route may not connect clearly to other transport facilities', 'The route may feel unsafe or confusing in a crowded mall', 'Rules may limit usefulness for actual cycling', 'The route may be more symbolic than behaviour-changing', 'The route works well but needs stronger promotion'] },
      { type: 'text', key: 's3RouteName', title: 'Rename the Route', instruction: 'Give the cycling route a new name that would make its sustainability purpose clearer to the public. Keep it short, clear, and memorable.', label: 'New route name' },
      { type: 'info', key: 's3TransportFileViewed', title: 'B.O.B.’s Transport File', text: `A cycling route is only one part of sustainable transport design.

For people to choose lower-impact transport more often, the whole system has to make that choice easier.

Funan’s cycling route shows how a building can welcome active transport. Other supporting features may include bicycle parking, lockers, showers, repair support, public transport connections, walkable streets, and EV charging bays.

Each feature supports a different transport choice:
- cycling routes make active transport more visible;
- bicycle parking makes it easier to stop and enter a building;
- lockers and showers help people who cycle longer distances;
- repair or pump support reduces the inconvenience of cycling;
- public transport links reduce the need for private cars;
- walking paths help people move between nearby places;
- EV charging bays support cleaner vehicle use.

But B.O.B. has detected a real-world challenge.

People do not choose transport only because it is sustainable. They often choose what feels fastest, easiest, cheapest, safest, or most comfortable.

For example, ride-hailing or private-hire cars may feel attractive when people are tired, when it rains, when they are carrying bags, when they are travelling in groups, or when walking, cycling, or public transport feels inconvenient.

This creates a design challenge:

How can cities make lower-impact transport choices more attractive than simply booking a car?

B.O.B.’s question is not only whether sustainable transport options exist.

The bigger question is whether the design makes people more likely to choose them.` },
      { type: 'textarea', key: 's3BigQuestion', title: 'B.O.B.’s Big Question', instruction: `Reminder: This response may be reviewed by teachers. Use clear evidence from what your team observed and what you learnt from B.O.B.’s Transport File.

Using Funan’s cycling route and EV charging features as inspiration, suggest one realistic redesign or strategy and explain how it could encourage people to change to lower-impact transport choices when travelling between places.

In your answer, consider how your redesign or strategy could make walking, cycling, public transport, or cleaner vehicle use easier, safer, clearer, cheaper, more comfortable, or more convenient than simply choosing a private car or ride-hailing option.

B.O.B.’s note: A strong answer explains both the redesign or strategy and how it could change people’s behaviour.`, placeholder: 'Write your team response here…' }
    ]
  },
  S4: {
    title: 'One Building, Many Lives',
    shortTitle: 'One Building, Many Lives',
    suggestedMinutes: 15,
    clue: `Your next checkpoint is where Funan stops being only a place to shop.

Look for the part of the building that quietly changes the question from:

“What can I buy here?”

to

“What parts of daily life can happen here?”

Find the doorway to a different kind of stay.`,
    hints: ['This checkpoint is linked to staying, not just shopping.', 'Look for signs that Funan is connected to accommodation.', 'The checkpoint can be reached from inside Funan or through a dedicated lift area.', 'Find the accommodation entrance or lobby connected to Funan.'],
    checkin: {
      prompt: 'Enter the three-letter logo word shown at this checkpoint.',
      placeholder: '',
      validator: value => normalize(value) === 'lyf',
      expected: 'lyf'
    },
    missionIntro: `You have found a clue that Funan is not only a shopping mall.

Some buildings are designed for one main purpose. Others bring many parts of daily life into the same development.

Funan includes spaces linked to staying, working, shopping, eating, entertainment, movement, rooftop greenery, and connection to nearby places.

This type of design is called mixed-use development.

Mixed-use design is interesting because its sustainability value may not appear as one obvious “green feature”. Instead, it may be hidden in how different spaces are arranged, connected, and used.

Your mission:
Investigate how Funan brings different parts of daily life together, then decide what this could mean for sustainable urban living.`,
    steps: [
      { type: 'info', key: 's4ReadViewed', title: 'Read the Building', text: `Before answering, spend a few minutes reading Funan as a whole building.

You may use:
- the mall directory;
- wayfinding signs;
- lift lobby or floor directory signs;
- signs to transport connections;
- safe open viewpoints inside the mall;
- what your team has already noticed from earlier checkpoints.

Stay in public areas only. Do not enter restricted hotel, office, or staff-only spaces.

Your goal is to identify what different parts of daily life can happen in or near Funan.` },
      { type: 'checklist', key: 's4Decoder', title: 'Mixed-use Decoder', instruction: 'Which parts of daily life can Funan support? Tap all that apply.', groups: [
        { label: 'Functions and connections', options: ['Shopping / general retail', 'Food and drink', 'Offices / working', 'Staying / accommodation', 'Theatre / cinema / entertainment', 'Meeting or social spaces', 'Cycling or active transport', 'Public transport connection', 'Underpass connection to nearby malls or places', 'Urban farming / rooftop greenery', 'Services or errands', 'Nearby civic or cultural district'] }
      ], otherLabel: 'Other function spotted' },
      { type: 'singleChoice', key: 's4Profile', title: 'Choose a User Profile', instruction: 'Choose one person whose day your team will design.', options: ['Hotel guest', 'Office worker', 'Student visitor', 'Neighbourhood visitor', 'Tourist / exchange visitor'] },
      { type: 'lowerCarbonDay', key: 's4LowerCarbonDay', title: 'A Lower-Carbon Day in the Life of…' },
      { type: 'textarea', key: 's4BigQuestion', title: 'B.O.B.’s Big Question', instruction: `Reminder: This response may be reviewed by teachers. Use evidence from your decoder and your lower-carbon day plan.

Using Funan as an example, evaluate this idea:

“Putting many parts of daily life close together is enough to make urban living sustainable.”

In your response, explain whether you agree, partly agree, or disagree.

You may refer to:
- mixed-use buildings such as Funan;
- town centres or neighbourhood hubs;
- transport connections;
- daily choices made by people;
- possible trade-offs or limitations.

B.O.B.’s note: A strong answer explains both the potential of this design idea and why design alone may not be enough.`, placeholder: 'Write your team response here…' }
    ]
  },
  S5: {
    title: 'Break Time: Green Choice or Green Confusion?',
    shortTitle: 'Break Time',
    suggestedMinutes: 10,
    isRecharge: true,
    clue: `Time to recharge, Eco Ops Crew.

Choose any food, drink, or convenience-store area where your team can pause safely.

You do not have to buy anything. Observing is enough.

While resting, look out for one small everyday choice that reveals a bigger sustainability issue.`,
    missionIntro: `Sustainability is not only tested in big systems like farms, buildings, or transport routes.

It is also tested in small daily moments — when people buy a drink, grab a snack, take a straw, use a bag, throw away packaging, or decide whether to recycle.

These choices may look simple, but they are shaped by convenience, cost, habits, packaging design, bin labels, and what options are available.

Some choices may genuinely reduce waste. Others may only look “green” but still create problems if they are over-packaged, used once, contaminated, or disposed of wrongly.

Your mission:
During your break, spot one everyday sustainability issue and suggest a practical response.`,
    steps: [
      { type: 'info', key: 's5ObserveViewed', title: 'Observe Your Break Spot', text: `Spend a short time looking around your chosen break area.

Look for one everyday sustainability tension.

It could involve:
- food or drink packaging;
- plastic bags, straws, lids, cups, or containers;
- paper, biodegradable, compostable, or recyclable materials;
- recycling bins or waste bins;
- leftover liquids or food waste;
- reusable bottles, cups, containers, or bags;
- whether the more sustainable choice is easy or inconvenient.

You only need to focus on one issue.` },
      { type: 'singleChoice', key: 's5Tension', title: 'What Did Your Team Notice?', instruction: 'Choose the option that best matches what your team spotted.', options: ['Packaging contradiction', 'Single-use convenience', 'Recycling confusion', 'Better habit spotted', 'Green-looking but unclear', 'Other'], otherLabel: 'If other, describe briefly' },
      { type: 'photoOnly', key: 's5Photo', title: 'Photo Mission: The Small Choice Snapshot', text: `Take a creative group photo with the item, store area, bin, packaging, or choice your team is using for this checkpoint.

Your photo should show the everyday sustainability issue your team noticed.

A creative group photo means your team does more than simply stand there. Your pose, framing, expression, or action should help show what your team noticed.

Photo rules:
- All team members should be visible.
- Avoid strangers’ faces.
- Do not block queues, entrances, walkways, or bins.
- Be respectful of shops and other visitors.
- You do not need to buy anything.` },
      { type: 's5Response', key: 's5Response', title: 'Small Choice, Better Response' }
    ]
  }
};

const app = document.getElementById('app');
const toastHost = document.getElementById('toastHost');
let state = loadState();
const entryScreen = state.currentScreen || 'splash';
let activeHintCount = 0;

function defaultState() {
  return {
    mode: 'student',
    group: '',
    teamName: '',
    route: [],
    currentIndex: 0,
    started: false,
    finalShown: false,
    finalBaseConfirmed: false,
    currentScreen: 'splash',
    activeStep: 0,
    checkinUnlocked: {},
    stationData: {},
    photos: {},
    upgrades: {},
    learningCards: {},
    stampLayers: {},
    completed: {},
    lastSave: '',
    issues: []
  };
}

function loadState() {
  try {
    const raw = localStorage.getItem(CONFIG.STORAGE_KEY);
    return raw ? { ...defaultState(), ...JSON.parse(raw) } : defaultState();
  } catch (err) {
    console.warn('Could not load state', err);
    return defaultState();
  }
}

function saveState() {
  state.lastSave = new Date().toISOString();
  localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(state));
}

function normalize(value) {
  return String(value || '').trim().toLowerCase();
}

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function lines(text) {
  return escapeHtml(text).replace(/\n/g, '<br>');
}

function $(selector, root = document) { return root.querySelector(selector); }
function $$(selector, root = document) { return Array.from(root.querySelectorAll(selector)); }

function setScreen(screen, opts = {}) {
  state.currentScreen = screen;
  if (typeof opts.step === 'number') state.activeStep = opts.step;
  saveState();
  try {
    render();
  } catch (err) {
    console.error('Screen render failed:', screen, err);
    renderRecoveryScreen(screen, err);
  }
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function renderRecoveryScreen(screen, err) {
  const message = err && err.message ? err.message : String(err || 'Unknown error');
  app.innerHTML = `
    <section class="card">
      <span class="kicker">B.O.B. needs a reset</span>
      <h2>This screen did not load properly.</h2>
      <p>Your saved progress is still on this device.</p>
      <p><small>${escapeHtml(screen)} — ${escapeHtml(message)}</small></p>
      <div class="actions">
        <button class="primary-btn" id="recoverCheckpoint">Return to checkpoint clue</button>
        <button class="secondary-btn" id="recoverLanding">Back to landing page</button>
      </div>
    </section>`;
  $('#recoverCheckpoint')?.addEventListener('click', () => {
    state.currentScreen = 'checkpoint';
    saveState();
    render();
  });
  $('#recoverLanding')?.addEventListener('click', () => {
    state.currentScreen = 'splash';
    saveState();
    render();
  });
}

function showToast(message) {
  const el = document.createElement('div');
  el.className = 'toast';
  el.textContent = message;
  toastHost.appendChild(el);
  setTimeout(() => el.remove(), 3800);
}

function showLoading(message = 'B.O.B. is processing…') {
  app.innerHTML = `
    <section class="card loading-card" role="status" aria-live="polite">
      <div class="bob-loader" aria-hidden="true"><span></span></div>
      <div><h2>Loading…</h2><p>${escapeHtml(message)}</p></div>
    </section>`;
}

function isBackendConfigured() {
  return CONFIG.SCRIPT_URL && !CONFIG.SCRIPT_URL.includes('PASTE_YOUR');
}

function fetchWithTimeout(url, options = {}, timeoutMs = 15000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  return fetch(url, { ...options, signal: controller.signal }).finally(() => clearTimeout(timer));
}

async function backend(action, payload = {}) {
  const body = {
    action,
    payload,
    meta: {
      app: 'Eco XP Funan',
      timestamp: new Date().toISOString(),
      group: state.group,
      teamName: state.teamName
    }
  };

  if (!isBackendConfigured()) {
    await sleep(260);
    return mockBackend(action, payload);
  }

  const res = await fetchWithTimeout(CONFIG.SCRIPT_URL, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'text/plain;charset=utf-8' }
  }, action === 'uploadPhoto' ? 30000 : 15000);

  if (!res.ok) throw new Error(`Backend request failed: ${res.status}`);
  const json = await res.json();
  if (!json.ok) throw new Error(json.error || 'Backend returned an error');
  return json;
}

function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

function mockBackend(action, payload) {
  if (action === 'uploadPhoto') {
    return { ok: true, fileName: payload.fileName, driveLink: payload.dataUrl || '#mock-photo-link', mock: true };
  }
  if (action === 'getDashboard') {
    return buildMockDashboard();
  }
  return { ok: true, mock: true };
}

function buildMockDashboard() {
  const local = loadState();
  const rows = [];
  if (local.group) {
    rows.push({
      group: local.group,
      teamName: local.teamName,
      currentStation: local.route[local.currentIndex] || 'Final',
      completedCount: Object.keys(local.completed || {}).length,
      photoCount: Object.keys(local.photos || {}).length,
      status: Object.keys(local.completed || {}).length >= 5 ? 'Complete' : 'In progress',
      lastSave: local.lastSave,
      scores: {}
    });
  }
  return { ok: true, groups: rows, submissions: [], photos: [], scores: [] };
}

function currentStationCode() {
  return state.route[state.currentIndex];
}

function completedCount() {
  return Object.keys(state.completed || {}).length;
}

function photoCount() {
  return Object.values(state.photos || {}).filter(Boolean).length;
}

function progressDots() {
  const done = completedCount();
  return `<div class="progress-dots" aria-label="Progress">${Array.from({ length: 5 }).map((_, i) => {
    const cls = i < done ? 'done' : i === done ? 'current' : '';
    return `<span class="${cls}"></span>`;
  }).join('')}</div>`;
}







function renderAccessoryCardSvg(id) {
  const wrap = inner => `<svg viewBox="0 0 70 60" class="upgrade-card-svg" aria-hidden="true">${inner}</svg>`;
  if (id === 'gardenHat') return wrap(`<ellipse cx="35" cy="36" rx="22" ry="6" fill="#dfb36a" stroke="#ac7b33" stroke-width="2"/><path d="M20 35 Q35 15 50 35 L47 40 Q35 43 23 40 Z" fill="#f5d287" stroke="#ac7b33" stroke-width="2"/><path d="M26 27 q7 -6 15 0" fill="none" stroke="#5e964d" stroke-width="3.4" stroke-linecap="round"/><path d="M42 21 q7 2 8 8 q-6 2 -10 -2 q-2 -4 2 -6z" fill="#5f8f56"/>`);
  if (id === 'flowerHat') return wrap(`<ellipse cx="35" cy="36" rx="22" ry="6" fill="#dfb36a" stroke="#ac7b33" stroke-width="2"/><path d="M20 35 Q35 16 50 35 L47 40 Q35 43 23 40 Z" fill="#f5d287" stroke="#ac7b33" stroke-width="2"/><circle cx="23" cy="24" r="4" fill="#ff8db1"/><circle cx="31" cy="20" r="4.6" fill="#fff0a8"/><circle cx="39" cy="19" r="4" fill="#ffffff"/><circle cx="47" cy="24" r="4" fill="#ffcb69"/><path d="M22 30 q13 7 26 0" fill="none" stroke="#66a45b" stroke-width="2.4" stroke-linecap="round"/>`);
  if (id === 'toteBadge') return wrap(`<path d="M19 18 q3 0 6 3 l4 5 q3 3 8 3 h4" fill="none" stroke="#9a6a35" stroke-width="2.6" stroke-linecap="round"/><path d="M19 49 q0 -6 1 -16 q1 -5 5 -5 h18 q4 0 5 5 q2 10 2 16 z" fill="#d29a52" stroke="#8b5c2f" stroke-width="2.2"/><path d="M23 34 q7 -5 13 0" fill="none" stroke="#75a44e" stroke-width="2.2" stroke-linecap="round"/><circle cx="29" cy="40" r="3.8" fill="#dc4a35"/><circle cx="37" cy="39" r="3.8" fill="#74b246"/><circle cx="44" cy="41" r="3.4" fill="#dc4a35"/>`);
  if (id === 'judgeBadge') return wrap(`<circle cx="24" cy="15" r="8.5" fill="#4da3ff"/><circle cx="36" cy="10" r="8.2" fill="#ff4d4d"/><circle cx="48" cy="18" r="8.3" fill="#ffd33d"/><circle cx="30" cy="26" r="8.2" fill="#5ed05e"/><circle cx="43" cy="29" r="7.8" fill="#b36cff"/><path d="M24 24 C28 39, 32 48, 36 54" stroke="#2f88d8" stroke-width="1.7" stroke-linecap="round"/><path d="M36 18 C36 35, 36 46, 36 54" stroke="#d33d3d" stroke-width="1.7" stroke-linecap="round"/><path d="M48 26 C44 39, 40 48, 36 54" stroke="#d6a21e" stroke-width="1.7" stroke-linecap="round"/><path d="M30 34 C32 42, 34 49, 36 54" stroke="#3d9f43" stroke-width="1.7" stroke-linecap="round"/><path d="M43 36 C40 43, 38 49, 36 54" stroke="#8e4ed6" stroke-width="1.7" stroke-linecap="round"/>`);
  if (id === 'tinyWheels') return wrap(`<path d="M17 42 q18 4 36 0 q4 -1 6 2 q-2 6 -9 7 q-15 3 -31 0 q-8 -1 -10 -7 q2 -3 8 -2z" fill="#e53935" stroke="#8a1f1f" stroke-width="2.2"/><path d="M22 43 q13 3 28 0" fill="none" stroke="#ff9087" stroke-width="1.8" stroke-linecap="round"/><path d="M24 51 l9 -3 M46 51 l9 -3" stroke="#55585c" stroke-width="2" stroke-linecap="round"/><circle cx="24" cy="53" r="3.2" fill="#2f3437"/><circle cx="35" cy="50" r="3.2" fill="#2f3437"/><circle cx="46" cy="53" r="3.2" fill="#2f3437"/><circle cx="57" cy="50" r="3.2" fill="#2f3437"/>`);
  if (id === 'greenSneakers') return wrap(`<circle cx="18" cy="42" r="8.5" fill="none" stroke="#495057" stroke-width="2.6"/><circle cx="53" cy="42" r="8.5" fill="none" stroke="#495057" stroke-width="2.6"/><path d="M18 42 L30 28 L42 28 L53 42" fill="none" stroke="#5f8f56" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/><path d="M30 28 l-6 -4 M42 28 l7 -4 M42 28 l6 8" fill="none" stroke="#5f8f56" stroke-width="3.2" stroke-linecap="round"/><path d="M30 28 L35 42 L42 28" fill="none" stroke="#5f8f56" stroke-width="3.2" stroke-linecap="round"/><rect x="39" y="21" width="7" height="3" rx="1.5" fill="#7c5737"/>`);
  if (id === 'sgBruneiScarf') return wrap(`<path d="M14 24 q17 8 34 0" fill="none" stroke="#d54e42" stroke-width="5.5" stroke-linecap="round"/><path d="M16 29 q15 8 32 0" fill="none" stroke="#f2c142" stroke-width="5.5" stroke-linecap="round"/><path d="M40 27 v18" stroke="#d54e42" stroke-width="5" stroke-linecap="round"/><path d="M48 29 v16" stroke="#f2c142" stroke-width="5" stroke-linecap="round"/><path d="M18 24 q6 0 9 3" fill="none" stroke="#ffffff" stroke-width="1.6" stroke-linecap="round"/><circle cx="20" cy="24" r="1" fill="#ffffff"/><circle cx="23" cy="22.5" r="1" fill="#ffffff"/><circle cx="26.5" cy="24" r="1" fill="#ffffff"/>`);
  if (id === 'cityBandana') return wrap(`<g transform="translate(2,0)"><path d="M46 13 c6 -7 14 -4 13 4 c-1 7 -10 7 -13 -4z" fill="#3399ff"/><path d="M46 13 c-8 -4 -13 2 -10 8 c4 6 11 1 10 -8z" fill="#70c8ff"/><path d="M34 28 c7 -7 15 -3 13 5 c-1 7 -11 7 -13 -5z" fill="#ffb52e"/><path d="M34 28 c-8 -4 -13 2 -10 8 c4 6 11 1 10 -8z" fill="#ffd46e"/><path d="M50 39 c6 -6 13 -3 12 4 c-1 6 -10 6 -12 -4z" fill="#8e62e8"/><path d="M50 39 c-7 -4 -12 2 -9 7 c4 5 10 0 9 -7z" fill="#c69cff"/><path d="M22 41 c6 -6 13 -3 12 4 c-1 6 -10 6 -12 -4z" fill="#ff77a8"/><path d="M22 41 c-7 -4 -12 2 -9 7 c4 5 10 0 9 -7z" fill="#ffb6cf"/></g>`);
  if (id === 'reusableBottle') return wrap(`<g transform="translate(0,5)"><ellipse cx="36" cy="48" rx="11" ry="4" fill="#c9d8bd"/><rect x="29" y="16" width="14" height="30" rx="6" fill="#a2aa7b" stroke="#6f7748" stroke-width="2.2"/><rect x="32" y="10" width="8" height="8" rx="2" fill="#6f7748"/><path d="M31 30 q5 -4 10 0" fill="none" stroke="#ffffff" stroke-width="1.8" stroke-linecap="round"/></g>`);
  if (id === 'snackPouch') return wrap(`<path d="M22 47 v-20 q0 -7 7 -7 h13 q7 0 7 7 v20 z" fill="#5f9b56" stroke="#35523a" stroke-width="2.2"/><path d="M27 22 q8 -10 16 0" fill="none" stroke="#35523a" stroke-width="2.2" stroke-linecap="round"/><rect x="25" y="31" width="21" height="14" rx="4" fill="#8fc46c" stroke="#35523a" stroke-width="1.8"/><path d="M26 47 h20" stroke="#f2c94c" stroke-width="3" stroke-linecap="round"/>`);
  return wrap('');
}

function renderAccessorySvg(upgrade, layer = 'front') {
  if (!upgrade) return '';
  const id = upgrade.id || '';
  const wrap = inner => `<g class="upgrade-svg ${escapeHtml(id)}">${inner}</g>`;

  if (id === 'gardenHat') return layer === 'front' ? wrap(`
    <g transform="translate(-18,-46)">
      <ellipse cx="132" cy="56" rx="46" ry="12" fill="#dfb36a" stroke="#ac7b33" stroke-width="3"/>
      <path d="M98 55 Q128 18 159 55 L154 63 Q130 67 103 63 Z" fill="#f5d287" stroke="#ac7b33" stroke-width="3"/>
      <path d="M110 42 q16 -12 31 0" fill="none" stroke="#5e964d" stroke-width="6" stroke-linecap="round"/>
      <path d="M143 32 q11 2 12 11 q-10 3 -15 -3 q-3 -5 3 -8z" fill="#5f8f56"/>
    </g>
  `) : '';

  if (id === 'flowerHat') return layer === 'front' ? wrap(`
    <g transform="translate(-18,-48)">
      <ellipse cx="132" cy="57" rx="46" ry="12" fill="#dfb36a" stroke="#ac7b33" stroke-width="3"/>
      <path d="M98 56 Q128 22 159 56 L154 63 Q130 67 103 63 Z" fill="#f5d287" stroke="#ac7b33" stroke-width="3"/>
      <circle cx="106" cy="38" r="8" fill="#ff8db1"/><circle cx="106" cy="38" r="2.3" fill="#fff5c6"/>
      <circle cx="121" cy="31" r="8.5" fill="#fff0a8"/><circle cx="121" cy="31" r="2.2" fill="#fff"/>
      <circle cx="136" cy="29" r="8" fill="#ffffff"/><circle cx="136" cy="29" r="2.2" fill="#ffe8a0"/>
      <circle cx="151" cy="38" r="8" fill="#ffcb69"/><circle cx="151" cy="38" r="2.2" fill="#fff"/>
      <path d="M106 49 q23 13 45 0" fill="none" stroke="#66a45b" stroke-width="4.5" stroke-linecap="round"/>
    </g>
  `) : '';

  if (id === 'toteBadge') return layer === 'front' ? wrap(`
    <g transform="translate(-96,4)">
      <path d="M160 123 q5 -2 9 2 l6 7 q5 6 16 6 h6" fill="none" stroke="#9a6a35" stroke-width="5" stroke-linecap="round"/>
      <path d="M161 192 q0 -9 2 -28 q1 -9 8 -9 h31 q7 0 8 9 q2 19 2 28 z" fill="#d29a52" stroke="#8b5c2f" stroke-width="3.2"/>
      <path d="M168 166 q12 -10 22 0" fill="none" stroke="#75a44e" stroke-width="3.4" stroke-linecap="round"/>
      <circle cx="177" cy="176" r="6.3" fill="#dc4a35"/><circle cx="190" cy="174" r="6.2" fill="#74b246"/><circle cx="201" cy="178" r="5.8" fill="#dc4a35"/>
      <path d="M173 160 q4 -8 6 -10" fill="none" stroke="#6f9652" stroke-width="2.5" stroke-linecap="round"/><path d="M197 160 q4 -8 6 -10" fill="none" stroke="#6f9652" stroke-width="2.5" stroke-linecap="round"/>
    </g>
  `) : '';

  if (id === 'judgeBadge') return layer === 'front' ? wrap(`
    <g>
      <circle cx="40" cy="18" r="19" fill="#ffd34d" stroke="#c79313" stroke-width="2"/>
      <circle cx="22" cy="48" r="19" fill="#ef3f35" stroke="#a82722" stroke-width="2"/>
      <circle cx="62" cy="40" r="21" fill="#3fa7ee" stroke="#1d6fa8" stroke-width="2"/>
      <circle cx="37" cy="73" r="17" fill="#a45fe8" stroke="#6d35a8" stroke-width="2"/>
      <circle cx="80" cy="67" r="17" fill="#7cc85a" stroke="#4b9136" stroke-width="2"/>
      <ellipse cx="40" cy="12" rx="7" ry="11" fill="#fff4b3" opacity=".55"/>
      <ellipse cx="22" cy="42" rx="7" ry="10" fill="#ffd0cb" opacity=".55"/>
      <ellipse cx="62" cy="32" rx="8" ry="12" fill="#d6f1ff" opacity=".55"/>
      <path d="M40 37 C53 84, 73 123, 103 168" stroke="#c79313" stroke-width="2.2" fill="none" stroke-linecap="round"/>
      <path d="M22 67 C45 104, 71 135, 103 168" stroke="#a82722" stroke-width="2.2" fill="none" stroke-linecap="round"/>
      <path d="M62 61 C75 102, 88 132, 103 168" stroke="#1d6fa8" stroke-width="2.2" fill="none" stroke-linecap="round"/>
      <path d="M37 90 C56 119, 77 143, 103 168" stroke="#6d35a8" stroke-width="2.2" fill="none" stroke-linecap="round"/>
      <path d="M80 84 C88 114, 96 138, 103 168" stroke="#4b9136" stroke-width="2.2" fill="none" stroke-linecap="round"/>
      <circle cx="103" cy="168" r="3.5" fill="#6b3b21"/>
    </g>
  `) : '';

  if (id === 'tinyWheels') return layer === 'front' ? wrap(`
    <g>
      <ellipse cx="224" cy="248" rx="24" ry="7" fill="#cfd7c8" opacity="0.55"/>
      <g transform="rotate(14 213 196)">
        <path d="M188 116
                 C202 112, 216 118, 221 132
                 L247 231
                 C251 246, 244 260, 229 264
                 C215 268, 201 262, 197 247
                 L170 149
                 C166 135, 173 120, 188 116 Z"
              fill="#d92f2f" stroke="#8f1c1c" stroke-width="3.2"/>
        <path d="M194 129 L239 244" fill="none" stroke="#ff9087" stroke-width="3.2" stroke-linecap="round" opacity="0.95"/>
        <path d="M186 124 q16 2 27 -4" fill="none" stroke="#ffd14f" stroke-width="2.6" stroke-linecap="round"/>
        <path d="M205 255 q14 1 24 -5" fill="none" stroke="#ffd14f" stroke-width="2.6" stroke-linecap="round"/>
        <path d="M178 155 l34 -9" stroke="#55585c" stroke-width="4.4" stroke-linecap="round"/>
        <path d="M201 241 l34 -9" stroke="#55585c" stroke-width="4.4" stroke-linecap="round"/>
        <path d="M195 151 l-4 11 M217 145 l-4 11" stroke="#55585c" stroke-width="2.2" stroke-linecap="round"/>
        <path d="M218 237 l-4 11 M240 231 l-4 11" stroke="#55585c" stroke-width="2.2" stroke-linecap="round"/>
        <circle cx="191" cy="160" r="7.2" fill="#2f3437"/>
        <circle cx="215" cy="154" r="7.2" fill="#2f3437"/>
        <circle cx="214" cy="246" r="7.2" fill="#2f3437"/>
        <circle cx="239" cy="239" r="7.2" fill="#2f3437"/>
        <circle cx="191" cy="160" r="2" fill="#8d9398"/>
        <circle cx="215" cy="154" r="2" fill="#8d9398"/>
        <circle cx="214" cy="246" r="2" fill="#8d9398"/>
        <circle cx="239" cy="239" r="2" fill="#8d9398"/>
      </g>
    </g>
  `) : '';

  if (id === 'greenSneakers') return layer === 'back' ? wrap(`
    <g transform="translate(-2,-8)">
      <circle cx="54" cy="246" r="27" fill="none" stroke="#3f454a" stroke-width="4.2"/>
      <circle cx="212" cy="246" r="27" fill="none" stroke="#3f454a" stroke-width="4.2"/>
      <circle cx="54" cy="246" r="3" fill="#6b6f73"/><circle cx="212" cy="246" r="3" fill="#6b6f73"/>
      <path d="M54 246 L110 198 L160 198 L212 246" fill="none" stroke="#5f8f56" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M110 198 L91 188" fill="none" stroke="#5f8f56" stroke-width="6" stroke-linecap="round"/>
      <path d="M160 198 L178 188" fill="none" stroke="#5f8f56" stroke-width="6" stroke-linecap="round"/>
      <path d="M160 198 L178 220" fill="none" stroke="#5f8f56" stroke-width="6" stroke-linecap="round"/>
      <path d="M110 198 L136 246" fill="none" stroke="#5f8f56" stroke-width="6" stroke-linecap="round"/>
      <path d="M136 246 L160 198" fill="none" stroke="#5f8f56" stroke-width="6" stroke-linecap="round"/>
      <rect x="144" y="182" width="22" height="5" rx="2" fill="#7c5737"/>
      <path d="M178 188 l18 -9" fill="none" stroke="#5f8f56" stroke-width="6" stroke-linecap="round"/>
      <path d="M198 179 q9 -6 15 -2" fill="none" stroke="#7c5737" stroke-width="4" stroke-linecap="round"/>
    </g>
  `) : '';

  if (id === 'sgBruneiScarf') return layer === 'front' ? wrap(`
    <g transform="translate(-18,-52)">
      <path d="M98 147 q38 15 74 0" fill="none" stroke="#ff2e2e" stroke-width="11" stroke-linecap="round"/>
      <path d="M102 157 q34 15 66 0" fill="none" stroke="#ffd21a" stroke-width="11" stroke-linecap="round"/>
      <path d="M149 149 v38" stroke="#ff2e2e" stroke-width="9" stroke-linecap="round"/>
      <path d="M163 154 v35" stroke="#ffd21a" stroke-width="9" stroke-linecap="round"/>
      <path d="M108 147 q12 -1 19 6" fill="none" stroke="#ffffff" stroke-width="2.4" stroke-linecap="round"/>
      <circle cx="111" cy="147" r="1.5" fill="#ffffff"/><circle cx="116" cy="144.5" r="1.5" fill="#ffffff"/><circle cx="122" cy="147" r="1.5" fill="#ffffff"/>
      <path d="M162 186 l-5 9 M170 185 l-2 10" stroke="#ffd21a" stroke-width="2" stroke-linecap="round"/>
    </g>
  `) : '';

  if (id === 'cityBandana') return layer === 'front' ? wrap(`
    <g transform="translate(30,-82)">
      <g transform="rotate(-18 188 91)">
        <path d="M188 91 c12 -13 27 -6 24 8 c-3 13 -19 14 -24 -8z" fill="#2d95f5" stroke="#1b5c9e" stroke-width="1.5"/>
        <path d="M188 91 c-14 -8 -25 2 -20 14 c6 11 19 2 20 -14z" fill="#72caff" stroke="#1b5c9e" stroke-width="1.5"/>
        <path d="M188 91 v18" stroke="#3f3220" stroke-width="2" stroke-linecap="round"/>
      </g>
      <g transform="rotate(12 161 116)">
        <path d="M161 116 c13 -12 27 -4 22 10 c-4 12 -20 12 -22 -10z" fill="#ffb22e" stroke="#9d6012" stroke-width="1.5"/>
        <path d="M161 116 c-15 -7 -24 4 -17 15 c7 10 18 -1 17 -15z" fill="#ffd36e" stroke="#9d6012" stroke-width="1.5"/>
        <path d="M161 116 v18" stroke="#3f3220" stroke-width="2" stroke-linecap="round"/>
      </g>
      <g transform="rotate(18 202 132)">
        <path d="M202 132 c11 -10 23 -3 20 8 c-3 11 -17 11 -20 -8z" fill="#8e62e8" stroke="#5630a6" stroke-width="1.5"/>
        <path d="M202 132 c-13 -6 -20 4 -15 13 c6 9 16 -1 15 -13z" fill="#c69cff" stroke="#5630a6" stroke-width="1.5"/>
        <path d="M202 132 v15" stroke="#3f3220" stroke-width="1.8" stroke-linecap="round"/>
      </g>
      <g transform="rotate(-8 144 142)">
        <path d="M144 142 c10 -10 22 -4 19 8 c-3 10 -17 10 -19 -8z" fill="#ff77a8" stroke="#9f3f65" stroke-width="1.5"/>
        <path d="M144 142 c-12 -6 -20 4 -15 13 c6 8 16 -1 15 -13z" fill="#ffb6cf" stroke="#9f3f65" stroke-width="1.5"/>
        <path d="M144 142 v15" stroke="#3f3220" stroke-width="1.8" stroke-linecap="round"/>
      </g>
      <path d="M174 105 q-8 8 -4 17 q4 10 -7 18" fill="none" stroke="#f1d75c" stroke-width="1.5" stroke-dasharray="2 4"/>
    </g>
  `) : '';

  if (id === 'reusableBottle') return layer === 'front' ? wrap(`
    <g transform="translate(-132,81)">
      <ellipse cx="180" cy="191" rx="13" ry="4" fill="#cad8bd"/>
      <rect x="171" y="146" width="20" height="43" rx="8" fill="#a2aa7b" stroke="#6f7748" stroke-width="3"/>
      <rect x="175" y="137" width="12" height="12" rx="3" fill="#6f7748"/>
      <path d="M174 164 q7 -5 14 0" fill="none" stroke="#ffffff" stroke-width="2.3" stroke-linecap="round"/>
      <path d="M174 176 h14" stroke="#d1e3bc" stroke-width="2.8" stroke-linecap="round"/>
    </g>
  `) : '';

  if (id === 'snackPouch') return layer === 'front' ? wrap(`
    <g transform="translate(19,70)">
      <ellipse cx="178" cy="196" rx="22" ry="5" fill="#c7d6b8"/>
      <path d="M155 192 v-34 q0 -13 13 -13 h21 q13 0 13 13 v34 z" fill="#5f9b56" stroke="#35523a" stroke-width="3"/>
      <path d="M166 147 q12 -19 25 0" fill="none" stroke="#35523a" stroke-width="3.2" stroke-linecap="round"/>
      <rect x="162" y="164" width="32" height="22" rx="5" fill="#8fc46c" stroke="#35523a" stroke-width="2.4"/>
      <path d="M160 192 h36" stroke="#f2c94c" stroke-width="4" stroke-linecap="round"/>
    </g>
  `) : '';

  return '';
}

function renderOtterOverlay(layer) {
  const upgrades = Object.values(state.upgrades || {}).filter(Boolean);
  const accessoryMarkup = upgrades.map(upgrade => renderAccessorySvg(upgrade, layer)).join('');
  return `<svg class="otter-overlay ${layer}" viewBox="0 0 260 280" aria-hidden="true">${accessoryMarkup}</svg>`;
}

function renderOtter() {
  return `
    <div class="otter-wrap" aria-label="Eco Otter preview">
      <div class="otter-stage">
        <div class="otter-shadow"></div>
        ${renderOtterOverlay('back')}
        <img src="assets/otter/base_otter.png" class="otter-base" alt="Eco Otter" />
        ${renderOtterOverlay('front')}
      </div>
    </div>`;
}

function renderOtterPanel(extraText = 'Your otter collects upgrades as your team clears checkpoints.') {
  return `<div class="otter-panel">${renderOtter()}<div><strong>Eco Otter</strong><p>${escapeHtml(extraText)}</p></div></div>`;
}


function renderStampArt() {
  const count = Math.max(0, Math.min(4, completedCount()));
  const stageImage = count <= 0
    ? 'assets/stamp/stamp_layer_1_green.png'
    : `assets/stamp/stamp_stage_${count}.jpg`;
  return `
    <div class="stamp-art" aria-label="Collectible artwork progress">
      <img src="${stageImage}" alt="Collectible artwork progress" class="stamp-image" />
    </div>`;
}

function render() {

  if (location.hash === '#teacher' || state.mode === 'teacher') return renderTeacherLoginOrDashboard();

  switch (state.currentScreen) {
    case 'splash': return renderSplash();
    case 'login': return renderLogin();
    case 'device': return renderDeviceConfirm();
    case 'rules': return renderRules();
    case 'briefing': return renderBriefing();
    case 'resume': return renderResume();
    case 'checkpoint': return renderCheckpoint();
    case 'hints': return renderHints();
    case 'checkin': return renderCheckin();
    case 'missionIntro': return renderMissionIntro();
    case 'missionStep': return renderMissionStep();
    case 'upgrade': return renderUpgrade();
    case 'learning': return renderLearningCard();
    case 'stamp': return renderStampReveal();
    case 'finalBase': return renderFinalBase();
    case 'final': return renderFinalScreen();
    case 'celebration': return renderCelebrationScreen();
    default: return renderSplash();
  }
}

function getSafeResumeScreen() {
  if (!state.group || !state.teamName || !Array.isArray(state.route) || !state.route.length) return 'login';
  if (completedCount() >= 5) return state.celebrationShown ? 'celebration' : (state.finalShown ? 'final' : 'finalBase');
  const safeScreens = new Set(['checkpoint', 'checkin', 'missionIntro', 'missionStep', 'upgrade', 'learning', 'stamp', 'finalBase', 'final']);
  const candidate = safeScreens.has(entryScreen) ? entryScreen : 'checkpoint';
  if (candidate === 'missionStep') {
    const code = currentStationCode();
    const station = STATIONS[code];
    if (!station || !station.steps || !station.steps[state.activeStep]) return 'checkpoint';
  }
  if (candidate === 'checkin' || candidate === 'missionIntro' || candidate === 'missionStep') {
    const code = currentStationCode();
    if (!code || !STATIONS[code]) return 'checkpoint';
  }
  return candidate;
}

function renderSplash() {
  const hasSavedRun = Boolean(state.started && state.group && state.teamName);
  app.innerHTML = `
    <section class="hero-card">
      <span class="kicker">B.O.B. is waking up…</span>
      <h1>Eco XP</h1>
      <h2>Operation Funan Sustainability Run</h2>
      <p>Funan may look like a mall, but today your team will explore it as a living example of how sustainability ideas are built into everyday city spaces.</p>
      <p>Move through the operation, complete each checkpoint, and look closely: some ideas work because they are well designed, while others need people, care, and better choices to keep going.</p>
      ${renderOtterPanel('Meet your Eco Otter. It will collect upgrades as your team clears checkpoints.')}
      ${hasSavedRun ? `
        <div class="section-card">
          <span class="badge ok">Saved operation found</span>
          <p><strong>${escapeHtml(state.group)} — ${escapeHtml(state.teamName)}</strong></p>
          <p>You can continue from where your team left off.</p>
        </div>
        <div class="actions"><button class="primary-btn" data-action="resume">Continue Operation</button><button class="secondary-btn" data-action="new">Start / Change Group</button></div>
      ` : `<div class="actions"><button class="primary-btn" data-action="start">Start Operation</button></div>`}
    </section>`;
  $('[data-action="start"]')?.addEventListener('click', () => { showLoading('Opening team login…'); setTimeout(() => setScreen('login'), 160); });
  $('[data-action="resume"]')?.addEventListener('click', () => {
    const target = getSafeResumeScreen();
    showLoading('Restoring your saved operation…');
    setTimeout(() => setScreen(target), 180);
  });
  $('[data-action="new"]')?.addEventListener('click', () => setScreen('login'));
}

function renderLogin() {
  const groups = Object.keys(ROUTES);
  app.innerHTML = `
    <section class="card">
      <span class="kicker">Join Game</span>
      <h2>Welcome, Eco Ops Crew.</h2>
      <div class="bob-speech"><strong>B.O.B. says:</strong> Choose your crew identity carefully. Your team name will follow you to the final screen.</div>
      <label for="groupSelect">Select your group</label>
      <select id="groupSelect">${groups.map(g => `<option ${state.group === g ? 'selected' : ''}>${g}</option>`).join('')}</select>
      <label for="teamNameInput">Enter your team name</label>
      <input id="teamNameInput" type="text" maxlength="40" placeholder="e.g. The Green Beans" value="${escapeHtml(state.teamName)}" />
      <div class="actions"><button class="primary-btn" id="loginContinue">Continue</button></div>
    </section>`;
  $('#loginContinue').addEventListener('click', async () => {
    const group = $('#groupSelect').value;
    const teamName = $('#teamNameInput').value.trim();
    if (!teamName) return showToast('Please enter your team name.');
    showLoading('B.O.B. is checking your team details…');
    // Starting or changing group should begin a fresh run on this device.
    // This prevents old testing data from blocking mission loading later.
    state = defaultState();
    state.group = group;
    state.teamName = teamName;
    state.route = ROUTES[group];
    state.currentScreen = 'device';
    state.started = false;
    saveState();
    safeSaveGroup();
    setScreen('device');
  });
}

async function safeSaveGroup() {
  saveState();
  backend('saveGroup', { group: state.group, teamName: state.teamName, route: state.route })
    .catch(err => {
      console.warn('Group online save failed; local state is safe.', err);
      showToast('Saved on this device. Online save will retry later.');
    });
}

function renderDeviceConfirm() {
  app.innerHTML = `
    <section class="card">
      <span class="kicker">One-device rule</span>
      <h2>B.O.B. needs one clear team channel.</h2>
      <p>Only <strong>one device</strong> should be used for official submissions.</p>
      <p>Your teammates may discuss, search, observe, and take photos, but this device will be used to check in, submit responses, upload required photos, choose Eco Otter upgrades, unlock learning cards, and show the final screen to teachers.</p>
      <label class="option-card" for="deviceConfirm"><span class="mark">✓</span><div><strong>We confirm</strong><span>This device will be used for official team inputs.</span></div></label>
      <input id="deviceConfirm" class="hidden" type="checkbox" />
      <div class="actions"><button class="primary-btn" id="deviceContinue">Confirm Device</button></div>
    </section>`;
  const label = $('label[for="deviceConfirm"]');
  const input = $('#deviceConfirm');
  label.addEventListener('click', () => setTimeout(() => label.classList.toggle('selected', input.checked), 0));
  $('#deviceContinue').addEventListener('click', () => {
    if (!input.checked) return showToast('Please confirm the one-device rule.');
    setScreen('rules');
  });
}

function renderRules() {
  app.innerHTML = `
    <section class="card">
      <span class="kicker">Operation Rules</span>
      <h2>B.O.B.’s Operation Rules</h2>
      <ol class="info-list">
        <li>Use only one device for official submissions.</li>
        <li>Stay in public areas only.</li>
        <li>Do not enter restricted spaces.</li>
        <li>Be respectful inside shops.</li>
        <li>Do not block walkways, entrances, lifts, escalators, bins, or shopfronts.</li>
        <li>Handle shop items carefully and return them properly.</li>
        <li>Take photos without clearly showing strangers’ faces.</li>
        <li>Use hints if your team is stuck.</li>
        <li>Message teachers or game masters if lost or if something fails to upload.</li>
        <li>Keep to the suggested time at each checkpoint.</li>
        <li>After all checkpoints are cleared, return to the Teachers’ Base.</li>
      </ol>
      <hr />
      <h3>Judging note</h3>
      <p>Some mission responses and photos will be reviewed by teachers using a rubric.</p>
      <p>Strong submissions should use specific observations, explain your team’s judgement clearly, show thoughtful sustainability understanding, suggest realistic improvements where asked, and be creative but respectful.</p>
      <p>Top teams may be recognised at the end of the operation.</p>
      <div class="actions"><button class="primary-btn" id="rulesContinue">Understood</button></div>
    </section>`;
  $('#rulesContinue').addEventListener('click', () => setScreen('briefing'));
}

function renderBriefing() {
  app.innerHTML = `
    <section class="card">
      <span class="kicker">Mission Briefing</span>
      <h2>B.O.B. is online.</h2>
      <div class="bob-speech"><strong>Operation Funan Sustainability Run is loading…</strong></div>
      <p>Around the world, countries are being pushed to act on climate change. Big promises are made at global levels, but real change has to show up in everyday places — where people shop, eat, travel, work, rest, and meet.</p>
      <p>In Singapore, that challenge connects to building a greener, lower-carbon, and more sustainable city.</p>
      <p>But plans only become real when they are built into actual spaces.</p>
      <p>That is why your team is entering Funan today.</p>
      <p>At first glance, it may look like a mall. But hidden across its floors are clues about how sustainability can be designed into city life — through food, transport, shopping, shared spaces, and daily choices.</p>
      <p>Your mission is to clear each checkpoint, make smart choices, and unlock upgrades for your Eco Otter.</p>
      <p>B.O.B. has prepared something for your team’s otter. What it becomes depends on the choices you make.</p>
      <div class="actions"><button class="primary-btn" id="loadRoute">Load My Route</button></div>
    </section>`;
  $('#loadRoute').addEventListener('click', async () => {
    showLoading('B.O.B. is loading your checkpoint route…');
    state.started = true;
    state.currentIndex = state.currentIndex || 0;
    saveState();
    try { await backend('saveProgress', serializeProgress()); } catch (err) { console.warn(err); }
    setScreen('checkpoint');
  });
}

function renderResume() {
  app.innerHTML = `
    <section class="card">
      <span class="kicker">Saved progress found</span>
      <h2>Welcome back.</h2>
      <p>We found saved progress for:</p>
      <p><strong>${escapeHtml(state.group)} — ${escapeHtml(state.teamName)}</strong></p>
      <p>Completed checkpoints: <strong>${completedCount()} / 5</strong></p>
      <div class="actions">
        <button class="primary-btn" id="resumeBtn">Continue Operation</button>
        <button class="ghost-btn" id="resetBtn">This is not my team</button>
      </div>
    </section>`;
  $('#resumeBtn').addEventListener('click', () => { showLoading('Reopening your mission…'); setTimeout(() => setScreen(completedCount() >= 5 ? 'finalBase' : 'checkpoint'), 180); });
  $('#resetBtn').addEventListener('click', () => {
    showLoading('Resetting local game data…');
    if (confirm('Clear saved progress on this device?')) {
      localStorage.removeItem(CONFIG.STORAGE_KEY);
      state = defaultState();
      render();
    }
  });
}

function renderCheckpoint() {
  if (!state.group || !state.teamName) return setScreen('login');
  if (completedCount() >= 5) return setScreen('finalBase');
  const code = currentStationCode();
  const station = STATIONS[code];
  activeHintCount = 0;
  app.innerHTML = `
    <section class="card">
      <span class="kicker">Current Checkpoint</span>
      <h2>Checkpoint ${state.currentIndex + 1} of 5</h2>
      <p><strong>Team:</strong> ${escapeHtml(state.teamName)}<br><strong>Group:</strong> ${escapeHtml(state.group)}</p>
      ${progressDots()}
      ${renderOtterPanel('Your Eco Otter is travelling with your team. Clear this checkpoint to unlock its next upgrade.')}
      <div class="bob-speech"><strong>B.O.B.’s clue:</strong><br>${lines(station.clue)}</div>
      <p><strong>Suggested Time:</strong><br>Recommended time to clear this checkpoint is ${station.suggestedMinutes} minutes.</p>
      <div class="actions">
        <button class="primary-btn" id="foundBtn">${station.isRecharge ? 'We’re at our Break Time spot' : 'We found it — Check in'}</button>
        ${station.isRecharge ? '' : '<button class="secondary-btn" id="hintBtn">Need a hint?</button>'}
        <button class="ghost-btn" id="helpBtn">Help</button>
      </div>
    </section>`;
  $('#foundBtn').addEventListener('click', async () => {
    if (station.isRecharge) {
      showLoading('Break spot confirmed. B.O.B. is opening your Break Time mission…');
      state.checkinUnlocked[code] = true;
      saveState();
      await safeSaveProgress();
      setScreen('missionIntro');
    } else {
      setScreen('checkin');
    }
  });
  if (!station.isRecharge) $('#hintBtn').addEventListener('click', () => setScreen('hints'));
  $('#helpBtn').addEventListener('click', () => showHelpModal('lost'));
}

function renderHints() {
  const station = STATIONS[currentStationCode()];
  activeHintCount = Math.max(activeHintCount, 1);
  const hintsToShow = station.hints.slice(0, activeHintCount);
  app.innerHTML = `
    <section class="card">
      <span class="kicker">Need a hint?</span>
      <h2>B.O.B. can help.</h2>
      <div class="grid">
        ${hintsToShow.map((h, idx) => `<div class="section-card"><span class="badge ${idx === station.hints.length - 1 ? 'warning' : ''}">${idx === station.hints.length - 1 ? 'Emergency Hint' : `Hint ${idx + 1}`}</span><p>${escapeHtml(h)}</p></div>`).join('')}
      </div>
      <div class="actions">
        ${activeHintCount < station.hints.length ? '<button class="secondary-btn" id="moreHint">Show another hint</button>' : '<button class="secondary-btn" id="copyLost">Copy Help Message</button>'}
        <button class="ghost-btn" id="backClue">Back to clue</button>
      </div>
    </section>`;
  if ($('#moreHint')) $('#moreHint').addEventListener('click', () => { activeHintCount += 1; renderHints(); });
  if ($('#copyLost')) $('#copyLost').addEventListener('click', () => showHelpModal('lost'));
  $('#backClue').addEventListener('click', () => setScreen('checkpoint'));
}

function renderCheckin() {
  const code = currentStationCode();
  const station = STATIONS[code];
  app.innerHTML = `
    <section class="card">
      <span class="kicker">Checkpoint Check</span>
      <h2>B.O.B. needs proof.</h2>
      <p>${lines(station.checkin.prompt)}</p>
      <label for="checkinAnswer">Your answer</label>
      <div class="grid">
        <input id="checkinAnswer" type="text" autocomplete="off" />
      </div>
      <div class="actions"><button class="primary-btn" id="submitCheckin">Submit Check-in</button><button class="ghost-btn" id="checkinBack">Back</button></div>
    </section>`;
  $('#submitCheckin').addEventListener('click', async () => {
    const answer = $('#checkinAnswer').value;
    showLoading('Checking your location…');
    await sleep(260);
    if (station.checkin.validator(answer)) {
      state.checkinUnlocked[code] = true;
      stationData(code).checkinAnswer = answer;
      saveState();
      await safeSaveProgress();
      showToast('Checkpoint unlocked. B.O.B. confirms your location.');
      setScreen('missionIntro');
    } else {
      app.innerHTML = `
        <section class="card">
          <span class="kicker">Not quite</span>
          <h2>Check carefully and try again.</h2>
          <p>Check the location carefully. If your team is stuck, use the hints or message the teachers/game masters.</p>
          <div class="actions"><button class="primary-btn" id="tryAgain">Try Again</button><button class="secondary-btn" id="hintAgain">Need a hint?</button><button class="ghost-btn" id="helpAgain">Help</button></div>
        </section>`;
      $('#tryAgain').addEventListener('click', () => renderCheckin());
      $('#hintAgain').addEventListener('click', () => setScreen('hints'));
      $('#helpAgain').addEventListener('click', () => showHelpModal('lost'));
    }
  });
  $('#checkinBack').addEventListener('click', () => setScreen('checkpoint'));
}

function renderMissionIntro() {
  const station = STATIONS[currentStationCode()];
  app.innerHTML = `
    <section class="card">
      <span class="kicker">Checkpoint unlocked</span>
      <h2>${escapeHtml(station.title)}</h2>
      <div class="bob-speech"><strong>B.O.B. says:</strong><br>${lines(station.missionIntro)}</div>
      <div class="actions"><button class="primary-btn" id="startMission">Start Mission</button></div>
    </section>`;
  $('#startMission').addEventListener('click', () => { showLoading('Opening your mission…'); setTimeout(() => setScreen('missionStep', { step: 0 }), 180); });
}

function stationData(code = currentStationCode()) {
  state.stationData[code] = state.stationData[code] || {};
  return state.stationData[code];
}


function stationHeader(station, stepIndex = null, total = null) {
  const stepLine = stepIndex !== null ? `<div class="badge">Step ${stepIndex + 1} of ${total}</div>` : '';
  return `<div class="kicker">${escapeHtml(station.shortTitle)}</div>${stepLine}<h2>${escapeHtml(station.title)}</h2>`;
}

function renderMissionStep() {
  const code = currentStationCode();
  const station = STATIONS[code];
  const step = station.steps[state.activeStep];
  if (!step) return completeMission(code);

  const total = station.steps.length;
  let body = '';
  switch (step.type) {
    case 'info': body = renderInfoStep(step); break;
    case 'checklist': body = renderChecklistStep(step); break;
    case 'singleChoice': body = renderSingleChoiceStep(step); break;
    case 'text': body = renderTextStep(step); break;
    case 'textarea': body = renderTextareaStep(step); break;
    case 'photoCaption': body = renderPhotoStep(step, true); break;
    case 'photoOnly': body = renderPhotoStep(step, false); break;
    case 'product': body = renderProductStep(step); break;
    case 'lowerCarbonDay': body = renderLowerCarbonDayStep(step); break;
    case 's5Response': body = renderS5ResponseStep(step); break;
    default: body = `<p>Unsupported step type: ${escapeHtml(step.type)}</p>`;
  }

  app.innerHTML = `<section class="card">${stationHeader(station, state.activeStep, total)}${body}</section>`;
  bindStepHandlers(step);
}

function renderInfoStep(step) {
  return `
    <h3>${escapeHtml(step.title)}</h3>
    <div class="bob-speech">${lines(step.text)}</div>
    <div class="actions"><button class="primary-btn" data-next>Continue</button></div>`;
}

function renderChecklistStep(step) {
  const data = stationData();
  const saved = data[step.key]?.selections || [];
  const other = data[step.key]?.other || '';
  return `
    <h3>${escapeHtml(step.title)}</h3><p>${escapeHtml(step.instruction)}</p>
    ${step.groups.map((group, gi) => `
      <div class="spacer"></div><h3>${escapeHtml(group.label)}</h3>
      <div class="grid">
        ${group.options.map((opt, oi) => {
          const id = `${step.key}_${gi}_${oi}`;
          const selected = saved.includes(opt);
          return `<button type="button" class="option-card ${selected ? 'selected' : ''}" data-toggle="${escapeHtml(opt)}"><span class="mark">${selected ? '✓' : ''}</span><div><strong>${escapeHtml(opt)}</strong></div></button>`;
        }).join('')}
      </div>`).join('')}
    <label for="otherInput">${escapeHtml(step.otherLabel || 'Other')}</label>
    <input id="otherInput" type="text" value="${escapeHtml(other)}" placeholder="Optional" />
    <div class="actions"><button class="primary-btn" data-next>Continue</button></div>`;
}

function renderSingleChoiceStep(step) {
  const data = stationData();
  const saved = data[step.key]?.choice || '';
  const other = data[step.key]?.other || '';
  return `
    <h3>${escapeHtml(step.title)}</h3><p>${escapeHtml(step.instruction)}</p>
    <div class="grid">
      ${step.options.map(opt => `<button type="button" class="option-card ${saved === opt ? 'selected' : ''}" data-choice="${escapeHtml(opt)}"><span class="mark">${saved === opt ? '✓' : ''}</span><div><strong>${escapeHtml(opt)}</strong></div></button>`).join('')}
    </div>
    ${step.otherLabel ? `<label for="otherInput">${escapeHtml(step.otherLabel)}</label><input id="otherInput" type="text" value="${escapeHtml(other)}" placeholder="Optional" />` : ''}
    <div class="actions"><button class="primary-btn" data-next>Continue</button></div>`;
}

function renderTextStep(step) {
  const val = stationData()[step.key]?.value || '';
  return `
    <h3>${escapeHtml(step.title)}</h3><p>${escapeHtml(step.instruction)}</p>
    <label for="textInput">${escapeHtml(step.label || 'Answer')}</label>
    <input id="textInput" type="text" value="${escapeHtml(val)}" />
    <div class="actions"><button class="primary-btn" data-next>Continue</button></div>`;
}

function renderTextareaStep(step) {
  const val = stationData()[step.key]?.value || '';
  return `
    <h3>${escapeHtml(step.title)}</h3><div class="bob-speech">${lines(step.instruction)}</div>
    <textarea id="textareaInput" placeholder="${escapeHtml(step.placeholder || '')}">${escapeHtml(val)}</textarea>
    <div class="actions"><button class="primary-btn" data-next>${isLastStep() ? 'Submit Mission' : 'Continue'}</button></div>`;
}

function renderProductStep(step) {
  const data = stationData()[step.key] || {};
  const categories = ['Reusable item', 'Personal care', 'Food / drink', 'Cleaning / household', 'Clothing / textile', 'Gift / lifestyle', 'Other'];
  return `
    <h3>${escapeHtml(step.title)}</h3>
    <p>Choose one product your team wants to investigate.</p>
    <label for="productName">Product name</label>
    <input id="productName" type="text" value="${escapeHtml(data.name || '')}" />
    <label for="productCategory">Product category</label>
    <select id="productCategory">${categories.map(cat => `<option ${data.category === cat ? 'selected' : ''}>${escapeHtml(cat)}</option>`).join('')}</select>
    <div class="actions"><button class="primary-btn" data-next>Continue</button></div>`;
}

function renderPhotoStep(step, withCaption) {
  const data = stationData()[step.key] || {};
  const photo = state.photos[currentStationCode()];
  return `
    <h3>${escapeHtml(step.title)}</h3>
    <div class="bob-speech">${lines(step.text)}</div>
    ${withCaption ? `<label for="captionInput">${escapeHtml(step.captionLabel)}</label><textarea id="captionInput">${escapeHtml(data.caption || '')}</textarea>` : ''}
    <div class="file-input">
      <label for="photoInput">Upload group photo</label>
      <input id="photoInput" type="file" accept="image/*" />
      ${photo ? (photo.bypassed
        ? `<span class="badge warning">Photo bypassed by teacher</span><small>${escapeHtml(photo.bypassNote || photo.failureMessage || 'Teacher approved bypass after upload failure.')}</small>`
        : `<span class="badge ok">Photo uploaded: ${escapeHtml(photo.fileName)}</span>${photo.preview ? `<img src="${photo.preview}" class="file-preview" alt="Uploaded photo preview" />` : ''}`)
        : '<span class="badge warning">Photo required for this checkpoint</span>'}
    </div>
    <div class="actions"><button class="primary-btn" id="uploadPhotoBtn">${photo && !photo.bypassed ? 'Replace Photo' : 'Upload Photo'}</button><button class="secondary-btn" data-next ${photo ? '' : 'disabled'}>Continue</button></div>`;
}

function renderLowerCarbonDayStep(step) {
  const data = stationData()[step.key] || { needs: [] };
  const needs = ['Stay / rest', 'Eat', 'Work / study', 'Shop for essentials', 'Watch a performance or movie', 'Meet people', 'Use public transport', 'Use underpass connections', 'Cycle or walk', 'Visit rooftop greenery or urban farm', 'Access services', 'Explore nearby civic or cultural places'];
  return `
    <h3>${escapeHtml(step.title)}</h3>
    <p>For your chosen user, design a day where they can meet several needs in or near Funan while reducing unnecessary travel.</p>
    <p>A lower-carbon day means a day where fewer extra journeys are needed, and where walking, cycling, public transport, or shared spaces can help reduce the environmental impact of daily activities.</p>
    <p>Select at least 4 needs your user can meet.</p>
    <div class="grid">
      ${needs.map(n => `<button type="button" class="option-card ${(data.needs || []).includes(n) ? 'selected' : ''}" data-need="${escapeHtml(n)}"><span class="mark">${(data.needs || []).includes(n) ? '✓' : ''}</span><div><strong>${escapeHtml(n)}</strong></div></button>`).join('')}
    </div>
    <label for="dayPlan">Your lower-carbon day</label>
    <textarea id="dayPlan" placeholder="Morning: ...\nAfternoon: ...\nEvening: ...">${escapeHtml(data.plan || '')}</textarea>
    <div class="actions"><button class="primary-btn" data-next>Continue</button></div>`;
}

function renderS5ResponseStep(step) {
  const data = stationData()[step.key] || {};
  const responses = ['Reduce unnecessary packaging', 'Make reusable options easier', 'Improve disposal instructions', 'Improve bin design and sorting behaviour', 'Change habits through reminders or incentives', 'Replace the material with a better alternative', 'Do not buy or use the item if unnecessary'];
  return `
    <h3>${escapeHtml(step.title)}</h3>
    <label for="spotted">We spotted</label>
    <input id="spotted" type="text" value="${escapeHtml(data.spotted || '')}" />
    <label>It seems</label>
    <div class="grid three">
      ${['Sustainable', 'Unsustainable', 'Confusing'].map(opt => `<button type="button" class="option-card ${data.seems === opt ? 'selected' : ''}" data-seems="${opt}"><span class="mark">${data.seems === opt ? '✓' : ''}</span><div><strong>${opt}</strong></div></button>`).join('')}
    </div>
    <label for="because">because</label>
    <input id="because" type="text" value="${escapeHtml(data.because || '')}" />
    <label for="hiddenIssue">The hidden issue is</label>
    <input id="hiddenIssue" type="text" value="${escapeHtml(data.hiddenIssue || '')}" />
    <label>Which response would most reduce the problem?</label>
    <div class="grid">
      ${responses.map(opt => `<button type="button" class="option-card ${data.responseChoice === opt ? 'selected' : ''}" data-response="${escapeHtml(opt)}"><span class="mark">${data.responseChoice === opt ? '✓' : ''}</span><div><strong>${escapeHtml(opt)}</strong></div></button>`).join('')}
    </div>
    <label for="whyResponse">Why did your team choose this response?</label>
    <textarea id="whyResponse">${escapeHtml(data.whyResponse || '')}</textarea>
    <div class="actions"><button class="primary-btn" data-next>Submit Mission</button></div>`;
}

function isLastStep() {
  const station = STATIONS[currentStationCode()];
  return state.activeStep === station.steps.length - 1;
}

function bindStepHandlers(step) {
  $$('[data-toggle]').forEach(btn => btn.addEventListener('click', () => {
    btn.classList.toggle('selected');
    $('.mark', btn).textContent = btn.classList.contains('selected') ? '✓' : '';
  }));
  $$('[data-choice]').forEach(btn => btn.addEventListener('click', () => {
    $$('[data-choice]').forEach(b => { b.classList.remove('selected'); $('.mark', b).textContent = ''; });
    btn.classList.add('selected'); $('.mark', btn).textContent = '✓';
  }));
  $$('[data-need]').forEach(btn => btn.addEventListener('click', () => {
    btn.classList.toggle('selected'); $('.mark', btn).textContent = btn.classList.contains('selected') ? '✓' : '';
  }));
  $$('[data-seems]').forEach(btn => btn.addEventListener('click', () => {
    $$('[data-seems]').forEach(b => { b.classList.remove('selected'); $('.mark', b).textContent = ''; });
    btn.classList.add('selected'); $('.mark', btn).textContent = '✓';
  }));
  $$('[data-response]').forEach(btn => btn.addEventListener('click', () => {
    $$('[data-response]').forEach(b => { b.classList.remove('selected'); $('.mark', b).textContent = ''; });
    btn.classList.add('selected'); $('.mark', btn).textContent = '✓';
  }));

  const uploadBtn = $('#uploadPhotoBtn');
  if (uploadBtn) uploadBtn.addEventListener('click', () => handlePhotoUpload(step));

  const next = $('[data-next]');
  if (next) next.addEventListener('click', () => handleStepNext(step, next));
}

async function handleStepNext(step, triggerBtn = null) {
  const code = currentStationCode();
  const data = stationData(code);

  try {
    if (step.type === 'info') data[step.key] = { viewed: true };
    if (step.type === 'checklist') {
      data[step.key] = {
        selections: $$('[data-toggle].selected').map(btn => btn.dataset.toggle),
        other: $('#otherInput')?.value.trim() || ''
      };
    }
    if (step.type === 'singleChoice') {
      const selected = $('[data-choice].selected')?.dataset.choice || '';
      if (!selected) return showToast('Please choose one option.');
      data[step.key] = { choice: selected, other: $('#otherInput')?.value.trim() || '' };
    }
    if (step.type === 'text') {
      const value = $('#textInput').value.trim();
      if (!value) return showToast('Please enter a response.');
      data[step.key] = { value };
    }
    if (step.type === 'textarea') {
      const value = $('#textareaInput').value.trim();
      if (!value) return showToast('Please write your response.');
      data[step.key] = { value };
    }
    if (step.type === 'product') {
      const name = $('#productName').value.trim();
      if (!name) return showToast('Please enter the product name.');
      data[step.key] = { name, category: $('#productCategory').value };
    }
    if (step.type === 'photoCaption') {
      if (!state.photos[code]) return showToast('Please upload the required photo first.');
      const caption = $('#captionInput').value.trim();
      if (!caption) return showToast('Please write the photo caption.');
      data[step.key] = { ...(data[step.key] || {}), caption };
    }
    if (step.type === 'photoOnly') {
      if (!state.photos[code]) return showToast('Please upload the required photo first.');
      data[step.key] = { ...(data[step.key] || {}), photoUploaded: true };
    }
    if (step.type === 'lowerCarbonDay') {
      const needs = $$('[data-need].selected').map(btn => btn.dataset.need);
      const plan = $('#dayPlan').value.trim();
      if (needs.length < 4) return showToast('Please select at least 4 needs.');
      if (!plan) return showToast('Please write a simple day plan.');
      data[step.key] = { needs, plan };
    }
    if (step.type === 's5Response') {
      const seems = $('[data-seems].selected')?.dataset.seems || '';
      const responseChoice = $('[data-response].selected')?.dataset.response || '';
      const fields = {
        spotted: $('#spotted').value.trim(),
        seems,
        because: $('#because').value.trim(),
        hiddenIssue: $('#hiddenIssue').value.trim(),
        responseChoice,
        whyResponse: $('#whyResponse').value.trim()
      };
      if (!fields.spotted || !fields.seems || !fields.because || !fields.hiddenIssue || !fields.responseChoice || !fields.whyResponse) {
        return showToast('Please complete all parts of the response.');
      }
      data[step.key] = fields;
    }

    saveState();
    if (triggerBtn) showLoading(isLastStep() ? 'Submitting your mission… Please wait.' : 'Saving your progress… Please wait.');
    await safeSaveProgress();
    if (isLastStep()) {
      await completeMission(code);
    } else {
      setScreen('missionStep', { step: state.activeStep + 1 });
    }
  } catch (err) {
    console.error(err);
    showToast('Something went wrong while saving this step. Try again.');
  }
}

async function completeMission(code) {
  showLoading('Saving your mission response…');
  const payload = buildStationSubmission(code);
  try {
    await backend('saveSubmission', payload);
    state.completed[code] = true;
    state.learningCards[code] = true;
    state.stampLayers[code] = true;
    saveState();
    
    await safeSaveProgress();
    showToast('Saved successfully. Checkpoint cleared.');
    setScreen('upgrade');
  } catch (err) {
    console.error(err);
    showSaveFailureModal(code, err.message);
  }
}

function buildStationSubmission(code) {
  return {
    group: state.group,
    teamName: state.teamName,
    station: code,
    stationTitle: STATIONS[code].title,
    data: stationData(code),
    photo: state.photos[code] || null,
    completedAt: new Date().toISOString()
  };
}

async function safeSaveProgress() {
  saveState();
  backend('saveProgress', serializeProgress())
    .catch(err => console.warn('Progress online save failed; local state is safe.', err));
  return Promise.resolve({ ok: true, queued: true });
}

function serializeProgress() {
  return {
    group: state.group,
    teamName: state.teamName,
    route: state.route,
    currentIndex: state.currentIndex,
    currentStation: currentStationCode() || 'Final',
    completedCount: completedCount(),
    photoCount: photoCount(),
    completed: state.completed,
    photos: state.photos,
    upgrades: state.upgrades,
    learningCards: state.learningCards,
    stampLayers: state.stampLayers,
    finalShown: state.finalShown,
    finalBaseConfirmed: state.finalBaseConfirmed,
    celebrationShown: state.celebrationShown,
    isGroupIC: state.group === 'Group IC'
  };
}

async function handlePhotoUpload(step) {
  const code = currentStationCode();
  const input = $('#photoInput');
  const file = input.files?.[0];
  if (!file) return showToast('Please choose a photo first.');
  if (!file.type.startsWith('image/')) return showToast('Please upload an image file.');
  if (file.size > 8 * 1024 * 1024) return showToast('Photo is too large. Please choose a smaller image.');

  try {
    if (step.type === 'photoCaption') {
      const caption = $('#captionInput').value.trim();
      if (!caption) return showToast('Please write the caption before uploading.');
      stationData(code)[step.key] = { ...(stationData(code)[step.key] || {}), caption };
    }
    showLoading('Uploading your photo… Please keep this page open.');
    const dataUrl = await fileToDataUrl(file);
    const attempt = (state.photos[code]?.attempt || 0) + 1;
    const fileName = makePhotoFileName(code, attempt, file.name);
    const payload = { group: state.group, teamName: state.teamName, station: code, fileName, mimeType: file.type, dataUrl };
    const result = await backend('uploadPhoto', payload);
    state.photos[code] = {
      fileName: result.fileName || fileName,
      driveLink: result.driveLink || '',
      attempt,
      uploadedAt: new Date().toISOString(),
      preview: dataUrl,
      mock: Boolean(result.mock)
    };
    stationData(code)[step.key] = { ...(stationData(code)[step.key] || {}), photoUploaded: true, fileName: state.photos[code].fileName, driveLink: state.photos[code].driveLink };
    saveState();
    
    await safeSaveProgress();
    showToast('Photo uploaded successfully.');
    renderMissionStep();
  } catch (err) {
    console.error(err);
    showUploadFailureModal(code, err.message);
  }
}

function makePhotoFileName(code, attempt, originalName) {
  const groupCode = state.group === 'Group IC' ? 'GIC' : `G${String(state.group.match(/\d+/)?.[0] || '00').padStart(2, '0')}`;
  const ext = (originalName.split('.').pop() || 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '') || 'jpg';
  return `${groupCode}__${code}__${CONFIG.EVENT_DATE_STAMP}__A${attempt}.${ext}`;
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function showUploadFailureModal(code, message) {
  const msg = makeHelpMessage('photo', code);
  showModal(`
    <span class="kicker">Upload issue</span>
    <h2>Photo upload did not complete.</h2>
    <p>Your written responses are still safe on this device.</p>
    <p>Please retry the upload. If it still fails, copy the help message and send it to the teachers/game masters, or ask a teacher to approve bypass.</p>
    <small>${escapeHtml(message || '')}</small>
    <label for="helpMessage">Help message</label>
    <textarea id="helpMessage" readonly>${escapeHtml(msg)}</textarea>
    <div class="actions"><button class="primary-btn" id="retryUpload">Retry Upload</button><button class="secondary-btn" id="copyHelp">Copy Help Message</button><button class="danger-btn" id="teacherBypassUpload">Teacher Bypass Upload</button><button class="ghost-btn" id="closeModal">Close</button></div>`);
  $('#retryUpload').addEventListener('click', () => { closeModal(); renderMissionStep(); });
  $('#copyHelp').addEventListener('click', () => copyText($('#helpMessage').value));
  $('#teacherBypassUpload').addEventListener('click', () => showPhotoBypassModal(code, message || 'Photo upload failed'));
  $('#closeModal').addEventListener('click', () => { closeModal(); renderMissionStep(); });
}

function showPhotoBypassModal(code, failureMessage = '') {
  const station = STATIONS[code] || {};
  showModal(`
    <span class="kicker">Teacher Bypass</span>
    <h2>Allow team to continue without photo upload?</h2>
    <p>Use this only after a real upload failure. This will be recorded as <strong>photo bypassed</strong> for ${escapeHtml(code)} ${escapeHtml(station.shortTitle || '')}.</p>
    <label for="bypassPin">Teacher PIN</label>
    <input id="bypassPin" type="password" inputmode="numeric" autocomplete="off" placeholder="Enter teacher PIN" />
    <label for="bypassNote">Location / note</label>
    <input id="bypassNote" type="text" placeholder="e.g. Upload failed at the station" />
    <div class="actions"><button class="primary-btn" id="confirmPhotoBypass">Confirm Bypass</button><button class="ghost-btn" id="backUploadIssue">Back</button></div>`);
  $('#confirmPhotoBypass').addEventListener('click', () => handlePhotoBypass(code, failureMessage));
  $('#backUploadIssue').addEventListener('click', () => showUploadFailureModal(code, failureMessage));
}

async function handlePhotoBypass(code, failureMessage = '') {
  const pin = $('#bypassPin')?.value.trim();
  const note = $('#bypassNote')?.value.trim() || '';
  if (!pin) return showToast('Enter the teacher PIN for bypass.');
  const btn = $('#confirmPhotoBypass');
  if (btn) { btn.disabled = true; btn.textContent = 'Checking…'; }
  try {
    await backend('getDashboard', { teacherPin: pin });
    localStorage.setItem(CONFIG.TEACHER_PIN_LOCAL_KEY, pin);
    const station = STATIONS[code] || {};
    const step = station.steps?.[state.activeStep] || {};
    const attempt = (state.photos[code]?.attempt || 0) + 1;
    const bypassRecord = {
      fileName: makePhotoFileName(code, attempt, 'teacher-bypass.jpg').replace(/\.[a-z0-9]+$/i, '__BYPASSED.txt'),
      driveLink: '',
      attempt,
      uploadedAt: new Date().toISOString(),
      bypassed: true,
      bypassNote: note,
      failureMessage: failureMessage || 'Photo upload failed'
    };
    state.photos[code] = bypassRecord;
    if (step.key) {
      stationData(code)[step.key] = {
        ...(stationData(code)[step.key] || {}),
        photoUploaded: false,
        photoBypassed: true,
        fileName: bypassRecord.fileName,
        driveLink: '',
        bypassNote: note,
        failureMessage: bypassRecord.failureMessage
      };
    }
    await backend('saveIssue', {
      group: state.group,
      teamName: state.teamName,
      station: code,
      issueType: 'Photo bypass',
      message: `Teacher bypass used for failed photo upload. Note: ${note || 'not provided'}. Failure: ${failureMessage || 'Photo upload failed'}`,
      status: 'Bypassed'
    }).catch(() => null);
    saveState();
    await safeSaveProgress();
    closeModal();
    showToast('Teacher bypass applied. Team may continue.');
    renderMissionStep();
  } catch (err) {
    console.error(err);
    if (btn) { btn.disabled = false; btn.textContent = 'Confirm Bypass'; }
    showToast('Bypass failed. Check teacher PIN.');
  }
}

function showSaveFailureModal(code, message) {
  const msg = makeHelpMessage('save', code);
  showModal(`
    <span class="kicker">Save issue</span>
    <h2>Your response could not be saved online.</h2>
    <p>B.O.B. has kept a copy on this device for now.</p>
    <p>Please retry saving before leaving this checkpoint.</p>
    <small>${escapeHtml(message || '')}</small>
    <label for="helpMessage">Help message</label>
    <textarea id="helpMessage" readonly>${escapeHtml(msg)}</textarea>
    <div class="actions"><button class="primary-btn" id="retrySave">Retry Save</button><button class="secondary-btn" id="copyHelp">Copy Help Message</button><button class="ghost-btn" id="closeModal">Close</button></div>`);
  $('#retrySave').addEventListener('click', () => { closeModal(); completeMission(code); });
  $('#copyHelp').addEventListener('click', () => copyText($('#helpMessage').value));
  $('#closeModal').addEventListener('click', closeModal);
}

function showHelpModal(type = 'lost') {
  const code = currentStationCode() || '';
  const msg = makeHelpMessage(type, code);
  showModal(`
    <span class="kicker">Need help?</span>
    <h2>Message teachers or game masters.</h2>
    <p>Fill in your current floor/location if needed, then copy this message.</p>
    <label for="locationHelp">Current floor/location</label>
    <input id="locationHelp" type="text" placeholder="e.g. Level 2 near escalator" />
    <label for="helpMessage">Help message</label>
    <textarea id="helpMessage" readonly>${escapeHtml(msg)}</textarea>
    <div class="actions"><button class="secondary-btn" id="refreshHelp">Update Location</button><button class="primary-btn" id="copyHelp">Copy Help Message</button><button class="ghost-btn" id="closeModal">Close</button></div>`);
  $('#refreshHelp').addEventListener('click', () => {
    $('#helpMessage').value = makeHelpMessage(type, code, $('#locationHelp').value.trim());
  });
  $('#copyHelp').addEventListener('click', () => copyText($('#helpMessage').value));
  $('#closeModal').addEventListener('click', closeModal);
}

function makeHelpMessage(type, code, location = '') {
  const stationLine = code ? `${code} ${STATIONS[code]?.shortTitle || ''}` : `Checkpoint ${state.currentIndex + 1} of 5`;
  const time = new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  if (type === 'photo') {
    return `Hi teachers, we need help.\n\nGroup: ${state.group}\nTeam name: ${state.teamName}\nCheckpoint: ${stationLine}\nIssue: Photo upload failed\nCurrent location: ${location || '[Please type current location]'}\nTime: ${time}\n\nWe have completed the task but cannot upload the photo.`;
  }
  if (type === 'save') {
    return `Hi teachers, we need help.\n\nGroup: ${state.group}\nTeam name: ${state.teamName}\nCheckpoint: ${stationLine}\nIssue: Response could not be saved online\nCurrent location: ${location || '[Please type current location]'}\nTime: ${time}\n\nOur response is still on this device, but the app cannot save it online.`;
  }
  return `Hi teachers, we are lost.\n\nGroup: ${state.group}\nTeam name: ${state.teamName}\nCurrent checkpoint: ${state.currentIndex + 1} of 5\nCurrent floor/location: ${location || '[Please type current floor/location]'}\nIssue: We cannot find the checkpoint.\n\nPlease advise.`;
}

function showModal(innerHtml) {
  closeModal();
  const wrap = document.createElement('div');
  wrap.className = 'modal-backdrop';
  wrap.id = 'modalBackdrop';
  wrap.innerHTML = `<section class="card modal">${innerHtml}</section>`;
  document.body.appendChild(wrap);
}

function closeModal() {
  $('#modalBackdrop')?.remove();
}

async function copyText(text, successMessage = 'Copied successfully.') {
  try {
    await navigator.clipboard.writeText(text);
    showToast(successMessage);
  } catch {
    showToast('Copy failed. Please long-press and copy manually.');
  }
}

function renderUpgrade() {
  const code = currentStationCode();
  const station = STATIONS[code];
  const cfg = UPGRADE_SLOTS[code];
  const chosen = state.upgrades[code]?.id || '';
  app.innerHTML = `
    <section class="card">
      <span class="kicker">Checkpoint cleared!</span>
      <h2>Great work, Eco Ops Crew.</h2>
      <p>Your team has completed <strong>${escapeHtml(station.shortTitle)}</strong> and unlocked an Eco Otter ${escapeHtml(cfg.label)}.</p>
      <div id="upgradePreviewHost">${renderOtterPanel('Choose one upgrade. Your otter will wear it for the rest of the game.')}</div>
      <h3>Choose one:</h3>
      <div class="grid two">
        ${cfg.options.map(opt => `<button type="button" class="option-card upgrade-choice ${chosen === opt.id ? 'selected' : ''}" data-upgrade="${escapeHtml(opt.id)}">${renderAccessoryCardSvg(opt.id)}<div><strong>${escapeHtml(opt.name)}</strong><span>Your otter will keep this upgrade until the end.</span></div></button>`).join('')}
      </div>
      <div class="actions"><button class="primary-btn" id="confirmUpgrade">Confirm Upgrade</button></div>
    </section>`;
  $$('[data-upgrade]').forEach(btn => btn.addEventListener('click', () => {
    $$('[data-upgrade]').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    const selectedId = btn.dataset.upgrade;
    const option = cfg.options.find(o => o.id === selectedId);
    const previewHost = document.getElementById('upgradePreviewHost');
    if (previewHost) {
      const saved = state.upgrades[code];
      if (option) state.upgrades[code] = { ...option, slot: cfg.slot };
      previewHost.innerHTML = renderOtterPanel('Preview your chosen upgrade before you confirm.');
      if (saved) state.upgrades[code] = saved; else delete state.upgrades[code];
    }
  }));
  $('#confirmUpgrade').addEventListener('click', async () => {
    const selectedId = $('[data-upgrade].selected')?.dataset.upgrade;
    if (!selectedId) return showToast('Please choose one upgrade.');
    const option = cfg.options.find(o => o.id === selectedId);
    showLoading('Applying your Eco Otter upgrade…');
    state.upgrades[code] = { ...option, slot: cfg.slot };
    saveState();
    
    await safeSaveProgress();
    setScreen('learning');
  });
}

function renderLearningCard() {
  const code = currentStationCode();
  const card = LEARNING_CARDS[code];
  app.innerHTML = `
    <section class="card">
      <span class="kicker">Learning Card Unlocked</span>
      <div class="learning-card">
        <h2>${escapeHtml(card.title)}</h2>
        <h3>What this station teaches</h3>
        <ol class="info-list">${card.points.map(p => `<li>${escapeHtml(p)}</li>`).join('')}</ol>
        <div class="bob-speech"><strong>B.O.B.’s takeaway:</strong><br>${escapeHtml(card.takeaway)}</div>
      </div>
      <div class="actions"><button class="primary-btn" id="addCard">Add to Learning Deck</button></div>
    </section>`;
  $('#addCard').addEventListener('click', async () => {
    showLoading('Adding this card to your Learning Deck…');
    state.learningCards[code] = true;
    saveState();
    
    await safeSaveProgress();
    setScreen('stamp');
  });
}


function renderStampReveal() {
  app.innerHTML = `
    <section class="card">
      <span class="kicker">Congratulations, Eco Ops Crew!</span>
      <h2>Another part of the picture is revealed</h2>
      <p>Your team has uncovered more of the final collectible artwork.</p>
      <p>Keep going to slowly reveal the full picture.</p>
      ${renderStampArt()}
      <div class="actions"><button class="primary-btn" id="afterStamp">${completedCount() >= 5 ? 'Unlock Final Teachers’ Base' : 'Open Next Clue'}</button></div>
    </section>`;
  $('#afterStamp').addEventListener('click', async () => {
    showLoading(completedCount() >= 5 ? 'Unlocking Final Teachers’ Base…' : 'Loading your next checkpoint…');
    if (completedCount() < 5) {
      state.currentIndex += 1;
    }
    saveState();
    
    await safeSaveProgress();
    setScreen(completedCount() >= 5 ? 'finalBase' : 'checkpoint');
  });
}

function renderFinalBase() {
  app.innerHTML = `
    <section class="card">
      <span class="kicker">All checkpoints cleared</span>
      <h2>B.O.B. final dispatch</h2>
      <p>Your team has completed all 5 checkpoints. Your Eco Otter has received all upgrades. Your learning deck is complete. Your operation artwork is ready for final reveal.</p>
      <div class="bob-speech"><strong>One final step remains:</strong><br>Return to the ${escapeHtml(CONFIG.TEACHER_BASE_LABEL)} and show your final screen.</div>
      <div class="actions"><button class="primary-btn" id="showFinal">Show Final Screen</button></div>
    </section>`;
  $('#showFinal').addEventListener('click', async () => {
    state.finalShown = true;
    saveState();
    
    await safeSaveProgress();
    setScreen('final');
  });
}

function renderFinalScreen() {
  app.innerHTML = `
    <section class="card">
      <span class="kicker">Operation Complete</span>
      <h2>Eco XP: Operation Funan Sustainability Run</h2>
      <p><strong>Team:</strong> ${escapeHtml(state.teamName)}<br><strong>Group:</strong> ${escapeHtml(state.group)}</p>
      <div class="grid two">
        <div class="section-card"><span class="badge ok">Stations cleared: 5 / 5</span></div>
        <div class="section-card"><span class="badge ok">Photo uploads: ${photoCount()} / 3</span></div>
        <div class="section-card"><span class="badge ok">Learning cards: ${Object.keys(state.learningCards).length} / 5</span></div>
        <div class="section-card"><span class="badge ok">Status: Complete</span></div>
      </div>
      ${renderOtterPanel('Your fully upgraded Eco Otter is ready. You can download it as a PNG souvenir when you finish.')}
      <div class="bob-speech"><strong>B.O.B.’s final note:</strong><br>Sustainable systems are not just built once. They need people, choices, care, and better design to keep working.</div>
      <h3>Show this screen to your teacher.</h3>
      <div class="actions"><button class="secondary-btn" id="copySummary">Copy Completion Summary</button><button class="secondary-btn" id="downloadAvatar">Download Eco Otter PNG</button><button class="primary-btn" id="goCelebrate">Complete Mission</button></div>
    </section>`;
  $('#copySummary').addEventListener('click', () => copyText(`Eco XP complete
Group: ${state.group}
Team: ${state.teamName}
Stations cleared: 5/5
Photos uploaded: ${photoCount()}/3`, 'Completion summary copied.'));
  $('#downloadAvatar')?.addEventListener('click', downloadFinalAvatar);
  $('#goCelebrate').addEventListener('click', () => {
    state.celebrationShown = true;
    saveState();
    setScreen('celebration');
  });
}

function renderCelebrationScreen() {
  app.innerHTML = `
    <section class="card celebration-card">
      <span class="kicker">Mission Accomplished</span>
      <h2>Mission Accomplished, Eco Ops Crew!</h2>
      <p class="celebration-subtitle">You have completed the Funan Sustainability Run and uncovered the full collectible artwork.</p>
      <div class="bob-speech"><strong>Eco title unlocked:</strong><br>You are now <strong>Funan Sustainability Explorers</strong> — ready to observe, question and improve real sustainability systems.</div>
      <div class="stamp-art stamp-art-final" aria-label="Final collectible artwork">
        <img src="assets/stamp/stamp_final.jpg" alt="Final collectible artwork" class="stamp-image" />
      </div>
      <div class="actions"><button class="secondary-btn" id="backSummary">Back to Summary</button></div>
    </section>`;
  $('#backSummary').addEventListener('click', () => setScreen('final'));
}





function buildOtterOverlaySvgMarkup(layer) {
  const upgrades = Object.values(state.upgrades || {}).filter(Boolean);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 260 280">${upgrades.map(upgrade => renderAccessorySvg(upgrade, layer)).join('')}</svg>`;
}

function loadImageAsset(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

async function downloadFinalAvatar() {
  const safeTeam = (state.teamName || 'team').replace(/[^a-z0-9]+/gi, '_').replace(/^_+|_+$/g, '') || 'team';
  try {
    const canvas = document.createElement('canvas');
    canvas.width = 720;
    canvas.height = 760;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#f6f4ef';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'rgba(37, 61, 77, 0.12)';
    ctx.beginPath();
    ctx.ellipse(360, 690, 165, 22, 0, 0, Math.PI * 2);
    ctx.fill();

    const backSvg = buildOtterOverlaySvgMarkup('back');
    const backImg = await loadImageAsset('data:image/svg+xml;charset=utf-8,' + encodeURIComponent(backSvg));
    ctx.drawImage(backImg, 120, 36, 470, 690);

    const baseImg = await loadImageAsset('assets/otter/base_otter.png');
    ctx.drawImage(baseImg, 120, 36, 470, 690);

    const frontSvg = buildOtterOverlaySvgMarkup('front');
    const frontImg = await loadImageAsset('data:image/svg+xml;charset=utf-8,' + encodeURIComponent(frontSvg));
    ctx.drawImage(frontImg, 120, 36, 470, 690);

    canvas.toBlob(blob => {
      if (!blob) {
        showToast('PNG export failed on this device. Please try another browser.');
        return;
      }
      const pngUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = pngUrl;
      a.download = `EcoOtter_${safeTeam}.png`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(pngUrl);
      showToast('Eco Otter PNG download started.');
    }, 'image/png');
  } catch (err) {
    console.error(err);
    showToast('PNG export failed on this device.');
  }
}

function renderTeacherLoginOrDashboard() {
  state.mode = 'teacher';
  const stored = localStorage.getItem(CONFIG.TEACHER_PIN_LOCAL_KEY) || '';
  if (!stored) {
    app.innerHTML = `
      <section class="card">
        <span class="kicker">Teacher Dashboard</span>
        <h2>Enter teacher PIN</h2>
        <p>This protects dashboard viewing and scoring.</p>
        <label for="pinInput">Teacher PIN</label>
        <input id="pinInput" type="password" />
        <div class="actions"><button class="primary-btn" id="teacherLogin">Open Dashboard</button><button class="ghost-btn" id="studentMode">Back to Student App</button></div>
      </section>`;
    $('#teacherLogin').addEventListener('click', () => {
      const pin = $('#pinInput').value.trim();
      if (!pin) return showToast('Enter the teacher PIN.');
      localStorage.setItem(CONFIG.TEACHER_PIN_LOCAL_KEY, pin);
      renderTeacherDashboard();
    });
    $('#studentMode').addEventListener('click', () => { location.hash = ''; state.mode = 'student'; setScreen(state.currentScreen || 'splash'); });
  } else {
    renderTeacherDashboard();
  }
}

async function renderTeacherDashboard() {
  showLoading('Loading teacher dashboard…');
  let data;
  try {
    data = await backend('getDashboard', { teacherPin: localStorage.getItem(CONFIG.TEACHER_PIN_LOCAL_KEY) || '' });
  } catch (err) {
    console.error(err);
    data = { groups: [], submissions: [], photos: [], scores: [], error: err.message };
  }
  const groups = data.groups || [];
  app.innerHTML = `
    <section class="card">
      <span class="kicker">Teacher Dashboard</span>
      <h2>Live Progress View</h2>
      ${data.error ? `<p class="badge issue">${escapeHtml(data.error)}</p>` : ''}
      <div class="actions row"><button class="secondary-btn" id="refreshDash">Refresh</button><button class="ghost-btn" id="clearPin">Change PIN</button></div>
      <div class="table-wrap"><table>
        <thead><tr><th>Group</th><th>Team</th><th>Current</th><th>Completed</th><th>Photos</th><th>Last save</th><th>Status</th></tr></thead>
        <tbody>${groups.length ? groups.map(g => `<tr><td>${escapeHtml(g.group)}</td><td>${escapeHtml(g.teamName)}</td><td>${escapeHtml(g.currentStation || '')}</td><td>${escapeHtml(g.completedCount ?? 0)}/5</td><td>${escapeHtml(g.photoCount ?? 0)}/3</td><td>${formatTime(g.lastSave)}</td><td><span class="badge ${g.status === 'Complete' ? 'ok' : ''}">${escapeHtml(g.status || '')}</span></td></tr>`).join('') : '<tr><td colspan="7">No groups found yet.</td></tr>'}</tbody>
      </table></div>
      <hr />
      <h2>Station-based Judging View</h2>
      <p>Choose a station, review each team’s main B.O.B. response and supporting evidence, then enter a 0–10 score.</p><div class="rubric-strip"><span><strong>3</strong> evidence</span><span><strong>3</strong> sustainability understanding</span><span><strong>3</strong> reasoning / judgement</span><span><strong>1</strong> clarity / creativity</span></div>
      <label for="stationJudgeSelect">Station</label>
      <select id="stationJudgeSelect">
        <option value="S1">S1 Rooftop Rescue</option>
        <option value="S2">S2 Green Basket Battle</option>
        <option value="S3">S3 Pedal Proof</option>
        <option value="S4">S4 One Building, Many Lives</option>
        <option value="S5">S5 Break Time</option>
      </select>
      <div id="judgeCards" class="grid"></div>
      <hr />
      <h2>Ranking View</h2>
      <p>Scores update after teacher scoring is saved.</p>
      <div class="table-wrap"><table>
        <thead><tr><th>Rank</th><th>Group</th><th>Team</th><th>S1</th><th>S2</th><th>S3</th><th>S4</th><th>S5</th><th>Total</th></tr></thead>
        <tbody>${renderScoreRows(data.scores || [])}</tbody>
      </table></div>
    </section>`;
  $('#refreshDash').addEventListener('click', renderTeacherDashboard);
  $('#clearPin').addEventListener('click', () => { localStorage.removeItem(CONFIG.TEACHER_PIN_LOCAL_KEY); renderTeacherLoginOrDashboard(); });
  const renderJudge = () => renderJudgeCards(data, $('#stationJudgeSelect').value);
  $('#stationJudgeSelect').addEventListener('change', renderJudge);
  renderJudge();
}


function renderJudgeCards(data, stationCode) {
  const host = $('#judgeCards');
  if (!host) return;
  const latest = latestSubmissionsByGroup(data.submissions || [], stationCode);
  const scores = scoreLookup(data.scores || []);
  const photos = latestPhotosByGroup(data.photos || [], stationCode);
  const groups = (data.groups || []).filter(g => !g.isGroupIC);
  if (!groups.length) {
    host.innerHTML = '<div class="section-card">No group progress found yet.</div>';
    return;
  }
  host.innerHTML = groups.map(g => {
    const sub = latest[g.group];
    const photo = photos[g.group];
    const scoreKey = `${g.group}__${stationCode}`;
    const existing = scores[scoreKey] || {};
    return `<div class="section-card">
      <div class="badge">${escapeHtml(g.group)} — ${escapeHtml(g.teamName || '')}</div>
      <h3>${escapeHtml(STATIONS[stationCode]?.shortTitle || stationCode)}</h3>
      ${photo ? `<p><a href="${escapeHtml(photo.driveLink)}" target="_blank" rel="noopener">View photo</a> <small>${escapeHtml(photo.fileName)}</small></p>` : '<p><span class="badge warning">No photo for this station / not required</span></p>'}
      ${sub ? `<div class="bob-speech">${summarizeSubmissionForTeacher(sub.payload || {})}</div>` : '<p><span class="badge warning">No submission yet</span></p>'}
      <label>Score / 10</label>
      <input type="text" inputmode="numeric" pattern="[0-9]*" value="${escapeHtml(existing.score ?? '')}" data-score-input="${escapeHtml(g.group)}__${stationCode}" />
      <label>Teacher comment</label>
      <input type="text" value="${escapeHtml(existing.comment || '')}" data-comment-input="${escapeHtml(g.group)}__${stationCode}" />
      <div class="actions"><button class="primary-btn small" data-save-score="${escapeHtml(g.group)}__${stationCode}">Save Score</button></div>
    </div>`;
  }).join('');

  $$('[data-save-score]').forEach(btn => btn.addEventListener('click', async () => {
    const [group, station] = btn.dataset.saveScore.split('__');
    const groupInfo = groups.find(g => g.group === group) || {};
    const score = $(`[data-score-input="${CSS.escape(btn.dataset.saveScore)}"]`).value.trim();
    const comment = $(`[data-comment-input="${CSS.escape(btn.dataset.saveScore)}"]`).value.trim();
    if (score === '' || Number.isNaN(Number(score)) || Number(score) < 0 || Number(score) > 10) return showToast('Enter a score from 0 to 10.');
    btn.disabled = true;
    btn.textContent = 'Saving…';
    try {
      await backend('saveScore', {
        teacherPin: localStorage.getItem(CONFIG.TEACHER_PIN_LOCAL_KEY) || '',
        group,
        teamName: groupInfo.teamName || '',
        station,
        score: Number(score),
        comment,
        judge: 'Teacher'
      });
      showToast('Score saved.');
      await renderTeacherDashboard();
    } catch (err) {
      console.error(err);
      showToast('Score save failed. Check teacher PIN / backend.');
      btn.disabled = false;
      btn.textContent = 'Save Score';
    }
  }));
}

function latestSubmissionsByGroup(submissions, stationCode) {
  const out = {};
  submissions.filter(s => s.station === stationCode).forEach(s => {
    if (!out[s.group] || new Date(s.timestamp) > new Date(out[s.group].timestamp)) out[s.group] = s;
  });
  return out;
}

function latestPhotosByGroup(photos, stationCode) {
  const out = {};
  photos.filter(p => p.station === stationCode).forEach(p => {
    if (!out[p.group] || new Date(p.timestamp) > new Date(out[p.group].timestamp)) out[p.group] = p;
  });
  return out;
}

function scoreLookup(scores) {
  const out = {};
  scores.forEach(s => {
    ['S1','S2','S3','S4','S5'].forEach(code => {
      const key = `${code}Score`;
      if (s[key] !== undefined && s[key] !== '') out[`${s.group}__${code}`] = { score: s[key], comment: s[`${code}Comment`] || '' };
    });
  });
  return out;
}

function summarizeSubmissionForTeacher(payload) {
  const review = buildTeacherReview(payload);
  if (!review) return '<p>No response details captured.</p>';

  const supportingHtml = review.supporting.length
    ? `<details class="teacher-details" open><summary>Supporting evidence / choices</summary>${review.supporting.map(item => `<p><strong>${escapeHtml(item.label)}:</strong><br>${escapeHtml(item.value)}</p>`).join('')}</details>`
    : '<p><span class="badge warning">No supporting evidence captured.</span></p>';

  const checkinHtml = review.checkin
    ? `<p class="teacher-meta"><strong>Checkpoint check:</strong> ${escapeHtml(review.checkin)}</p>`
    : '';

  return `
    <div class="teacher-review">
      ${checkinHtml}
      <div class="main-response">
        <span class="badge ok">Main B.O.B. response</span>
        <h4>${escapeHtml(review.mainTitle)}</h4>
        <p>${escapeHtml(review.mainResponse || 'No main response captured.')}</p>
      </div>
      ${supportingHtml}
    </div>`;
}

function buildTeacherReview(payload) {
  const data = payload.data || {};
  const station = payload.station || '';
  const schema = {
    S1: {
      mainKey: 's1BigQuestion',
      mainTitle: 'Why do some sustainability initiatives last while others fade?',
      support: [
        ['s1Diagnosis', 'Current role diagnosis'],
        ['s1Observation', 'Observation check'],
        ['s1Photo', 'Photo caption']
      ]
    },
    S2: {
      mainKey: 's2BigQuestion',
      mainTitle: 'Is the chosen product truly a strong sustainable choice?',
      support: [
        ['s2Product', 'Product chosen'],
        ['s2Judgement', 'Product judgement check']
      ]
    },
    S3: {
      mainKey: 's3BigQuestion',
      mainTitle: 'How could transport design encourage lower-impact choices?',
      support: [
        ['s3MainIssue', 'Main issue'],
        ['s3RouteName', 'Renamed route'],
        ['s3Observation', 'Observation check']
      ]
    },
    S4: {
      mainKey: 's4BigQuestion',
      mainTitle: 'Is putting many parts of daily life close together enough?',
      support: [
        ['s4Profile', 'User profile'],
        ['s4LowerCarbonDay', 'Lower-carbon day plan'],
        ['s4Decoder', 'Mixed-use decoder']
      ]
    },
    S5: {
      mainKey: 's5Response',
      mainTitle: 'Small choice, better response',
      support: [
        ['s5Tension', 'Sustainability tension']
      ]
    }
  }[station];

  if (!schema) {
    const fallback = Object.keys(data)
      .filter(key => !key.toLowerCase().includes('photo'))
      .map(key => ({ label: prettyKey(key), value: valueToReadableText(data[key]) }));
    return { mainTitle: payload.stationTitle || station || 'Submission', mainResponse: '', supporting: fallback, checkin: valueToReadableText(data.checkinAnswer || '') };
  }

  const checkin = valueToReadableText(data.checkinAnswer || '');
  const mainResponse = valueToReadableText(data[schema.mainKey]);
  const supporting = schema.support
    .map(([key, label]) => ({ label, value: valueToReadableText(data[key]) }))
    .filter(item => item.value);

  return {
    mainTitle: schema.mainTitle,
    mainResponse,
    supporting,
    checkin
  };
}

function prettyKey(key) {
  return String(key).replace(/^s\d/i, '').replace(/([A-Z])/g, ' $1').replace(/^./, c => c.toUpperCase()).trim() || key;
}

function valueToReadableText(value) {
  if (value === undefined || value === null || value === '') return '';
  if (typeof value === 'string') return value;
  if (Array.isArray(value)) return value.map(valueToReadableText).filter(Boolean).join('; ');
  if (typeof value === 'object') {
    if (typeof value.value === 'string') return value.value;
    if (typeof value.choice === 'string') return [value.choice, value.other].filter(Boolean).join(' — Other: ');
    if (typeof value.caption === 'string') return value.caption;
    if (typeof value.name === 'string') return [value.name, value.category ? `Category: ${value.category}` : ''].filter(Boolean).join(' — ');
    if (Array.isArray(value.selections)) {
      const selected = value.selections.join('; ');
      return [selected, value.other ? `Other: ${value.other}` : ''].filter(Boolean).join('\n');
    }
    if (Array.isArray(value.needs)) {
      return [`Needs: ${value.needs.join('; ')}`, value.plan ? `Plan: ${value.plan}` : ''].filter(Boolean).join('\n');
    }
    if ('spotted' in value || 'seems' in value || 'because' in value || 'hiddenIssue' in value || 'responseChoice' in value || 'whyResponse' in value) {
      return [
        value.spotted ? `Spotted: ${value.spotted}` : '',
        value.seems ? `It seems: ${value.seems}` : '',
        value.because ? `Because: ${value.because}` : '',
        value.hiddenIssue ? `Hidden issue: ${value.hiddenIssue}` : '',
        value.responseChoice ? `Best response: ${value.responseChoice}` : '',
        value.whyResponse ? `Reason: ${value.whyResponse}` : ''
      ].filter(Boolean).join('\n');
    }
    if (value.photoBypassed) return 'Photo bypassed by teacher';
  if (value.photoUploaded) return 'Photo uploaded';
    if (value.viewed) return 'Viewed';
    return JSON.stringify(value, null, 2);
  }
  return String(value);
}

function shortenValue(value) {
  const text = valueToReadableText(value);
  return text.length > 1600 ? text.slice(0, 1600) + '…' : text;
}

function renderScoreRows(scores) {
  if (!scores.length) return '<tr><td colspan="9">No scores yet.</td></tr>';
  return scores
    .sort((a, b) => Number(b.total || 0) - Number(a.total || 0))
    .map((s, i) => `<tr><td>${i + 1}</td><td>${escapeHtml(s.group)}</td><td>${escapeHtml(s.teamName)}</td><td>${escapeHtml(s.S1Score || '')}</td><td>${escapeHtml(s.S2Score || '')}</td><td>${escapeHtml(s.S3Score || '')}</td><td>${escapeHtml(s.S4Score || '')}</td><td>${escapeHtml(s.S5Score || '')}</td><td><strong>${escapeHtml(s.total || '')}</strong></td></tr>`).join('');
}

function formatTime(value) {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return escapeHtml(value);
  return d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

window.addEventListener('hashchange', () => {
  if (location.hash === '#teacher') { state.mode = 'teacher'; renderTeacherLoginOrDashboard(); }
  else if (state.mode === 'teacher') { state.mode = 'student'; render(); }
});

// Always begin from the landing page on a fresh page load.
// Saved progress is retained and can be resumed from the landing page.
if (location.hash !== '#teacher') {
  state.currentScreen = 'splash';
}
render();

import type { AdAssets, Campaign, StoryImage } from '@campaign/shared';

/**
 * Seeded demo campaigns. Every figure here is illustrative demo data, not a
 * verified claim, and every visual is bundled abstract artwork rather than a
 * real photograph. Campaigns reference images by key (see
 * `src/assets/campaignImages.ts`); regenerate the files with
 * `node scripts/generate-campaign-assets.cjs`.
 */
function adAssetsFor(slug: string): AdAssets {
  return {
    coverImageUri: null,
    adImageUri: null,
    adImageKey: `ad-${slug}`,
    hasVideoPlaceholder: false,
  };
}

function storyImageFor(slug: string, caption: string): StoryImage[] {
  return [
    {
      id: `seed-img-${slug}-1`,
      uri: null,
      imageKey: `story-${slug}-1`,
      caption,
      credit: 'Illustrative demo artwork — not a real photograph.',
    },
  ];
}

export const SEED_CAMPAIGNS: Campaign[] = [
  {
    id: 'seed-river-wardens',
    creatorId: 'seed-creator-periyar',
    title: 'Clean Up the Periyar: 10 River Wardens',
    category: 'Environment',
    summary:
      'Fund a month of amplified posts recruiting river wardens to log and clear plastic along the Periyar riverbank.',
    creatorName: 'Periyar Volunteers Collective',
    coverImageUri: null,
    coverImageKey: 'cover-river-wardens',
    featured: true,
    storyIntro:
      'Every monsoon, the Periyar riverbank collects a fresh layer of plastic that community clean-ups cannot keep up with. We want to recruit ten trained river wardens to log debris and lead weekend clean-up routes.',
    storySections: [
      {
        id: 'seed-sec-river-1',
        heading: 'What the wardens do',
        body:
          'Wardens walk fixed stretches twice a week, photograph and log waste, and coordinate with a local recycling partner. Logs become a public map of problem spots.',
      },
      {
        id: 'seed-sec-river-2',
        heading: 'Why amplification helps',
        body:
          'Our clean-ups are already effective, but we reach mostly people who already follow us. Amplified posts bring in volunteers from the surrounding wards who have never heard of the route map.',
      },
    ],
    storyImages: storyImageFor(
      'river-wardens',
      'A marked clean-up route along the riverbank (demo illustration).',
    ),
    sources: [
      {
        id: 'seed-src-river-1',
        title: 'Municipal solid waste report (2025)',
        url: 'https://example.org/periyar-waste-report',
      },
      {
        id: 'seed-src-river-2',
        title: 'River Warden handbook (public draft)',
        url: 'https://example.org/river-warden-handbook',
      },
    ],
    statistics: [
      { id: 'seed-stat-river-1', label: 'Plastic logged in 2025', value: '2.4 tonnes' },
      { id: 'seed-stat-river-2', label: 'Active volunteers', value: '38' },
    ],
    audienceActions: [
      'Join a Saturday clean-up shift',
      'Share the debris map with your ward',
      'Report a new dump site',
    ],
    adAssets: adAssetsFor('river-wardens'),
    adHeadline: 'Become a river warden',
    adDescription: 'Two walks a week. Real logs, real clean-ups along the Periyar.',
    callToAction: 'Join the next clean-up',
    targetLocations: ['Kochi', 'Ernakulam'],
    audienceInterests: ['Environment', 'Volunteering', 'Local community'],
    channels: ['social_feed', 'stories'],
    budgetAllocation: { advertisingSharePercent: 85, contingencySharePercent: 15 },
    durationDays: 14,
    fundingGoal: 150000,
    fundingRaised: 96500,
    status: 'FUNDING',
    dataOrigin: 'seed_demo',
    createdAt: '2026-09-28T09:00:00.000Z',
    submittedAt: '2026-10-02T10:15:00.000Z',
    deadline: '2026-12-01T00:00:00.000Z',
    updatedAt: '2026-10-16T08:30:00.000Z',
  },
  {
    id: 'seed-mangrove-guards',
    creatorId: 'seed-creator-coastal',
    title: 'Restore 20 Acres of Coastal Mangrove',
    category: 'Environment',
    summary:
      'Amplify a drive to recruit planting crews and local monitors for a 20-acre mangrove restoration stretch.',
    creatorName: 'Coastal Green Trust',
    coverImageUri: null,
    coverImageKey: 'cover-mangrove-guards',
    storyIntro:
      'Mangroves are the coastline’s first defence against storm surge, but the stretch near the fishing hamlets has been cut back for years. We have nurseries ready and need planting crews and long-term monitors.',
    storySections: [
      {
        id: 'seed-sec-mangrove-1',
        heading: 'From nursery to shoreline',
        body:
          'Seedlings are raised in two community nurseries and planted at low tide with the fishing cooperative. Each plot is monitored monthly for survival.',
      },
      {
        id: 'seed-sec-mangrove-2',
        heading: 'Why we need reach',
        body:
          'We can plant with a small crew, but monitoring twenty acres needs many more hands, including people outside our existing network.',
      },
    ],
    storyImages: storyImageFor(
      'mangrove-guards',
      'Nursery rows of mangrove seedlings (demo illustration).',
    ),
    sources: [
      {
        id: 'seed-src-mangrove-1',
        title: 'Coastal vegetation survey extract',
        url: 'https://example.org/coastal-mangrove-survey',
      },
    ],
    statistics: [
      { id: 'seed-stat-mangrove-1', label: 'Seedlings in nurseries', value: '9,000' },
      { id: 'seed-stat-mangrove-2', label: 'Target area', value: '20 acres' },
    ],
    audienceActions: ['Join a planting weekend', 'Adopt a monitoring plot'],
    adAssets: adAssetsFor('mangrove-guards'),
    adHeadline: 'Plant with your neighbours',
    adDescription: 'Twenty acres of mangrove need twenty acres of hands.',
    callToAction: 'Join a planting weekend',
    targetLocations: ['Kochi', 'Alappuzha'],
    audienceInterests: ['Environment', 'Climate', 'Volunteering'],
    channels: ['social_feed', 'stories', 'display'],
    budgetAllocation: { advertisingSharePercent: 88, contingencySharePercent: 12 },
    durationDays: 21,
    fundingGoal: 300000,
    fundingRaised: 178400,
    status: 'FUNDING',
    dataOrigin: 'seed_demo',
    createdAt: '2026-10-09T05:30:00.000Z',
    submittedAt: '2026-10-11T09:00:00.000Z',
    deadline: '2027-01-15T00:00:00.000Z',
    updatedAt: '2026-10-17T11:10:00.000Z',
  },
  {
    id: 'seed-stem-lab',
    creatorId: 'seed-creator-dharwad',
    title: 'STEM Lab for a Government School',
    category: 'Education',
    summary:
      'Amplify a campaign to find volunteer mentors and sustain an after-school STEM lab for 240 students.',
    creatorName: 'Dharwad Science Teachers Network',
    coverImageUri: null,
    coverImageKey: 'cover-stem-lab',
    storyIntro:
      'Two science teachers run an after-school lab for 240 students with borrowed equipment. We have a room and a plan; the funding goal was met, and now we need a wider audience of mentors.',
    storySections: [
      {
        id: 'seed-sec-stem-1',
        heading: 'The gap we are closing',
        body:
          'The school has no working lab benches. Students who want to continue science after Class 10 have nowhere to practice experiments.',
      },
      {
        id: 'seed-sec-stem-2',
        heading: 'Goal met, mentors needed',
        body:
          'The funding goal was met, so equipment is ordered. Amplification now helps us find volunteer mentors and sustain the lab beyond this year.',
      },
    ],
    storyImages: storyImageFor('stem-lab', 'An after-school experiment bench (demo illustration).'),
    sources: [
      {
        id: 'seed-src-stem-1',
        title: 'School infrastructure survey excerpt',
        url: 'https://example.org/dharwad-lab-survey',
      },
    ],
    statistics: [
      { id: 'seed-stat-stem-1', label: 'Students reached', value: '240' },
      { id: 'seed-stat-stem-2', label: 'Volunteer teachers', value: '6' },
    ],
    audienceActions: ['Mentor one session a month', 'Donate surplus lab glassware'],
    adAssets: adAssetsFor('stem-lab'),
    adHeadline: 'A real science lab, after school',
    adDescription: 'Help a government school keep its after-school STEM lab running.',
    callToAction: 'Support the lab',
    targetLocations: ['Dharwad', 'Hubballi'],
    audienceInterests: ['Education', 'Science', 'Youth'],
    channels: ['social_feed', 'search'],
    budgetAllocation: { advertisingSharePercent: 85, contingencySharePercent: 15 },
    durationDays: 10,
    fundingGoal: 250000,
    fundingRaised: 250000,
    status: 'FUNDING_GOAL_REACHED',
    dataOrigin: 'seed_demo',
    createdAt: '2026-09-12T06:45:00.000Z',
    submittedAt: '2026-09-15T11:20:00.000Z',
    deadline: '2026-11-15T00:00:00.000Z',
    updatedAt: '2026-10-14T13:05:00.000Z',
  },
  {
    id: 'seed-air-monitors',
    creatorId: 'seed-creator-aqi',
    title: 'Air Quality Monitors for Two Neighbourhoods',
    category: 'Science',
    summary:
      'Raise awareness and volunteers for low-cost air quality monitors in two neighbourhoods with no public sensors.',
    creatorName: 'Civic Air Project',
    coverImageUri: null,
    coverImageKey: 'cover-air-monitors',
    storyIntro:
      'Two neighbourhoods near an industrial corridor have no public air quality sensor within four kilometres. We built low-cost monitors with an open design and want residents to host them.',
    storySections: [
      {
        id: 'seed-sec-air-1',
        heading: 'Open hardware, public readings',
        body:
          'Each monitor costs about ₹6,500 to assemble and publishes hourly readings to a public dashboard. Hosts simply need a balcony and power.',
      },
      {
        id: 'seed-sec-air-2',
        heading: 'What we are asking for',
        body:
          'This campaign does not fund the hardware. It funds amplified messages asking residents to host, calibrate, and read the data.',
      },
    ],
    storyImages: storyImageFor('air-monitors', 'A balcony-mounted sensor unit (demo illustration).'),
    sources: [
      {
        id: 'seed-src-air-1',
        title: 'Open air monitor build guide',
        url: 'https://example.org/open-air-monitor',
      },
      { id: 'seed-src-air-2', title: 'Sensor coverage map', url: 'https://example.org/aqi-coverage' },
    ],
    statistics: [
      { id: 'seed-stat-air-1', label: 'Monitors built', value: '12' },
      { id: 'seed-stat-air-2', label: 'Sensor gap', value: '4 km' },
    ],
    audienceActions: ['Host a monitor on your balcony', 'Help calibrate a unit'],
    adAssets: adAssetsFor('air-monitors'),
    adHeadline: 'Host an air sensor',
    adDescription: 'Two neighbourhoods, zero public sensors. Help us close the gap.',
    callToAction: 'Host a monitor',
    targetLocations: ['Kochi', 'Kalamassery'],
    audienceInterests: ['Environment', 'Science', 'Public health'],
    channels: ['social_feed', 'display'],
    budgetAllocation: { advertisingSharePercent: 80, contingencySharePercent: 20 },
    durationDays: 21,
    fundingGoal: 80000,
    fundingRaised: 24600,
    status: 'FUNDING',
    dataOrigin: 'seed_demo',
    createdAt: '2026-10-05T04:20:00.000Z',
    submittedAt: '2026-10-08T07:00:00.000Z',
    deadline: '2026-12-20T00:00:00.000Z',
    updatedAt: '2026-10-17T09:45:00.000Z',
  },
  {
    id: 'seed-hearing-screening',
    creatorId: 'seed-creator-listen',
    title: 'Free Hearing Screening for 1,000 Children',
    category: 'Health',
    summary:
      'Amplify a screening drive so parents in three districts know about free hearing checks for schoolchildren.',
    creatorName: 'Listen Well Foundation',
    coverImageUri: null,
    coverImageKey: 'cover-hearing-screening',
    storyIntro:
      'Early hearing loss is often missed in classrooms because no one is looking for it. Our mobile screening camps can check 1,000 children this term, but parents have to know the camps are coming.',
    storySections: [
      {
        id: 'seed-sec-hear-1',
        heading: 'What the camps do',
        body:
          'A trained audiologist and two volunteers run a screening camp at each partner school, with referrals for children who need follow-up.',
      },
      {
        id: 'seed-sec-hear-2',
        heading: 'Why awareness is the bottleneck',
        body:
          'The camps are funded. What limits turnout is that families simply do not hear about them in time.',
      },
    ],
    storyImages: storyImageFor(
      'hearing-screening',
      'A school screening desk set up for families (demo illustration).',
    ),
    sources: [
      {
        id: 'seed-src-hear-1',
        title: 'Childhood hearing screening summary',
        url: 'https://example.org/hearing-screening-summary',
      },
    ],
    statistics: [
      { id: 'seed-stat-hear-1', label: 'Children to screen', value: '1,000' },
      { id: 'seed-stat-hear-2', label: 'Partner schools', value: '14' },
    ],
    audienceActions: ['Share the camp schedule', 'Volunteer as a camp helper'],
    adAssets: adAssetsFor('hearing-screening'),
    adHeadline: 'A five-minute hearing check',
    adDescription: 'Free screening camps are coming to partner schools.',
    callToAction: 'See the camp schedule',
    targetLocations: ['Pune', 'Pimpri', 'Chinchwad'],
    audienceInterests: ['Health', 'Parenting', 'Education'],
    channels: ['social_feed', 'stories', 'search'],
    budgetAllocation: { advertisingSharePercent: 82, contingencySharePercent: 18 },
    durationDays: 18,
    fundingGoal: 120000,
    fundingRaised: 43200,
    status: 'FUNDING',
    dataOrigin: 'seed_demo',
    createdAt: '2026-10-12T03:15:00.000Z',
    submittedAt: '2026-10-13T08:40:00.000Z',
    deadline: '2027-01-05T00:00:00.000Z',
    updatedAt: '2026-10-17T15:20:00.000Z',
  },
  {
    id: 'seed-open-textbook',
    creatorId: 'seed-creator-openlearn',
    title: 'Open Textbooks for Public Colleges',
    category: 'Public Policy',
    summary:
      'Amplify a push for free, openly licensed textbooks across public colleges in the state.',
    creatorName: 'OpenLearning Collective',
    coverImageUri: null,
    coverImageKey: 'cover-open-textbook',
    storyIntro:
      'Students in public colleges pay more for textbooks than for tuition. We drafted openly licensed replacements for six first-year subjects and want colleges and faculty to adopt them.',
    storySections: [
      {
        id: 'seed-sec-book-1',
        heading: 'Ready for adoption',
        body:
          'All six drafts passed peer review. Adoption is a faculty decision, so the campaign is about reaching the people who can make that decision.',
      },
      {
        id: 'seed-sec-book-2',
        heading: 'Distribution in progress',
        body:
          'Funding is complete and the amplified messages are now running across the districts with the most public colleges.',
      },
    ],
    storyImages: storyImageFor('open-textbook', 'An openly licensed textbook spread (demo illustration).'),
    sources: [
      {
        id: 'seed-src-book-1',
        title: 'Open textbook catalogue',
        url: 'https://example.org/open-textbook-catalogue',
      },
      { id: 'seed-src-book-2', title: 'Peer review notes', url: 'https://example.org/peer-review-notes' },
    ],
    statistics: [
      { id: 'seed-stat-book-1', label: 'Subjects covered', value: '6' },
      { id: 'seed-stat-book-2', label: 'Colleges targeted', value: '42' },
    ],
    audienceActions: ['Ask your department to adopt', 'Report a textbook cost'],
    adAssets: adAssetsFor('open-textbook'),
    adHeadline: 'Textbooks should not cost more than tuition',
    adDescription: 'Openly licensed first-year texts, free for every student.',
    callToAction: 'Request adoption',
    targetLocations: ['Bengaluru', 'Mysuru', 'Mangaluru'],
    audienceInterests: ['Education', 'Public policy', 'Students'],
    channels: ['social_feed', 'search', 'display'],
    budgetAllocation: { advertisingSharePercent: 90, contingencySharePercent: 10 },
    durationDays: 30,
    fundingGoal: 200000,
    fundingRaised: 200000,
    status: 'PROMOTING',
    dataOrigin: 'seed_demo',
    createdAt: '2026-08-20T04:00:00.000Z',
    submittedAt: '2026-08-24T09:30:00.000Z',
    deadline: '2026-10-10T00:00:00.000Z',
    updatedAt: '2026-10-15T07:05:00.000Z',
  },
  {
    id: 'seed-night-bus-safety',
    creatorId: 'seed-creator-sherides',
    title: 'Safer Night Buses for Women Commuters',
    category: 'Community',
    summary:
      'Amplify a survey and petition for better-lit stops and on-board help points on late-night buses.',
    creatorName: 'SheRides Collective',
    coverImageUri: null,
    coverImageKey: 'cover-night-bus-safety',
    storyIntro:
      'Women who finish late shifts often wait at unlit stops for buses with no working help point. We mapped the worst twenty stops and drafted a specific, costed improvement request.',
    storySections: [
      {
        id: 'seed-sec-bus-1',
        heading: 'A specific ask',
        body:
          'The request lists twenty stops, lighting upgrades, and a working panic button linked to the control room — costed and submitted to the transport department.',
      },
      {
        id: 'seed-sec-bus-2',
        heading: 'Adding voices',
        body:
          'Every signature from riders outside our network strengthens the case, so amplification is the whole point of this campaign.',
      },
    ],
    storyImages: storyImageFor('night-bus-safety', 'A lit bus stop at night (demo illustration).'),
    sources: [
      {
        id: 'seed-src-bus-1',
        title: 'Night stop safety mapping (demo)',
        url: 'https://example.org/night-stop-mapping',
      },
    ],
    statistics: [
      { id: 'seed-stat-bus-1', label: 'Stops mapped', value: '20' },
      { id: 'seed-stat-bus-2', label: 'Signatures so far', value: '1,860' },
    ],
    audienceActions: ['Sign the petition', 'Report an unsafe stop'],
    adAssets: adAssetsFor('night-bus-safety'),
    adHeadline: 'Late shift? You should not have to wait in the dark.',
    adDescription: 'Twenty stops, better lights, working help points.',
    callToAction: 'Sign the petition',
    targetLocations: ['Chennai', 'Tambaram'],
    audienceInterests: ['Community', 'Public policy', 'Women’s safety'],
    channels: ['social_feed', 'stories'],
    budgetAllocation: { advertisingSharePercent: 84, contingencySharePercent: 16 },
    durationDays: 16,
    fundingGoal: 180000,
    fundingRaised: 61200,
    status: 'FUNDING',
    dataOrigin: 'seed_demo',
    createdAt: '2026-10-15T02:45:00.000Z',
    submittedAt: '2026-10-15T12:00:00.000Z',
    deadline: '2027-01-20T00:00:00.000Z',
    updatedAt: '2026-10-17T18:25:00.000Z',
  },
  {
    id: 'seed-women-in-trades',
    creatorId: 'seed-creator-toolkit',
    title: 'Scholarships for Women Entering Skilled Trades',
    category: 'Economic Policy',
    summary:
      'A completed amplification campaign that filled a scholarship cohort for women in electrical and welding trades.',
    creatorName: 'Toolkit Foundation',
    coverImageUri: null,
    coverImageKey: 'cover-women-in-trades',
    storyIntro:
      'Skilled trades pay well but few women get past the first tool-kit cost or find a course that welcomes them. We funded a scholarship cohort and amplified applications across three states.',
    storySections: [
      {
        id: 'seed-sec-trade-1',
        heading: 'What the cohort covered',
        body:
          'Forty scholarships covered course fees, a starter tool kit, and a travel stipend for the first month of training.',
      },
      {
        id: 'seed-sec-trade-2',
        heading: 'Closed and completed',
        body:
          'Funding closed and distribution finished. The report is available to backers from the campaign dashboard.',
      },
    ],
    storyImages: storyImageFor('women-in-trades', 'A starter tool kit laid out (demo illustration).'),
    sources: [
      {
        id: 'seed-src-trade-1',
        title: 'Trades scholarship cohort summary',
        url: 'https://example.org/trades-cohort-summary',
      },
    ],
    statistics: [
      { id: 'seed-stat-trade-1', label: 'Scholarships funded', value: '40' },
      { id: 'seed-stat-trade-2', label: 'States reached', value: '3' },
    ],
    audienceActions: ['Nominate a candidate', 'Host an open day'],
    adAssets: adAssetsFor('women-in-trades'),
    adHeadline: 'She can build your next circuit',
    adDescription: 'Scholarships for women entering electrical and welding trades.',
    callToAction: 'Nominate a candidate',
    targetLocations: ['Coimbatore', 'Madurai', 'Salem'],
    audienceInterests: ['Business', 'Education', 'Women’s employment'],
    channels: ['social_feed', 'search', 'display'],
    budgetAllocation: { advertisingSharePercent: 86, contingencySharePercent: 14 },
    durationDays: 28,
    fundingGoal: 400000,
    fundingRaised: 400000,
    status: 'COMPLETED',
    dataOrigin: 'seed_demo',
    createdAt: '2026-07-02T06:00:00.000Z',
    submittedAt: '2026-07-05T10:00:00.000Z',
    deadline: '2026-08-30T00:00:00.000Z',
    updatedAt: '2026-10-01T09:00:00.000Z',
  },
  {
    id: 'seed-oral-history',
    creatorId: 'seed-creator-archive',
    title: 'Record a Vanishing Oral History Archive',
    category: 'Arts & Culture',
    summary:
      'Amplify a call for storytellers and volunteers to record a fast-disappearing oral history archive.',
    creatorName: 'Riverbed Archive',
    coverImageUri: null,
    coverImageKey: 'cover-oral-history',
    storyIntro:
      'The last generation of boat-builders and river traders along our backwaters is ageing fast. We want to record forty interviews before those memories are lost, and we need narrators to come forward.',
    storySections: [
      {
        id: 'seed-sec-oral-1',
        heading: 'How recordings work',
        body:
          'A volunteer pair records one two-hour session, with signed consent, and files it in the public archive with a transcript.',
      },
      {
        id: 'seed-sec-oral-2',
        heading: 'Reach finds narrators',
        body:
          'Recording is cheap; finding the right narrators is hard. Amplified messages reach families who would never see our archive page.',
      },
    ],
    storyImages: storyImageFor('oral-history', 'A recording session by the water (demo illustration).'),
    sources: [
      {
        id: 'seed-src-oral-1',
        title: 'Archive consent and ethics notes',
        url: 'https://example.org/archive-consent-notes',
      },
    ],
    statistics: [
      { id: 'seed-stat-oral-1', label: 'Interviews planned', value: '40' },
      { id: 'seed-stat-oral-2', label: 'Recorded so far', value: '7' },
    ],
    audienceActions: ['Nominate a narrator', 'Volunteer to record'],
    adAssets: adAssetsFor('oral-history'),
    adHeadline: 'Their stories are going with them',
    adDescription: 'Help us record forty river stories before they disappear.',
    callToAction: 'Nominate a narrator',
    targetLocations: ['Kottayam', 'Alappuzha'],
    audienceInterests: ['Arts & culture', 'Heritage', 'Volunteering'],
    channels: ['social_feed', 'stories', 'search'],
    budgetAllocation: { advertisingSharePercent: 85, contingencySharePercent: 15 },
    durationDays: 20,
    fundingGoal: 90000,
    fundingRaised: 15300,
    status: 'FUNDING',
    dataOrigin: 'seed_demo',
    createdAt: '2026-10-16T07:40:00.000Z',
    submittedAt: '2026-10-16T14:00:00.000Z',
    deadline: '2027-02-01T00:00:00.000Z',
    updatedAt: '2026-10-17T20:00:00.000Z',
  },
];

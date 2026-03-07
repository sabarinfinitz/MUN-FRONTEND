export const PRESET_TOPICS = [
  "Terrorism and transnational security",
  "Immigration and refugee protection",
  "Drug trafficking and substance abuse",
] as const;

export type Delegate = {
  id: string;
  name: string;
};

export const mockDelegates: Delegate[] = [
  { id: "south-africa", name: "South Africa" },
  { id: "germany", name: "Germany" },
  { id: "france", name: "France" },
  { id: "brazil", name: "Brazil" },
  { id: "india", name: "India" },
  { id: "china", name: "China" },
  { id: "united-states", name: "United States" },
];

export const DELEGATE_FLAGS: Record<string, string> = {
  "south-africa": "🇿🇦",
  germany: "🇩🇪",
  france: "🇫🇷",
  brazil: "🇧🇷",
  india: "🇮🇳",
  china: "🇨🇳",
  "united-states": "🇺🇸",
};

export type Speech = {
  id: string;
  delegateId: string;
  country: string;
  flagLabel?: string;
  openingLine: string;
  timestamp: string;
};

export type ChairMessage = {
  type: "chair";
  id: string;
  text: string;
  timestamp: string;
};

export type FloorItem = Speech | ChairMessage;

export function isSpeech(item: FloorItem): item is Speech {
  return "delegateId" in item;
}

export type ResolutionClause = { id: string; text: string };

const SPEECHES_TERRORISM: Speech[] = [
  {
    id: "t1",
    delegateId: "south-africa",
    country: "Delegate of South Africa (You)",
    flagLabel: "SA",
    openingLine:
      "Honorable Chair, distinguished delegates, South Africa stresses that counter-terrorism measures must comply with international human rights law and address root causes, including inequality and lack of opportunity.",
    timestamp: "Just now",
  },
  {
    id: "t2",
    delegateId: "germany",
    country: "Delegate of Germany",
    flagLabel: "DE",
    openingLine:
      "Honorable Chair, Germany supports strengthened cooperation on border security and information-sharing while safeguarding civil liberties and the rights of refugees.",
    timestamp: "1 min ago",
  },
  {
    id: "t3",
    delegateId: "india",
    country: "Delegate of India",
    flagLabel: "IN",
    openingLine:
      "Honorable Chair, India calls for a comprehensive convention on international terrorism and for distinguishing between terrorism and legitimate struggles for self-determination.",
    timestamp: "3 min ago",
  },
];

const SPEECHES_IMMIGRATION: Speech[] = [
  {
    id: "i1",
    delegateId: "south-africa",
    country: "Delegate of South Africa (You)",
    flagLabel: "SA",
    openingLine:
      "Honorable Chair, distinguished delegates, South Africa urges a burden-sharing approach to refugee protection and the dismantling of policies that criminalize irregular migration.",
    timestamp: "Just now",
  },
  {
    id: "i2",
    delegateId: "germany",
    country: "Delegate of Germany",
    flagLabel: "DE",
    openingLine:
      "Honorable Chair, Germany advocates for legal pathways for migration, integration programs, and robust support for countries of first asylum.",
    timestamp: "1 min ago",
  },
  {
    id: "i3",
    delegateId: "brazil",
    country: "Delegate of Brazil",
    flagLabel: "BR",
    openingLine:
      "Honorable Chair, Brazil supports regional solidarity mechanisms and the principle of non-refoulement as the cornerstone of refugee protection.",
    timestamp: "3 min ago",
  },
];

const SPEECHES_DRUGS: Speech[] = [
  {
    id: "d1",
    delegateId: "south-africa",
    country: "Delegate of South Africa (You)",
    flagLabel: "SA",
    openingLine:
      "Honorable Chair, distinguished delegates, South Africa emphasizes a public health approach to drug use, reducing stigma and ensuring access to treatment rather than punitive measures alone.",
    timestamp: "Just now",
  },
  {
    id: "d2",
    delegateId: "united-states",
    country: "Delegate of United States",
    flagLabel: "US",
    openingLine:
      "Honorable Chair, the United States supports international cooperation to disrupt trafficking networks while strengthening prevention and treatment at home.",
    timestamp: "1 min ago",
  },
  {
    id: "d3",
    delegateId: "china",
    country: "Delegate of China",
    flagLabel: "CN",
    openingLine:
      "Honorable Chair, China supports strict control of precursor chemicals and enhanced law enforcement cooperation against transnational drug trafficking.",
    timestamp: "3 min ago",
  },
];

const SPEECHES_DEFAULT: Speech[] = [
  {
    id: "1",
    delegateId: "south-africa",
    country: "Delegate of South Africa (You)",
    flagLabel: "SA",
    openingLine:
      "Honorable Chair, distinguished delegates, South Africa moves for a moderated caucus on this agenda item so the committee may address it in depth.",
    timestamp: "Just now",
  },
  {
    id: "2",
    delegateId: "germany",
    country: "Delegate of Germany",
    flagLabel: "DE",
    openingLine:
      "Honorable Chair, Germany looks forward to a constructive exchange and believes the committee can reach consensus on practical next steps.",
    timestamp: "1 min ago",
  },
  {
    id: "3",
    delegateId: "india",
    country: "Delegate of India",
    flagLabel: "IN",
    openingLine:
      "Honorable Chair, India stands ready to engage on this matter and to work with all delegations toward a balanced outcome.",
    timestamp: "3 min ago",
  },
];

const topicToSpeeches: Record<string, Speech[]> = {
  [PRESET_TOPICS[0]]: SPEECHES_TERRORISM,
  [PRESET_TOPICS[1]]: SPEECHES_IMMIGRATION,
  [PRESET_TOPICS[2]]: SPEECHES_DRUGS,
};

export function getSpeechesForTopic(topic: string, userCountryId?: string | null): Speech[] {
  const list = topicToSpeeches[topic] ?? SPEECHES_DEFAULT;
  if (!userCountryId) return list;
  const userIndex = list.findIndex((s) => s.delegateId === userCountryId);
  if (userIndex < 0) return list;
  const rest = list.filter((_, i) => i !== userIndex);
  const userSpeech = list[userIndex];
  return [...rest, userSpeech];
}

const RESOLUTION_TERRORISM = {
  preambulatory: [
    { id: "tp1", text: "Reaffirming that terrorism in all its forms constitutes one of the most serious threats to international peace and security," },
    { id: "tp2", text: "Recalling the need to respect human rights and the rule of law in all counter-terrorism measures," },
  ] as ResolutionClause[],
  operative: [
    { id: "to1", text: "Calls upon Member States to strengthen cooperation in preventing and combating terrorism while respecting international law;" },
    { id: "to2", text: "Encourages capacity-building and technical assistance for States most affected by terrorist threats;" },
  ] as ResolutionClause[],
};

const RESOLUTION_IMMIGRATION = {
  preambulatory: [
    { id: "ip1", text: "Deeply concerned by the plight of refugees and migrants and the loss of life in transit," },
    { id: "ip2", text: "Recalling the 1951 Convention and the principle of non-refoulement," },
  ] as ResolutionClause[],
  operative: [
    { id: "io1", text: "Calls for equitable burden-sharing and increased resettlement places;" },
    { id: "io2", text: "Encourages legal pathways for migration and integration programs in host countries;" },
  ] as ResolutionClause[],
};

const RESOLUTION_DRUGS = {
  preambulatory: [
    { id: "dp1", text: "Concerned by the impact of drug trafficking and substance abuse on health, development, and security," },
    { id: "dp2", text: "Emphasizing the need for a balanced approach combining law enforcement and public health," },
  ] as ResolutionClause[],
  operative: [
    { id: "do1", text: "Calls for strengthened international cooperation against drug trafficking and precursor control;" },
    { id: "do2", text: "Encourages evidence-based prevention, treatment, and harm reduction programs;" },
  ] as ResolutionClause[],
};

const RESOLUTION_DEFAULT = {
  preambulatory: [
    { id: "p1", text: "Recalling the mandate of this committee to address the agenda item before it," },
    { id: "p2", text: "Seeking to promote dialogue and consensus among Member States," },
  ] as ResolutionClause[],
  operative: [
    { id: "o1", text: "Calls upon Member States to cooperate in implementing the objectives of this agenda item;" },
    { id: "o2", text: "Encourages the Secretary-General to report on progress to the General Assembly;" },
  ] as ResolutionClause[],
};

const topicToResolution: Record<string, { preambulatory: ResolutionClause[]; operative: ResolutionClause[] }> = {
  [PRESET_TOPICS[0]]: RESOLUTION_TERRORISM,
  [PRESET_TOPICS[1]]: RESOLUTION_IMMIGRATION,
  [PRESET_TOPICS[2]]: RESOLUTION_DRUGS,
};

export function getResolutionForTopic(topic: string): { preambulatory: ResolutionClause[]; operative: ResolutionClause[] } {
  return topicToResolution[topic] ?? RESOLUTION_DEFAULT;
}

export const initialSpeeches: Speech[] = SPEECHES_DEFAULT;

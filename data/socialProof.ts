export const NAMES = [
  'Rahul', 'Priya', 'Ananya', 'Arjun', 'Sneha',
  'Karthik', 'Meera', 'Aarav', 'Riya', 'Neha',
  'Ishita', 'Rohan', 'Nikhil', 'Pooja', 'Akash',
  'Aditi', 'Varun', 'Divya', 'Sanjana', 'Abhishek',
] as const

export const CITIES = [
  'Bengaluru', 'Mumbai', 'Delhi', 'Hyderabad', 'Chennai',
  'Pune', 'Mysuru', 'Ahmedabad', 'Surat', 'Jaipur',
  'Lucknow', 'Indore', 'Nagpur', 'Kochi', 'Coimbatore',
  'Noida', 'Gurugram', 'Visakhapatnam', 'Mangalore', 'Hubballi',
] as const

export const INVITATION_TYPES = [
  'Wedding Invitation',
  'Birthday Invitation',
  'Baby Shower Invitation',
  'Naming Ceremony Invitation',
  'Housewarming Invitation',
  'Reception Invitation',
  'Engagement Invitation',
  'Anniversary Invitation',
  'Half Saree Ceremony',
  'Thread Ceremony',
] as const

// Each template receives (name, city, invitationType) — unused params prefixed with _
export const MESSAGE_TEMPLATES: Array<(n: string, c: string, t: string) => string> = [
  (n, c, t) => `${n} from ${c} just created a ${t}.`,
  (n, c, t) => `${n} from ${c} started designing a ${t}.`,
  (n, c, t) => `${n} from ${c} published a ${t}.`,
  (n, c, t) => `${n} from ${c} created a ${t}.`,
  (n, c)    => `${n} from ${c} joined ShareInvite.`,
  (n, c)    => `${n} from ${c} is now using ShareInvite.`,
  (_n, c, t) => `Someone from ${c} started designing a ${t}.`,
  (_n, c, t) => `A family from ${c} designed a ${t}.`,
]

export const TIMES = [
  'just now',
  '1 min ago',
  '2 min ago',
  '3 min ago',
  '5 min ago',
  '8 min ago',
  '12 min ago',
] as const

// Brand-aligned avatar palette (warm, matches ShareInvite gold/maroon/teal)
export const AVATAR_COLORS = [
  '#7A3E4A', // maroon
  '#2F766D', // teal
  '#B87924', // gold
  '#4A407A', // indigo
  '#3E7A56', // forest
  '#7A5A3E', // sienna
  '#4A7A6A', // sage
  '#6A3E7A', // purple
  '#7A6A3E', // olive
  '#3E5A7A', // slate
] as const

/**
 * The search title of each design's page (app/templates/[slug]).
 *
 * What people search for comes first ("South Indian wedding invitation
 * template", "sorry card online"), then the design's own name, then its price.
 * The page fills in {price}, so a price change never leaves a stale title.
 * Each fits Google's ~60 characters; " | ShareInvite" is added only where it
 * still fits (brandTitle in lib/seo.ts). A design missing here falls back to
 * "<Name> Invitation Template, <price>".
 */
export const TEMPLATE_TITLES: Record<string, string> = {
  // Weddings
  'elegant-wedding': 'Elegant Wedding Invitation Template, {price}',
  'cinematic-night': 'Cinematic Night Wedding Invitation Template, {price}',
  'indian-wedding': 'Indian Wedding Invitation Template: Shaadi, {price}',
  'luxury-wedding': 'Luxury Wedding Invitation Template, {price}',
  'kgf-wedding': 'KGF Style Wedding Invitation Template, {price}',
  'royal-deco': 'Art Deco Wedding Invitation Template: Royal Deco, {price}',
  'signature-rajwada': 'Royal Wedding Invitation Template: Rajwada, {price}',
  'signature-saptapadi': 'Hindu Wedding Invitation Template: Saptapadi, {price}',
  'signature-kalyanam': 'South Indian Wedding Invitation Template: Kalyanam, {price}',
  'signature-nikah': 'Muslim Wedding Invitation Template: Nikah, {price}',
  'signature-garden': 'Destination Wedding Invitation Template: Garden Vows, {price}',
  'signature-aquarelle': 'Watercolour Wedding Invitation Template: Aquarelle, {price}',
  'signature-two-worlds': 'Love Story Wedding Invitation Template: Two Worlds, {price}',
  'haldi-mehendi': 'Haldi & Mehendi Invitation Template, {price}',
  'sangeet-night': 'Sangeet Night Invitation Template, {price}',
  'save-the-date': 'Save the Date Card Template: Letterpress, {price}',
  'indian-engagement': 'Engagement Invitation Template: Mangni, {price}',
  anniversary: 'Anniversary Invitation Template: Saalgirah, {price}',

  // Birthdays
  'indian-birthday': 'Birthday Invitation Template: Janamdin, {price}',
  'first-birthday': 'First Birthday Invitation Template: Pehla Janamdin, {price}',
  'birthday-mirrorball': 'Disco Birthday Invitation Template: Mirrorball, {price}',
  'birthday-martini': 'Cocktail Birthday Invitation Template: Dirty Martini, {price}',
  'birthday-champagne': 'Milestone Birthday Invitation Template: Champagne, {price}',
  'birthday-long-lunch': 'Garden Birthday Lunch Invitation Template, {price}',
  'birthday-gala': 'Luxury Birthday Weekend Invitation: Gala, {price}',

  // Family occasions
  'griha-pravesh': 'Griha Pravesh Invitation Template (Housewarming), {price}',
  namakaran: 'Naming Ceremony Invitation Template: Namakaran, {price}',
  'baby-shower': 'Baby Shower Invitation Template: Godh Bharai, {price}',
  'pooja-invite': 'Satyanarayan & Home Pooja Invitation Template, {price}',
  retirement: 'Retirement Party Invitation Template: Farewell, {price}',

  // Festivals
  rakshabandhan: 'Raksha Bandhan Invitation Card Template, {price}',
  'ganesh-chaturthi': 'Ganesh Chaturthi Invitation Card Template, {price}',
  'diwali-party': 'Diwali Party Invitation Template: Diwali Milan, {price}',
  'dasara-ambari': 'Mysuru Dasara Invitation Template: Ambari, {price}',
  'christmas-evergreen': 'Christmas Party Invitation Template: Evergreen, {price}',
  'newyear-midnight': 'New Year Party Invitation Template: Midnight, {price}',
  'eid-milan': 'Eid Invitation Template: Eid Milan Gathering, {price}',

  // 3D greetings and the surprise journey: searched as "<occasion> card online"
  'surprise-journey': '3D Surprise Journey: Interactive Digital Gift, {price}',
  'greeting-love': 'Love Card Online: 3D Journey of Hearts, {price}',
  'greeting-valentine': 'Valentine’s Day Card Online: Floating Hearts, {price}',
  'greeting-anniversary': 'Anniversary Card Online: 3D Celebration, {price}',
  'greeting-propose': 'Proposal Card Online: Will You Marry Me?, {price}',
  'greeting-promise': 'Promise Day Card Online: A Vow in 3D, {price}',
  'greeting-sorry': 'Sorry Card Online: Healing Petals, {price}',
  'greeting-congratulations': 'Congratulations Card Online: Confetti Burst, {price}',
  'greeting-festival': 'Festival Wishes Card Online: Glowing Diyas, {price}',
  'greeting-family': 'Family Wishes Card Online: With Love, {price}',
  'greeting-friendship': 'Friendship Day Card Online: Starry Cheers, {price}',
}

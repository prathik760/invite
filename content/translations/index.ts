import { DEFAULT_LOCALE } from '@/lib/i18n'

/**
 * UI string dictionaries.
 *
 * Only chrome and commercial copy is translated here. The India-specific
 * editorial content — Griha Pravesh, Namakaran, muhurat, Sangeet guides — is
 * deliberately NOT translated: those ceremonies do not exist outside Indian
 * culture, so a translated page targets a keyword nobody searches. What travels
 * is the product itself (create, preview, publish, share) and the culturally
 * universal templates: the ten greeting cards and the generic wedding designs.
 *
 * Missing keys fall back to English rather than rendering blank.
 */
export type Dict = Record<string, string>

const en: Dict = {
  'nav.templates': 'Templates',
  'nav.pricing': 'Pricing',
  'nav.blog': 'Blog',
  'nav.create': 'Create Invitation',
  'cta.start': 'Start creating',
  'cta.createInvitation': 'Create Invitation',
  'cta.browseTemplates': 'Browse templates',
  'cta.useTemplate': 'Create with this template',
  'hero.tagline': 'Digital invitations you share with one link',
  'hero.sub': 'Add your details, preview the whole invitation before you pay, and share it on WhatsApp. No app needed for guests.',
  'value.noApp': 'No app needed for guests',
  'value.oneLink': 'One link, shared anywhere',
  'price.previewFirst': 'Preview before you pay',
  'price.oneTime': 'One-time payment to publish',
  'price.noSubscription': 'No subscription',
  'lang.switch': 'Language',
  'lang.suggestTitle': 'View this page in your language?',
  'lang.suggestAction': 'Switch',
  'lang.suggestDismiss': 'Stay in English',
}

const hi: Dict = {
  'nav.templates': 'टेम्पलेट',
  'nav.pricing': 'मूल्य',
  'nav.blog': 'ब्लॉग',
  'nav.create': 'निमंत्रण बनाएं',
  'cta.start': 'निमंत्रण बनाना शुरू करें',
  'cta.createInvitation': 'निमंत्रण बनाएं',
  'cta.browseTemplates': 'टेम्पलेट देखें',
  'cta.useTemplate': 'इस टेम्पलेट से बनाएं',
  'hero.tagline': 'एक लिंक से साझा किए जाने वाले डिजिटल निमंत्रण',
  'hero.sub': 'अपनी जानकारी भरें, भुगतान से पहले पूरा निमंत्रण देखें, और WhatsApp पर साझा करें। मेहमानों को किसी ऐप की ज़रूरत नहीं।',
  'value.noApp': 'मेहमानों को ऐप की ज़रूरत नहीं',
  'value.oneLink': 'एक लिंक, कहीं भी साझा करें',
  'price.previewFirst': 'पहले देखें, फिर भुगतान करें',
  'price.oneTime': 'प्रकाशित करने के लिए एक बार भुगतान',
  'price.noSubscription': 'कोई सदस्यता नहीं',
  'lang.switch': 'भाषा',
  'lang.suggestTitle': 'क्या यह पृष्ठ हिन्दी में देखना चाहेंगे?',
  'lang.suggestAction': 'बदलें',
  'lang.suggestDismiss': 'अंग्रेज़ी में रहें',
}

const es: Dict = {
  'nav.templates': 'Plantillas',
  'nav.pricing': 'Precios',
  'nav.blog': 'Blog',
  'nav.create': 'Crear invitación',
  'cta.start': 'Empezar a crear',
  'cta.createInvitation': 'Crear invitación',
  'cta.browseTemplates': 'Ver plantillas',
  'cta.useTemplate': 'Crear con esta plantilla',
  'hero.tagline': 'Invitaciones digitales que compartes con un solo enlace',
  'hero.sub': 'Añade tus datos, previsualiza la invitación completa antes de pagar y compártela por WhatsApp. Tus invitados no necesitan ninguna aplicación.',
  'value.noApp': 'Sin aplicación para los invitados',
  'value.oneLink': 'Un enlace, compartible en cualquier sitio',
  'price.previewFirst': 'Previsualiza antes de pagar',
  'price.oneTime': 'Pago único para publicar',
  'price.noSubscription': 'Sin suscripción',
  'lang.switch': 'Idioma',
  'lang.suggestTitle': '¿Ver esta página en español?',
  'lang.suggestAction': 'Cambiar',
  'lang.suggestDismiss': 'Seguir en inglés',
}

const pt: Dict = {
  'nav.templates': 'Modelos',
  'nav.pricing': 'Preços',
  'nav.blog': 'Blog',
  'nav.create': 'Criar convite',
  'cta.start': 'Começar a criar',
  'cta.createInvitation': 'Criar convite',
  'cta.browseTemplates': 'Ver modelos',
  'cta.useTemplate': 'Criar com este modelo',
  'hero.tagline': 'Convites digitais que você compartilha com um único link',
  'hero.sub': 'Adicione os seus dados, veja o convite completo antes de pagar e compartilhe no WhatsApp. Os convidados não precisam de nenhum aplicativo.',
  'value.noApp': 'Sem aplicativo para os convidados',
  'value.oneLink': 'Um link, compartilhável em qualquer lugar',
  'price.previewFirst': 'Veja antes de pagar',
  'price.oneTime': 'Pagamento único para publicar',
  'price.noSubscription': 'Sem assinatura',
  'lang.switch': 'Idioma',
  'lang.suggestTitle': 'Ver esta página em português?',
  'lang.suggestAction': 'Mudar',
  'lang.suggestDismiss': 'Continuar em inglês',
}

const fr: Dict = {
  'nav.templates': 'Modèles',
  'nav.pricing': 'Tarifs',
  'nav.blog': 'Blog',
  'nav.create': 'Créer une invitation',
  'cta.start': 'Commencer à créer',
  'cta.createInvitation': 'Créer une invitation',
  'cta.browseTemplates': 'Voir les modèles',
  'cta.useTemplate': 'Créer avec ce modèle',
  'hero.tagline': 'Des invitations numériques partagées en un seul lien',
  'hero.sub': 'Ajoutez vos informations, prévisualisez toute l’invitation avant de payer et partagez-la sur WhatsApp. Aucune application requise pour vos invités.',
  'value.noApp': 'Aucune application pour les invités',
  'value.oneLink': 'Un seul lien, partout',
  'price.previewFirst': 'Aperçu avant de payer',
  'price.oneTime': 'Paiement unique pour publier',
  'price.noSubscription': 'Sans abonnement',
  'lang.switch': 'Langue',
  'lang.suggestTitle': 'Afficher cette page en français ?',
  'lang.suggestAction': 'Changer',
  'lang.suggestDismiss': 'Rester en anglais',
}

const id: Dict = {
  'nav.templates': 'Templat',
  'nav.pricing': 'Harga',
  'nav.blog': 'Blog',
  'nav.create': 'Buat undangan',
  'cta.start': 'Mulai membuat',
  'cta.createInvitation': 'Buat undangan',
  'cta.browseTemplates': 'Lihat templat',
  'cta.useTemplate': 'Buat dengan templat ini',
  'hero.tagline': 'Undangan digital yang dibagikan lewat satu tautan',
  'hero.sub': 'Isi detail Anda, lihat pratinjau undangan lengkap sebelum membayar, lalu bagikan lewat WhatsApp. Tamu tidak perlu aplikasi apa pun.',
  'value.noApp': 'Tamu tidak perlu aplikasi',
  'value.oneLink': 'Satu tautan, bagikan di mana saja',
  'price.previewFirst': 'Pratinjau sebelum membayar',
  'price.oneTime': 'Sekali bayar untuk menerbitkan',
  'price.noSubscription': 'Tanpa langganan',
  'lang.switch': 'Bahasa',
  'lang.suggestTitle': 'Lihat halaman ini dalam Bahasa Indonesia?',
  'lang.suggestAction': 'Ganti',
  'lang.suggestDismiss': 'Tetap dalam Bahasa Inggris',
}

const vi: Dict = {
  'nav.templates': 'Mẫu thiệp',
  'nav.pricing': 'Bảng giá',
  'nav.blog': 'Blog',
  'nav.create': 'Tạo thiệp mời',
  'cta.start': 'Bắt đầu tạo thiệp',
  'cta.createInvitation': 'Tạo thiệp mời',
  'cta.browseTemplates': 'Xem mẫu thiệp',
  'cta.useTemplate': 'Tạo với mẫu này',
  'hero.tagline': 'Thiệp mời điện tử chia sẻ chỉ bằng một liên kết',
  'hero.sub': 'Nhập thông tin của bạn, xem trước toàn bộ thiệp mời trước khi thanh toán và chia sẻ qua WhatsApp. Khách mời không cần cài ứng dụng.',
  'value.noApp': 'Khách mời không cần ứng dụng',
  'value.oneLink': 'Một liên kết, chia sẻ mọi nơi',
  'price.previewFirst': 'Xem trước rồi mới thanh toán',
  'price.oneTime': 'Thanh toán một lần để đăng',
  'price.noSubscription': 'Không thuê bao',
  'lang.switch': 'Ngôn ngữ',
  'lang.suggestTitle': 'Xem trang này bằng Tiếng Việt?',
  'lang.suggestAction': 'Chuyển',
  'lang.suggestDismiss': 'Giữ Tiếng Anh',
}

const ar: Dict = {
  'nav.templates': 'القوالب',
  'nav.pricing': 'الأسعار',
  'nav.blog': 'المدونة',
  'nav.create': 'إنشاء دعوة',
  'cta.start': 'ابدأ التصميم',
  'cta.createInvitation': 'إنشاء دعوة',
  'cta.browseTemplates': 'تصفح القوالب',
  'cta.useTemplate': 'أنشئ بهذا القالب',
  'hero.tagline': 'دعوات رقمية تشاركها برابط واحد',
  'hero.sub': 'أضف تفاصيلك، وعاين الدعوة كاملة قبل الدفع، ثم شاركها عبر واتساب. لا يحتاج الضيوف إلى أي تطبيق.',
  'value.noApp': 'لا حاجة لتطبيق للضيوف',
  'value.oneLink': 'رابط واحد يُشارك في أي مكان',
  'price.previewFirst': 'عاين قبل أن تدفع',
  'price.oneTime': 'دفعة واحدة للنشر',
  'price.noSubscription': 'بدون اشتراك',
  'lang.switch': 'اللغة',
  'lang.suggestTitle': 'عرض هذه الصفحة بالعربية؟',
  'lang.suggestAction': 'تبديل',
  'lang.suggestDismiss': 'المتابعة بالإنجليزية',
}

const DICTS: Record<string, Dict> = { en, hi, es, pt, fr, id, vi, ar }

/** Translate a key, falling back to English and then to the key itself. */
export function t(key: string, locale: string = DEFAULT_LOCALE): string {
  return DICTS[locale]?.[key] ?? DICTS[DEFAULT_LOCALE][key] ?? key
}

export function dictFor(locale: string): Dict {
  return { ...DICTS[DEFAULT_LOCALE], ...(DICTS[locale] ?? {}) }
}

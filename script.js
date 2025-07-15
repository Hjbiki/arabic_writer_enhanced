// Arabic Writer - Modern JavaScript Implementation

// Configuration and Default Values
const config = {
  defaultLang: "en",
  defaultNumbers: "en",
  enableHarakat: 1,
  direction: "rtl",
  laaIndex: 8 * 50
};

// Number systems for different languages
const numbers = {
  ar: "٠١٢٣٤٥٦٧٨٩",
  fa: "۰۱۲۳۴۵۶۷۸۹",
  en: "0123456789"
};

// Global variables
let outputNumbers = numbers[config.defaultLang];
let currentCursor1 = 0;
let currentCursor2 = 0;
let oldText = "";
let tempString = "";
let textDirection = "right"; // right, center, left

// Character definitions
const leftConnecting = "یٹہےگکڤچپـئظشسيبلتنمكطضصثقفغعهخحج";
const rightConnecting = "یٹہےڈڑگکڤژچپـئؤرلالآىآةوزظشسيبللأاأتنمكطضصثقفغعهخحجدذلإإۇۆۈ";
const harakat = "ًٌٍَُِّْ";
const symbols = "ـ.،؟ @#$%^&*-+|\/=~,:";
const brackets = "(){}[]";

// Unicode character mappings
const unicode = "ﺁ ﺁ ﺂ ﺂ " + "ﺃ ﺃ ﺄ ﺄ " + "ﺇ ﺇ ﺈ ﺈ " + "ﺍ ﺍ ﺎ ﺎ " + "ﺏ ﺑ ﺒ ﺐ " + "ﺕ ﺗ ﺘ ﺖ " + "ﺙ ﺛ ﺜ ﺚ " + "ﺝ ﺟ ﺠ ﺞ " + "ﺡ ﺣ ﺤ ﺢ " + "ﺥ ﺧ ﺨ ﺦ " +
  "ﺩ ﺩ ﺪ ﺪ " + "ﺫ ﺫ ﺬ ﺬ " + "ﺭ ﺭ ﺮ ﺮ " + "ﺯ ﺯ ﺰ ﺰ " + "ﺱ ﺳ ﺴ ﺲ " + "ﺵ ﺷ ﺸ ﺶ " + "ﺹ ﺻ ﺼ ﺺ " + "ﺽ ﺿ ﻀ ﺾ " + "ﻁ ﻃ ﻄ ﻂ " + "ﻅ ﻇ ﻈ ﻆ " +
  "ﻉ ﻋ ﻌ ﻊ " + "ﻍ ﻏ ﻐ ﻎ " + "ﻑ ﻓ ﻔ ﻒ " + "ﻕ ﻗ ﻘ ﻖ " + "ﻙ ﻛ ﻜ ﻚ " + "ﻝ ﻟ ﻠ ﻞ " + "ﻡ ﻣ ﻤ ﻢ " + "ﻥ ﻧ ﻨ ﻦ " + "ﻩ ﻫ ﻬ ﻪ " + "ﻭ ﻭ ﻮ ﻮ " +
  "ﻱ ﻳ ﻴ ﻲ " + "ﺓ ﺓ ﺔ ﺔ " + "ﺅ ﺅ ﺆ ﺆ " + "ﺉ ﺋ ﺌ ﺊ " + "ﻯ ﻯ ﻰ ﻰ " + "ﭖ ﭘ ﭙ ﭗ " + "ﭺ ﭼ ﭽ ﭻ " + "ﮊ ﮊ ﮋ ﮋ " + "ﭪ ﭬ ﭭ ﭫ " + "ﮒ ﮔ ﮕ ﮓ " +
  "ﭦ ﭨ ﭩ ﭧ " + "ﮦ ﮨ ﮩ ﮧ " + "ﮮ ﮰ ﮱ ﮯ " + "ﯼ ﯾ ﯿ ﯽ " + "ﮈ ﮈ ﮉ ﮉ " + "ﮌ ﮌ ﮍ ﮍ " + "ﯗ ﯗ ﯘ ﯘ " + "ﯙ ﯙ ﯚ ﯚ " + "ﯛ ﯛ ﯜ ﯜ " + "ﮎ ﮐ ﮑ ﮏ " +
  "ﻵ ﻵ ﻶ ﻶ " + "ﻷ ﻷ ﻸ ﻸ " + "ﻹ ﻹ ﻺ ﻺ " + "ﻻ ﻻ ﻼ ﻼ ";

const arabic = "آ" + "أ" + "إ" + "ا" + "ب" + "ت" + "ث" + "ج" + "ح" + "خ" +
  "د" + "ذ" + "ر" + "ز" + "س" + "ش" + "ص" + "ض" + "ط" + "ظ" +
  "ع" + "غ" + "ف" + "ق" + "ك" + "ل" + "م" + "ن" + "ه" + "و" +
  "ي" + "ة" + "ؤ" + "ئ" + "ى" + "پ" + "چ" + "ژ" + "ڤ" + "گ" +
  "ٹ" + "ہ" + "ے" + "ی" + "ڈ" + "ڑ" + "ۇ" + "ۆ" + "ۈ" + "ک";

const notEng = arabic + harakat + "ء،؟";

// Language UI definitions
const languageStrings = {
  ar: {
    numbers: "الارقام",
    harakatOff: "الحركات غير مفعلة",
    harakatOn: "الحركات مفعلة",
    dirLtr: "اتجاه النص: من اليسار الى اليمين",
    dirRtl: "اتجاه النص: من اليمين الى اليسار",
    inputLabel: "النص الاصلي",
    outputLabel: "النص الناتج",
    about: "عن البرنامج",
    language: " اللغة ",
    keyboard: "لوحة المفاتيح العربية",
    space: "مسافة",
    tab: "فاصلة",
    backspace: "تراجع",
    delete: "حذف النص",
    select: "تظليل النص المعالج",
    process: "معالجة النص",
    copyOutput: "نسخ الناتج",
    clearAll: "مسح الكل",
    settings: "الإعدادات",
    rightAlign: "يمين",
    leftAlign: "يسار",
    centerAlign: "وسط",
    website: "الموقع",
    donate: "تبرع",
    x: "X",
    viewDetails: "عرض التفاصيل",
    aboutBtn: "عن البرنامج",
    // Settings modal content
    layoutModes: "أوضاع التخطيط المحسنة",
    chooseLayout: "اختر تخطيط الواجهة المفضل لديك:",
    floatingToolbar: "شريط أدوات عائم",
    floatingDesc: "أزرار الإجراءات تطفو فوق مناطق النص",
    sidebar: "الشريط الجانبي",
    sidebarDesc: "عناصر التحكم منظمة في لوحة جانبية",
    cards: "البطاقات",
    cardsDesc: "أقسام منظمة في تنسيق البطاقات",
    zenMode: "الوضع الهادئ",
    zenDesc: "واجهة بسيطة، مساحة نص أكبر",
    distractionFree: "خالي من الإلهاء",
    distractionDesc: "إخفاء كل شيء باستثناء مناطق النص",
    splitScreen: "الشاشة المقسمة",
    splitDesc: "الإدخال/الإخراج جنباً إلى جنب",
    presentation: "العرض التقديمي",
    presentationDesc: "نص كبير للعروض التوضيحية",
    compact: "مضغوط",
    compactDesc: "محسن للشاشات الصغيرة",
    advancedTheming: "الثيمات المتقدمة",
    chooseTheme: "اختر من الثيمات الجاهزة أو خصص الثيم الخاص بك:",
    light: "فاتح",
    lightDesc: "نظيف ومشرق",
    dark: "داكن",
    darkDesc: "لطيف على العينين",
    darkBlue: "أزرق داكن",
    darkBlueDesc: "احترافي وحديث",
    sepia: "بني داكن",
    sepiaDesc: "دافئ ومريح",
    highContrast: "عالي التباين",
    highContrastDesc: "يركز على إمكانية الوصول",
    custom: "مخصص",
    customDesc: "الثيم الشخصي الخاص بك",
    customColors: "ألوان الثيم المخصص",
    background: "الخلفية:",
    secondaryBg: "خلفية ثانوية:",
    textColor: "لون النص:",
    accentColor: "لون التمييز:",
    fontColor: "لون الخط:",
    textboxBg: "خلفية مربع النص:",
    buttonColor: "لون الزر:",
    buttonBg: "خلفية الزر:",
    resetDefault: "إعادة تعيين الافتراضي",
    saveTheme: "حفظ الثيم",
    gradientBg: "خلفيات متدرجة",
    gradientDesc: "أضف خلفيات متدرجة جميلة لتحسين تجربتك:",
    enableGradient: "تمكين الخلفيات المتدرجة",
    fontSettings: "إعدادات الخط",
    fontFamily: "عائلة الخط:",
    systemDefault: "النظام الافتراضي",
    arabicFonts: "الخطوط العربية",
    sansSerif: "سانس سيريف المشهورة",
    serif: "سيريف المشهورة",
    systemFonts: "خطوط النظام",
    customFont: "خط مخصص",
    uploadFont: "رفع خط مخصص:",
    fontFormats: "التنسيقات المدعومة: .woff, .woff2, .ttf, .otf",
    fontSize: "حجم الخط:",
    aboutSection: "حول",
    aboutVersion: "الكاتب العربي الإصدار 1.4.4 - النسخة المحسنة",
    viewDetails: "عرض التفاصيل",
    // Modal headers
    selectLanguage: "اختر اللغة",
    selectNumbers: "اختر الأرقام",
    // About modal content
    aboutTitle: "عن الكاتب العربي",
    aboutVersion: "الكاتب العربي الإصدار 1.4.4 - النسخة المحسنة",
    originalCreator: "المطور الأصلي",
    enhancedBy: "محسن بواسطة",
    creatorName: "عمر محمد",
    enhancerName: "عناد عسكر",
    originalDescription: "أنشأ تطبيق الكاتب العربي الأصلي لمساعدة المصممين العرب في العمل مع البرامج التي لا تدعم معالجة النصوص العربية.",
    enhancedDescription: "قمت بتحديث التطبيق بالكامل مع إضافة نظام الثيمات المتقدم، وتخطيطات محسنة، وتحسين تجربة المستخدم، وخيارات التخصيص الشاملة.",
    whatIsTitle: "ما هو الكاتب العربي؟",
    whatIsDescription: "الكاتب العربي هو أداة ويب مصممة لمساعدة المصممين والكتاب العرب في العمل مع البرامج التي لا تدعم معالجة النصوص العربية، مثل Adobe Photoshop وتطبيقات التصميم الأخرى.",
    howWorksTitle: "كيف يعمل؟",
    howWorksDescription: "ببساطة اكتب النص العربي في صندوق الإدخال، انقر على 'معالجة الإدخال'، وانسخ النص المعالج إلى تطبيق التصميم الخاص بك. تتعامل الأداة مع عرض النص العربي الصحيح وروابط الأحرف.",
    enhancedFeaturesTitle: "المميزات المحسنة",
    enhancedFeatures: [
      "<strong>نظام الثيمات المتقدم:</strong> 5 ثيمات جاهزة بالإضافة لمنتقي الألوان المخصص",
      "<strong>تخطيطات محسنة:</strong> 8 أوضاع تخطيط مختلفة لكل الاستخدامات",
      "<strong>خلفيات متدرجة:</strong> خيارات متدرجة جميلة",
      "<strong>نظام الطباعة:</strong> أكثر من 20 خط احترافي مع إمكانية الرفع المخصص",
      "<strong>دعم متعدد اللغات:</strong> العربية، الفارسية، والإنجليزية",
      "<strong>لوحة مفاتيح افتراضية:</strong> لوحة مفاتيح عربية كاملة مع رموز خاصة",
      "<strong>تصميم متجاوب:</strong> يعمل بشكل مثالي على جميع الأجهزة",
      "<strong>إمكانية الوصول:</strong> ثيم عالي التباين واختصارات المفاتيح"
    ],
    technicalDetailsTitle: "التفاصيل التقنية",
    technicalDetailsDescription: "مبني بتقنيات الويب الحديثة بما في ذلك HTML5 و CSS3 و JavaScript ES6. تتضمن المميزات خصائص CSS المخصصة للثيمات، وتخزين localStorage لاستمرارية الإعدادات، ومبادئ التصميم المتجاوب.",
    quote: "ردم الفجوة بين الطباعة العربية وأدوات التصميم الحديثة"
  },
  en: {
    numbers: "Numbers",
    harakatOff: "Harakat Disabled",
    harakatOn: "Harakat Enabled",
    dirLtr: "Direction: Left To Right",
    dirRtl: "Direction: Right To Left",
    inputLabel: "Input",
    outputLabel: "Output",
    about: "About",
    language: "Language",
    keyboard: "Arabic Keyboard",
    space: "Space",
    tab: "Tab",
    backspace: "BackSpace",
    delete: "Clear Fields",
    select: "Select Output",
    process: "Process Input",
    copyOutput: "Copy Output",
    clearAll: "Clear All",
    settings: "Settings",
    rightAlign: "Right",
    leftAlign: "Left",
    centerAlign: "Center",
    website: "Website",
    donate: "Donate",
    x: "X",
    viewDetails: "View Details",
    aboutBtn: "About",
    // Settings modal content
    layoutModes: "Enhanced Layout Modes",
    chooseLayout: "Choose your preferred interface layout:",
    floatingToolbar: "Floating Toolbar",
    floatingDesc: "Action buttons float above text areas",
    sidebar: "Sidebar",
    sidebarDesc: "Controls organized in a side panel",
    cards: "Cards",
    cardsDesc: "Organized sections in card format",
    zenMode: "Zen Mode",
    zenDesc: "Minimal interface, maximum text space",
    distractionFree: "Distraction-Free",
    distractionDesc: "Hide everything except text areas",
    splitScreen: "Split-Screen",
    splitDesc: "Input/output side by side",
    presentation: "Presentation",
    presentationDesc: "Large text for demonstrations",
    compact: "Compact",
    compactDesc: "Optimized for smaller screens",
    advancedTheming: "Advanced Theming",
    chooseTheme: "Choose from preset themes or customize your own:",
    light: "Light",
    lightDesc: "Clean & bright",
    dark: "Dark",
    darkDesc: "Easy on the eyes",
    darkBlue: "Dark Blue",
    darkBlueDesc: "Professional & modern",
    sepia: "Sepia",
    sepiaDesc: "Warm & comfortable",
    highContrast: "High Contrast",
    highContrastDesc: "Accessibility focused",
    custom: "Custom",
    customDesc: "Your personalized theme",
    customColors: "Custom Theme Colors",
    background: "Background:",
    secondaryBg: "Secondary BG:",
    textColor: "Text Color:",
    accentColor: "Accent Color:",
    fontColor: "Font Color:",
    textboxBg: "Textbox BG:",
    buttonColor: "Button Color:",
    buttonBg: "Button BG:",
    resetDefault: "Reset to Default",
    saveTheme: "Save Theme",
    gradientBg: "Gradient Backgrounds",
    gradientDesc: "Add beautiful gradient backgrounds to enhance your experience:",
    enableGradient: "Enable gradient backgrounds",
    fontSettings: "Font Settings",
    fontFamily: "Font Family:",
    systemDefault: "System Default",
    arabicFonts: "Arabic Fonts",
    sansSerif: "Popular Sans-Serif",
    serif: "Popular Serif",
    systemFonts: "System Fonts",
    customFont: "Custom Font",
    uploadFont: "Upload Custom Font:",
    fontFormats: "Supported formats: .woff, .woff2, .ttf, .otf",
    fontSize: "Font Size:",
    aboutSection: "About",
    aboutVersion: "Arabic Writer v1.4.4 - Enhanced Edition",
    viewDetails: "View Details",
    // Modal headers
    selectLanguage: "Select Language",
    selectNumbers: "Select Numbers",
    // About modal content
    aboutTitle: "About Arabic Writer",
    aboutVersion: "Arabic Writer v1.4.4 - Enhanced Edition",
    originalCreator: "Original Creator",
    enhancedBy: "Enhanced By",
    creatorName: "Omar Mhuammed",
    enhancerName: "Anad Askar",
    originalDescription: "Created the original Arabic Writer application to help Arabic designers work with programs that don't support Arabic text processing.",
    enhancedDescription: "I completely modernized the application with advanced theming, enhanced layouts, improved UX, and comprehensive customization options.",
    whatIsTitle: "What is Arabic Writer?",
    whatIsDescription: "Arabic Writer is a web-based tool designed to help Arabic designers and writers work with programs that don't support Arabic text processing, such as Adobe Photoshop and other design applications.",
    howWorksTitle: "How does it work?",
    howWorksDescription: "Simply type your Arabic text in the input box, click 'Process Input', and copy the processed text to your design application. The tool handles proper Arabic text rendering and character connections.",
    enhancedFeaturesTitle: "Enhanced Features",
    enhancedFeatures: [
      "<strong>Advanced Theming:</strong> 5 preset themes plus custom color picker",
      "<strong>Enhanced Layouts:</strong> 8 different layout modes for every use case",
      "<strong>Gradient Backgrounds:</strong> Beautiful gradient options",
      "<strong>Typography System:</strong> 20+ professional fonts with custom upload",
      "<strong>Multi-language Support:</strong> Arabic, Persian, and English",
      "<strong>Virtual Keyboard:</strong> Complete Arabic keyboard with special characters",
      "<strong>Responsive Design:</strong> Works perfectly on all devices",
      "<strong>Accessibility:</strong> High contrast theme and keyboard shortcuts"
    ],
    technicalDetailsTitle: "Technical Details",
    technicalDetailsDescription: "Built with modern web technologies including HTML5, CSS3, and JavaScript ES6. Features include CSS custom properties for theming, localStorage for settings persistence, and responsive design principles.",
    quote: "Bridging the gap between Arabic typography and modern design tools"
  },
  fa: {
    numbers: "اعداد",
    harakatOff: "اعراب غیرفعال",
    harakatOn: "اعراب فعال",
    dirLtr: "جهت: چپ به راست",
    dirRtl: "جهت: راست به چپ",
    inputLabel: "متن ورودی",
    outputLabel: "متن خروجی",
    about: "درباره",
    language: "زبان",
    keyboard: "صفحه‌کلید عربی",
    space: "فاصله",
    tab: "Tab",
    backspace: "BackSpace",
    delete: "خالی‌کردن فیلدها",
    select: "انتخاب خروجی",
    process: "پردازش",
    copyOutput: "کپی کردن خروجی",
    clearAll: "پاک کردن همه",
    settings: "تنظیمات",
    rightAlign: "راست",
    leftAlign: "چپ",
    centerAlign: "وسط",
    website: "وب سایت",
    donate: "حمایت کنید",
    x: "X",
    viewDetails: "نمایش جزئیات",
    aboutBtn: "درباره",
    // Settings modal content
    layoutModes: "حالت‌های طرح‌بندی بهبود یافته",
    chooseLayout: "طرح‌بندی واجهه مورد نظر خود را انتخاب کنید:",
    floatingToolbar: "نوار ابزار شناور",
    floatingDesc: "دکمه‌های عمل بر روی نواحی متن شناور می‌شوند",
    sidebar: "نوار جانبی",
    sidebarDesc: "کنترل‌ها در یک پنل جانبی سازماندهی شده‌اند",
    cards: "کارت‌ها",
    cardsDesc: "بخش‌های سازماندهی شده در قالب کارت",
    zenMode: "حالت آرام",
    zenDesc: "واجهه کمینه، فضای متن حداکثر",
    distractionFree: "بدون حواس‌پرتی",
    distractionDesc: "همه چیز را پنهان کنید به جز نواحی متن",
    splitScreen: "صفحه تقسیم شده",
    splitDesc: "ورودی/خروجی در کنار هم",
    presentation: "ارائه",
    presentationDesc: "متن بزرگ برای نمایش‌ها",
    compact: "جمع و جور",
    compactDesc: "بهینه شده برای صفحه‌های کوچک",
    advancedTheming: "قالب‌بندی پیشرفته",
    chooseTheme: "از قالب‌های آماده انتخاب کنید یا قالب خود را سفارشی کنید:",
    light: "روشن",
    lightDesc: "تمیز و روشن",
    dark: "تاریک",
    darkDesc: "آسان برای چشم‌ها",
    darkBlue: "آبی تیره",
    darkBlueDesc: "حرفه‌ای و مدرن",
    sepia: "قهوه‌ای",
    sepiaDesc: "گرم و راحت",
    highContrast: "کنتراست بالا",
    highContrastDesc: "متمرکز بر دسترسی‌پذیری",
    custom: "سفارشی",
    customDesc: "قالب شخصی شما",
    customColors: "رنگ‌های قالب سفارشی",
    background: "پس‌زمینه:",
    secondaryBg: "پس‌زمینه ثانویه:",
    textColor: "رنگ متن:",
    accentColor: "رنگ تأکید:",
    fontColor: "رنگ فونت:",
    textboxBg: "پس‌زمینه جعبه متن:",
    buttonColor: "رنگ دکمه:",
    buttonBg: "پس‌زمینه دکمه:",
    resetDefault: "بازنشانی به پیش‌فرض",
    saveTheme: "ذخیره قالب",
    gradientBg: "پس‌زمینه‌های گرادیان",
    gradientDesc: "پس‌زمینه‌های گرادیان زیبا اضافه کنید تا تجربه شما بهبود یابد:",
    enableGradient: "فعال‌سازی پس‌زمینه‌های گرادیان",
    fontSettings: "تنظیمات فونت",
    fontFamily: "خانواده فونت:",
    systemDefault: "پیش‌فرض سیستم",
    arabicFonts: "فونت‌های عربی",
    sansSerif: "سن‌سریف محبوب",
    serif: "سریف محبوب",
    systemFonts: "فونت‌های سیستم",
    customFont: "فونت سفارشی",
    uploadFont: "بارگذاری فونت سفارشی:",
    fontFormats: "فرمت‌های پشتیبانی شده: .woff, .woff2, .ttf, .otf",
    fontSize: "اندازه فونت:",
    aboutSection: "درباره",
    aboutVersion: "نویسنده عربی v1.4.4 - ویرایش بهبود یافته",
    viewDetails: "مشاهده جزئیات",
    // Modal headers
    selectLanguage: "انتخاب زبان",
    selectNumbers: "انتخاب اعداد",
    // About modal content
    aboutTitle: "درباره نویسنده عربی",
    aboutVersion: "نویسنده عربی v1.4.4 - نسخه بهبود یافته",
    originalCreator: "سازنده اصلی",
    enhancedBy: "بهبود یافته توسط",
    creatorName: "عمر محمد",
    enhancerName: "عناد عسكر",
    originalDescription: "برنامه اصلی نویسنده عربی را برای کمک به طراحان عربی در کار با برنامه‌هایی که از پردازش متن عربی پشتیبانی نمی‌کنند، ایجاد کرد.",
    enhancedDescription: "برنامه را به طور کامل مدرن کردم با افزودن تم‌های پیشرفته، طرح‌بندی‌های بهبود یافته، تجربه کاربری بهتر، و گزینه‌های سفارشی‌سازی جامع.",
    whatIsTitle: "نویسنده عربی چیست؟",
    whatIsDescription: "نویسنده عربی ابزاری تحت وب است که برای کمک به طراحان و نویسندگان عربی در کار با برنامه‌هایی که از پردازش متن عربی پشتیبانی نمی‌کنند، مانند Adobe Photoshop و سایر برنامه‌های طراحی طراحی شده است.",
    howWorksTitle: "چگونه کار می‌کند؟",
    howWorksDescription: "به سادگی متن عربی خود را در جعبه ورودی تایپ کنید، روی 'پردازش ورودی' کلیک کنید، و متن پردازش شده را در برنامه طراحی خود کپی کنید. ابزار نمایش صحیح متن عربی و اتصالات حروف را مدیریت می‌کند.",
    enhancedFeaturesTitle: "ویژگی‌های بهبود یافته",
    enhancedFeatures: [
      "<strong>تم‌سازی پیشرفته:</strong> ۵ تم آماده به علاوه انتخابگر رنگ سفارشی",
      "<strong>طرح‌بندی‌های بهبود یافته:</strong> ۸ حالت طرح‌بندی متفاوت برای هر نوع استفاده",
      "<strong>پس‌زمینه‌های گرادیان:</strong> گزینه‌های زیبای گرادیان",
      "<strong>سیستم تایپوگرافی:</strong> بیش از ۲۰ فونت حرفه‌ای با قابلیت بارگذاری سفارشی",
      "<strong>پشتیبانی چند زبانه:</strong> عربی، فارسی، و انگلیسی",
      "<strong>صفحه‌کلید مجازی:</strong> صفحه‌کلید کامل عربی با کاراکترهای خاص",
      "<strong>طراحی واکنش‌گرا:</strong> بر روی تمام دستگاه‌ها کاملاً کار می‌کند",
      "<strong>دسترسی‌پذیری:</strong> تم با کنتراست بالا و میانبرهای صفحه‌کلید"
    ],
    technicalDetailsTitle: "جزئیات فنی",
    technicalDetailsDescription: "با تکنولوژی‌های مدرن وب شامل HTML5، CSS3، و JavaScript ES6 ساخته شده است. ویژگی‌ها شامل خصوصیات CSS سفارشی برای تم‌ها، localStorage برای ماندگاری تنظیمات، و اصول طراحی واکنش‌گرا می‌باشد.",
    quote: "پل زدن شکاف بین تایپوگرافی عربی و ابزارهای طراحی مدرن"
  }
};

// Browser detection (simplified for modern browsers)
const browser = {
  isIE: /MSIE|Trident/.test(navigator.userAgent),
  isOpera: /Opera/.test(navigator.userAgent)
};

// Utility functions
function getElement(id) {
  return document.getElementById(id);
}

function setValue(id, value) {
  const element = getElement(id);
  if (element) {
    if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
      element.value = value;
    } else {
      element.textContent = value;
    }
  }
}

function setHTML(id, value) {
  const element = getElement(id);
  if (element) {
    element.innerHTML = value;
  }
}

function setDirection(id, direction) {
  const element = getElement(id);
  if (element) {
    element.dir = direction;
  }
}

function show(id) {
  const element = getElement(id);
  if (element) {
    if (id === 'inline-keyboard') {
      element.style.display = "block";
    } else {
      element.style.display = "flex";
    }
    
    // Update settings modal when opened
    if (id === 'settings') {
      updateLayoutSelector();
      updateSettingsValues();
    }
  }
}

function hide(id) {
  const element = getElement(id);
  if (element) {
    element.style.display = "none";
  }
}

// Main processing function
function ProcessInput() {
  const form = getElement('writer');
  const inputBox = form.inpbox;
  const outputBox = form.outbox;
  
  outputBox.value = "";
  oldText = "";
  tempString = "";
  
  const inputText = inputBox.value;
  const characters = inputText.split("");
  const length = characters.length;
  
  for (let i = 0; i < length; i++) {
    let beforeIndex = 1;
    let afterIndex = 1;
    
    // Skip harakat when determining connections
    while (harakat.indexOf(characters[i - beforeIndex]) >= 0) {
      beforeIndex++;
    }
    while (harakat.indexOf(characters[i + afterIndex]) >= 0) {
      afterIndex++;
    }
    
    // Determine character position
    let position = 0;
    
    if (i === 0) {
      // First character
      if (rightConnecting.indexOf(characters[afterIndex]) >= 0) {
        position = 2;
      }
    } else if (i === length - 1) {
      // Last character
      if (leftConnecting.indexOf(characters[length - beforeIndex - 1]) >= 0) {
        position = 6;
      }
    } else {
      // Middle character
      const connectsBefore = leftConnecting.indexOf(characters[i - beforeIndex]) >= 0;
      const connectsAfter = rightConnecting.indexOf(characters[i + afterIndex]) >= 0;
      
      if (!connectsBefore) {
        position = connectsAfter ? 2 : 0;
      } else {
        position = connectsAfter ? 4 : 6;
      }
    }
    
    const char = characters[i];
    
    if (char === "\n") {
      oldText += outputBox.value + "\n";
      outputBox.value = "";
    } else if (char === "\r") {
      // Skip carriage return
      continue;
    } else if (char === "ء") {
      addChar("ﺡ");
    } else if (brackets.indexOf(char) >= 0) {
      // Reverse brackets
      const bracketIndex = brackets.indexOf(char);
      const reversedBracket = (bracketIndex % 2 === 0) 
        ? brackets.charAt(bracketIndex + 1) 
        : brackets.charAt(bracketIndex - 1);
      addChar(reversedBracket);
    } else if (arabic.indexOf(char) >= 0) {
      // Arabic letter processing
      if (char === "ل") {
        // Handle lam-alef combinations
        const nextCharIndex = arabic.indexOf(characters[i + 1]);
        if (nextCharIndex >= 0 && nextCharIndex < 4) {
          addChar(unicode.charAt((nextCharIndex * 8) + position + config.laaIndex));
          i++; // Skip next character
        } else {
          addChar(unicode.charAt((arabic.indexOf(char) * 8) + position));
        }
      } else {
        addChar(unicode.charAt((arabic.indexOf(char) * 8) + position));
      }
    } else if (symbols.indexOf(char) >= 0) {
      addChar(char);
    } else if (harakat.indexOf(char) >= 0) {
      if (config.enableHarakat) {
        addChar(char);
      }
    } else if (unicode.indexOf(char) >= 0) {
      // Reverse Unicode characters back to Arabic
      const unicodePos = unicode.indexOf(char);
      const laaPos = unicode.indexOf(char);
      
      if (laaPos >= config.laaIndex) {
        // Handle lam-alef combinations
        for (let temp = 8; temp < 40; temp += 8) {
          if (laaPos < (temp + config.laaIndex)) {
            addChar(arabic.charAt((temp / 8) - 1));
            addChar("ل");
            break;
          }
        }
      } else {
        // Regular character
        for (let temp = 8; temp < (config.laaIndex + 32); temp += 8) {
          if (unicodePos < temp) {
            addChar(arabic.charAt((temp / 8) - 1));
            break;
          }
        }
      }
    } else {
      // Handle English text and numbers
      let currentIndex = i;
      tempString = "";
      
      while (
        currentIndex < length &&
        notEng.indexOf(characters[currentIndex]) < 0 &&
        unicode.indexOf(characters[currentIndex]) < 0 &&
        brackets.indexOf(characters[currentIndex]) < 0
      ) {
        let char = characters[currentIndex];
        
        // Convert numbers based on current setting
        for (const [key, numberSet] of Object.entries(numbers)) {
          const numberIndex = numberSet.indexOf(char);
          if (numberIndex >= 0) {
            char = numbers[config.defaultNumbers].charAt(numberIndex);
            break;
          }
        }
        
        tempString += char;
        currentIndex++;
        
        if (characters[currentIndex + 1] === "\n") {
          break;
        }
      }
      
      // Handle spacing for English text
      const englishChars = tempString.split("");
      let spaceIndex = englishChars.length - 1;
      
      if (englishChars.length === 2 && englishChars[1] === " ") {
        tempString = " " + englishChars[0];
      } else {
        while (englishChars[spaceIndex] === " ") {
          tempString = " " + tempString.substring(0, tempString.length - 1);
          spaceIndex--;
        }
      }
      
      outputBox.value = tempString + outputBox.value;
      tempString = "";
      i = currentIndex - 1;
    }
  }
  
  outputBox.value = oldText + outputBox.value;
}

// Character addition function
function addChar(char) {
  const outputBox = getElement('outbox');
  outputBox.value = char + outputBox.value;
}

// Keyboard functions
function addKB(char) {
  const inputBox = getElement('inpbox');
  const mainLength = inputBox.value.length;
  
  if (['لا', 'لإ', 'لأ', 'لآ'].includes(char)) {
    currentCursor2++;
  }
  
  inputBox.value = inputBox.value.substring(0, currentCursor1) + 
                   char + 
                   inputBox.value.substring(currentCursor2, mainLength);
  
  currentCursor1 += char.length;
  currentCursor2 = currentCursor1;
}

function remKB() {
  const inputBox = getElement('inpbox');
  const mainLength = inputBox.value.length;
  
  inputBox.value = inputBox.value.substring(0, currentCursor1 - 1) + 
                   inputBox.value.substring(currentCursor2, mainLength);
  
  if (currentCursor1 > 0) {
    currentCursor1--;
  }
  currentCursor2 = currentCursor1;
}

// Cursor position tracking
function update(element) {
  currentCursor1 = getSelectionStart(element);
  currentCursor2 = getSelectionEnd(element);
  return true;
}

function getSelectionStart(element) {
  if (element.createTextRange) {
    const range = document.selection.createRange().duplicate();
    range.moveEnd('character', element.value.length);
    if (range.text === '') return element.value.length;
    return element.value.lastIndexOf(range.text);
  } else {
    return element.selectionStart;
  }
}

function getSelectionEnd(element) {
  if (element.createTextRange) {
    const range = document.selection.createRange().duplicate();
    range.moveStart('character', -element.value.length);
    return range.text.length;
  } else {
    return element.selectionEnd;
  }
}

// Text selection function
function selectit() {
  const outputBox = getElement('outbox');
  outputBox.focus();
  outputBox.select();
}

// Copy output to clipboard
function copyOutput() {
  const outputBox = getElement('outbox');
  const text = outputBox.value;
  
  if (text.trim() === '') {
    alert('No text to copy!');
    return;
  }
  
  navigator.clipboard.writeText(text).then(function() {
    // Show success feedback
    const button = getElement('copytxt');
    const originalText = button.querySelector('.btn-text').textContent;
    const originalIcon = button.querySelector('.btn-icon').textContent;
    
    button.querySelector('.btn-text').textContent = 'Copied!';
    button.querySelector('.btn-text').style.color = 'var(--primary-color)';
    button.querySelector('.btn-text').style.fontWeight = 'bold';
    button.querySelector('.btn-icon').textContent = '✓';
    button.querySelector('.btn-icon').style.color = 'var(--primary-color)';
    
    setTimeout(function() {
      button.querySelector('.btn-text').textContent = originalText;
      button.querySelector('.btn-text').style.color = '';
      button.querySelector('.btn-text').style.fontWeight = '';
      button.querySelector('.btn-icon').textContent = originalIcon;
      button.querySelector('.btn-icon').style.color = '';
    }, 2000);
  }).catch(function() {
    // Fallback for older browsers
    selectit();
    try {
      document.execCommand('copy');
      alert('Text copied to clipboard!');
    } catch (err) {
      alert('Unable to copy text. Please select and copy manually.');
    }
  });
}

// Settings functions
function setNumbers(lang) {
  config.defaultNumbers = lang;
  outputNumbers = numbers[lang];
  updateButtonLabels();
}

// Language cycle function
function toggleLanguage() {
  const languages = ['en', 'ar', 'fa'];
  const currentIndex = languages.indexOf(config.defaultLang);
  const nextIndex = (currentIndex + 1) % languages.length;
  const nextLang = languages[nextIndex];
  
  setLang(nextLang);
  updateButtonLabels();
}

// Numbers cycle function  
function toggleNumbers() {
  const numberSystems = ['en', 'ar', 'fa'];
  const currentIndex = numberSystems.indexOf(config.defaultNumbers);
  const nextIndex = (currentIndex + 1) % numberSystems.length;
  const nextSystem = numberSystems[nextIndex];
  
  setNumbers(nextSystem);
  updateButtonLabels();
}

// Update button labels and text
function updateButtonLabels() {
  const strings = languageStrings[config.defaultLang];
  
  // Update language button
  const langButton = getElement('languagepop-text');
  const langNames = { en: 'English', ar: 'العربية', fa: 'فارسی' };
  if (langButton) {
    langButton.textContent = langNames[config.defaultLang];
  }
  
  // Update numbers button with correct examples
  const numbersButton = getElement('xnumbers');
  const numbersText = numbersButton.querySelector('.btn-text');
  const numberNames = { 
    en: { en: 'Arabic (123)', ar: 'Arabic-Indi (١٢٣)', fa: 'Persian (۱۲۳)' },
    ar: { en: 'عربية (123)', ar: 'عربية-هندية (١٢٣)', fa: 'فارسية (۱۲۳)' },
    fa: { en: 'عربی (123)', ar: 'عربی-هندی (١٢٣)', fa: 'فارسی (۱۲۳)' }
  };
  if (numbersText) {
    numbersText.textContent = numberNames[config.defaultLang][config.defaultNumbers];
  }
  
  // Update harakat button
  const harakatButton = getElement('xharakat');
  const harakatText = harakatButton.querySelector('.btn-text');
  if (harakatText) {
    harakatText.textContent = config.enableHarakat ? strings.harakatOn : strings.harakatOff;
  }
  
  // Update keyboard button
  const keyboardButton = getElement('keyboardpop');
  const keyboardText = keyboardButton.querySelector('.btn-text');
  if (keyboardText) {
    keyboardText.textContent = 'Show/Hide';
  }
}

// Theme management
function initializeTheme() {
  // Get saved theme from localStorage or default to 'light'
  const savedTheme = localStorage.getItem('arabic-writer-theme') || 'light';
  setTheme(savedTheme);
  
  // Add theme toggle event listener
  const themeToggle = getElement('theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
  }
}

function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  
  // Update theme toggle icon properly
  const themeIcon = document.querySelector('#theme-toggle .theme-icon');
  if (themeIcon) {
    themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
  }
  
  // Update toggle button title
  const themeToggle = getElement('theme-toggle');
  if (themeToggle) {
    themeToggle.title = theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode';
  }
  
  // Save to localStorage
  localStorage.setItem('arabic-writer-theme', theme);
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  setTheme(newTheme);
}

// Updated harakat function
function switch_harakat() {
  config.enableHarakat = config.enableHarakat === 1 ? 0 : 1;
  updateButtonLabels();
}

// Text direction switcher
function switchTextDirection() {
  const inputBox = getElement('inpbox');
  const outputBox = getElement('outbox');
  const button = getElement('text-direction');
  const buttonText = button.querySelector('.btn-text');
  const strings = languageStrings[config.defaultLang];
  
  // Cycle through directions: right -> center -> left -> right
  switch (textDirection) {
    case "right":
      textDirection = "center";
      inputBox.style.textAlign = "center";
      outputBox.style.textAlign = "center";
      inputBox.style.direction = "ltr";
      outputBox.style.direction = "ltr";
      buttonText.textContent = strings.centerAlign;
      break;
    case "center":
      textDirection = "left";
      inputBox.style.textAlign = "left";
      outputBox.style.textAlign = "left";
      inputBox.style.direction = "ltr";
      outputBox.style.direction = "ltr";
      buttonText.textContent = strings.leftAlign;
      break;
    case "left":
      textDirection = "right";
      inputBox.style.textAlign = "right";
      outputBox.style.textAlign = "right";
      inputBox.style.direction = "rtl";
      outputBox.style.direction = "rtl";
      buttonText.textContent = strings.rightAlign;
      break;
  }
}

// Update text direction button label
function updateTextDirectionButton() {
  const button = getElement('text-direction');
  const buttonText = button.querySelector('.btn-text');
  const strings = languageStrings[config.defaultLang];
  
  if (buttonText) {
    switch (textDirection) {
      case "right":
        buttonText.textContent = strings.rightAlign;
        break;
      case "center":
        buttonText.textContent = strings.centerAlign;
        break;
      case "left":
        buttonText.textContent = strings.leftAlign;
        break;
    }
  }
}

// Removed switch_dir function as Direction button was removed

// Language setting function
function setLang(langId) {
  config.defaultLang = langId;
  const strings = languageStrings[langId];
  
  // Update title to single language
  const titleElement = document.querySelector('.title-section h1');
  const titles = {
    en: 'Arabic Writer',
    ar: 'الكاتب العربي',
    fa: 'نویسنده عربی'
  };
  if (titleElement) {
    titleElement.textContent = titles[langId];
  }
  
  // Update UI elements
  setHTML("box1info", strings.inputLabel);
  setHTML("box2info", strings.outputLabel);
  setValue("aboutpop", strings.about);
  setValue("languagepop-text", strings.language);
  setValue("keyboardpop", strings.keyboard);
  setValue("kspace", strings.space);
  setValue("ktab", strings.tab);
  setValue("kbspace", strings.backspace);
  setValue("deletetxt", strings.delete);
  setValue("selecttxt", strings.select);
  setValue("processtxt", strings.process);
  setValue("copytxt", strings.copyOutput);
  setValue("cleartxt", strings.clearAll);
  
  // Update settings button text
  const settingsBtn = document.querySelector('#settings-btn .btn-text');
  if (settingsBtn) settingsBtn.textContent = strings.settings;
  
  // Update about button text
  const aboutBtn = document.querySelector('#aboutpop .btn-text');
  if (aboutBtn) aboutBtn.textContent = strings.aboutBtn;
  
  // Update social links
  const websiteText = document.querySelector('#website-text');
  const donateText = document.querySelector('#donate-text');
  const xText = document.querySelector('#x-text');
  if (websiteText) websiteText.textContent = strings.website;
  if (donateText) donateText.textContent = strings.donate;
  if (xText) xText.textContent = strings.x;
  
  // Update text direction button
  updateTextDirectionButton();
  
  // Update about modal content
  updateAboutContent(strings);
  
  // Update settings modal content
  updateSettingsModal(strings);
  
  // Update modal headers
  const langModalHeader = document.querySelector('#lang .modal-header h3');
  const numbersModalHeader = document.querySelector('#numbers .modal-header h3');
  const settingsModalHeader = document.querySelector('#settings-title');
  if (langModalHeader) langModalHeader.textContent = strings.selectLanguage;
  if (numbersModalHeader) numbersModalHeader.textContent = strings.selectNumbers;
  if (settingsModalHeader) settingsModalHeader.textContent = strings.settings;
  
  // Update other settings
  setNumbers(langId);
  
  // Update button labels with new language
  updateButtonLabels();
  
  // Reset harakat and direction to ensure consistency
  const currentHarakat = config.enableHarakat;
  const currentDirection = config.direction;
  
  config.enableHarakat = currentHarakat === 1 ? 0 : 1;
  switch_harakat();
  
  config.direction = currentDirection === "rtl" ? "ltr" : "rtl";
  // Removed switch_dir call since we removed that function
  
  hide("lang");
}

// Update about modal content based on selected language
function updateAboutContent(strings) {
  const aboutTitle = document.querySelector('#about .modal-header h3');
  const aboutVersion = document.querySelector('#about h4');
  const originalCreatorLabel = document.querySelector('#about .about-grid div:first-child h5');
  const enhancedByLabel = document.querySelector('#about .about-grid div:last-child h5');
  const creatorName = document.querySelector('#creator-name');
  const enhancerName = document.querySelector('#enhancer-name');
  const originalDescription = document.querySelector('#about .about-grid div:first-child p:last-of-type');
  const enhancedDescription = document.querySelector('#about .about-grid div:last-child p:last-of-type');
  
  const whatIsTitle = document.querySelector('#about .about-content > h5:nth-of-type(1)');
  const whatIsDescription = document.querySelector('#about .about-content > h5:nth-of-type(1) + p');
  const howWorksTitle = document.querySelector('#about .about-content > h5:nth-of-type(2)');
  const howWorksDescription = document.querySelector('#about .about-content > h5:nth-of-type(2) + p');
  const enhancedFeaturesTitle = document.querySelector('#about .about-content > h5:nth-of-type(3)');
  const enhancedFeaturesList = document.querySelector('#about .about-content > h5:nth-of-type(3) + ul');
  const technicalDetailsTitle = document.querySelector('#about .about-content > h5:nth-of-type(4)');
  const technicalDetailsDescription = document.querySelector('#about .about-content > h5:nth-of-type(4) + p');
  const quote = document.querySelector('#about p[style*="italic"]');
  
  // Update all text content
  if (aboutTitle) aboutTitle.textContent = strings.aboutTitle;
  if (aboutVersion) aboutVersion.textContent = strings.aboutVersion;
  if (originalCreatorLabel) originalCreatorLabel.textContent = strings.originalCreator;
  if (enhancedByLabel) enhancedByLabel.textContent = strings.enhancedBy;
  if (creatorName) creatorName.textContent = strings.creatorName;
  if (enhancerName) enhancerName.textContent = strings.enhancerName;
  if (originalDescription) originalDescription.textContent = strings.originalDescription;
  if (enhancedDescription) enhancedDescription.textContent = strings.enhancedDescription;
  if (whatIsTitle) whatIsTitle.textContent = strings.whatIsTitle;
  if (whatIsDescription) whatIsDescription.textContent = strings.whatIsDescription;
  if (howWorksTitle) howWorksTitle.textContent = strings.howWorksTitle;
  if (howWorksDescription) howWorksDescription.textContent = strings.howWorksDescription;
  if (enhancedFeaturesTitle) enhancedFeaturesTitle.textContent = strings.enhancedFeaturesTitle;
  
  // Update enhanced features list
  if (enhancedFeaturesList && strings.enhancedFeatures) {
    enhancedFeaturesList.innerHTML = strings.enhancedFeatures.map(feature => `<li>${feature}</li>`).join('');
  }
  
  if (technicalDetailsTitle) technicalDetailsTitle.textContent = strings.technicalDetailsTitle;
  if (technicalDetailsDescription) technicalDetailsDescription.textContent = strings.technicalDetailsDescription;
  if (quote) quote.innerHTML = `"${strings.quote}"`;
}

// Update settings modal content based on selected language
function updateSettingsModal(strings) {
  // Layout section
  const layoutTitle = document.querySelector('#layout-modes-title');
  const layoutDesc = document.querySelector('#layout-modes-desc');
  const floatingTitle = document.querySelector('#floating-title');
  const floatingDesc = document.querySelector('#floating-desc');
  const sidebarTitle = document.querySelector('#sidebar-title');
  const sidebarDesc = document.querySelector('#sidebar-desc');
  const cardsTitle = document.querySelector('#cards-title');
  const cardsDesc = document.querySelector('#cards-desc');
  const zenTitle = document.querySelector('#zen-title');
  const zenDesc = document.querySelector('#zen-desc');
  const distractionTitle = document.querySelector('#distraction-title');
  const distractionDesc = document.querySelector('#distraction-desc');
  const splitTitle = document.querySelector('#split-title');
  const splitDesc = document.querySelector('#split-desc');
  const presentationTitle = document.querySelector('#presentation-title');
  const presentationDesc = document.querySelector('#presentation-desc');
  const compactTitle = document.querySelector('#compact-title');
  const compactDesc = document.querySelector('#compact-desc');
  
  if (layoutTitle) layoutTitle.textContent = strings.layoutModes;
  if (layoutDesc) layoutDesc.textContent = strings.chooseLayout;
  if (floatingTitle) floatingTitle.textContent = strings.floatingToolbar;
  if (floatingDesc) floatingDesc.textContent = strings.floatingDesc;
  if (sidebarTitle) sidebarTitle.textContent = strings.sidebar;
  if (sidebarDesc) sidebarDesc.textContent = strings.sidebarDesc;
  if (cardsTitle) cardsTitle.textContent = strings.cards;
  if (cardsDesc) cardsDesc.textContent = strings.cardsDesc;
  if (zenTitle) zenTitle.textContent = strings.zenMode;
  if (zenDesc) zenDesc.textContent = strings.zenDesc;
  if (distractionTitle) distractionTitle.textContent = strings.distractionFree;
  if (distractionDesc) distractionDesc.textContent = strings.distractionDesc;
  if (splitTitle) splitTitle.textContent = strings.splitScreen;
  if (splitDesc) splitDesc.textContent = strings.splitDesc;
  if (presentationTitle) presentationTitle.textContent = strings.presentation;
  if (presentationDesc) presentationDesc.textContent = strings.presentationDesc;
  if (compactTitle) compactTitle.textContent = strings.compact;
  if (compactDesc) compactDesc.textContent = strings.compactDesc;
  
  // Theming section
  const themingTitle = document.querySelector('#theming-title');
  const themingDesc = document.querySelector('#theming-desc');
  const lightTitle = document.querySelector('#light-title');
  const lightDesc = document.querySelector('#light-desc');
  const darkTitle = document.querySelector('#dark-title');
  const darkDesc = document.querySelector('#dark-desc');
  const darkBlueTitle = document.querySelector('#dark-blue-title');
  const darkBlueDesc = document.querySelector('#dark-blue-desc');
  const sepiaTitle = document.querySelector('#sepia-title');
  const sepiaDesc = document.querySelector('#sepia-desc');
  const highContrastTitle = document.querySelector('#high-contrast-title');
  const highContrastDesc = document.querySelector('#high-contrast-desc');
  const customTitle = document.querySelector('#custom-title');
  const customDesc = document.querySelector('#custom-desc');
  
  if (themingTitle) themingTitle.textContent = strings.advancedTheming;
  if (themingDesc) themingDesc.textContent = strings.chooseTheme;
  if (lightTitle) lightTitle.textContent = strings.light;
  if (lightDesc) lightDesc.textContent = strings.lightDesc;
  if (darkTitle) darkTitle.textContent = strings.dark;
  if (darkDesc) darkDesc.textContent = strings.darkDesc;
  if (darkBlueTitle) darkBlueTitle.textContent = strings.darkBlue;
  if (darkBlueDesc) darkBlueDesc.textContent = strings.darkBlueDesc;
  if (sepiaTitle) sepiaTitle.textContent = strings.sepia;
  if (sepiaDesc) sepiaDesc.textContent = strings.sepiaDesc;
  if (highContrastTitle) highContrastTitle.textContent = strings.highContrast;
  if (highContrastDesc) highContrastDesc.textContent = strings.highContrastDesc;
  if (customTitle) customTitle.textContent = strings.custom;
  if (customDesc) customDesc.textContent = strings.customDesc;
  
  // Custom colors section
  const customColorsTitle = document.querySelector('#custom-colors-title');
  const backgroundLabel = document.querySelector('#background-label');
  const secondaryBgLabel = document.querySelector('#secondary-bg-label');
  const textColorLabel = document.querySelector('#text-color-label');
  const accentColorLabel = document.querySelector('#accent-color-label');
  const fontColorLabel = document.querySelector('#font-color-label');
  const textboxBgLabel = document.querySelector('#textbox-bg-label');
  const buttonColorLabel = document.querySelector('#button-color-label');
  const buttonBgLabel = document.querySelector('#button-bg-label');
  const resetBtn = document.querySelector('#reset-theme-btn');
  const saveBtn = document.querySelector('#save-theme-btn');
  
  if (customColorsTitle) customColorsTitle.textContent = strings.customColors;
  if (backgroundLabel) backgroundLabel.textContent = strings.background;
  if (secondaryBgLabel) secondaryBgLabel.textContent = strings.secondaryBg;
  if (textColorLabel) textColorLabel.textContent = strings.textColor;
  if (accentColorLabel) accentColorLabel.textContent = strings.accentColor;
  if (fontColorLabel) fontColorLabel.textContent = strings.fontColor;
  if (textboxBgLabel) textboxBgLabel.textContent = strings.textboxBg;
  if (buttonColorLabel) buttonColorLabel.textContent = strings.buttonColor;
  if (buttonBgLabel) buttonBgLabel.textContent = strings.buttonBg;
  if (resetBtn) resetBtn.textContent = strings.resetDefault;
  if (saveBtn) saveBtn.textContent = strings.saveTheme;
  
  // Gradient section
  const gradientTitle = document.querySelector('#gradient-bg-title');
  const gradientDesc = document.querySelector('#gradient-bg-desc');
  const enableGradientLabel = document.querySelector('#enable-gradient-label');
  
  if (gradientTitle) gradientTitle.textContent = strings.gradientBg;
  if (gradientDesc) gradientDesc.textContent = strings.gradientDesc;
  if (enableGradientLabel) enableGradientLabel.textContent = strings.enableGradient;
  
  // Font settings section
  const fontTitle = document.querySelector('#font-settings-title');
  const fontFamilyLabel = document.querySelector('#font-family-label');
  const systemDefaultOption = document.querySelector('#system-default-option');
  const arabicFontsOptgroup = document.querySelector('#arabic-fonts-optgroup');
  const sansSerifOptgroup = document.querySelector('#sans-serif-optgroup');
  const serifOptgroup = document.querySelector('#serif-optgroup');
  const systemFontsOptgroup = document.querySelector('#system-fonts-optgroup');
  const customFontOption = document.querySelector('#custom-font-option');
  const uploadFontLabel = document.querySelector('#upload-font-label');
  const fontFormatsLabel = document.querySelector('#font-formats-label');
  const fontSizeLabel = document.querySelector('#font-size-label');
  
  if (fontTitle) fontTitle.textContent = strings.fontSettings;
  if (fontFamilyLabel) fontFamilyLabel.textContent = strings.fontFamily;
  if (systemDefaultOption) systemDefaultOption.textContent = strings.systemDefault;
  if (arabicFontsOptgroup) arabicFontsOptgroup.label = strings.arabicFonts;
  if (sansSerifOptgroup) sansSerifOptgroup.label = strings.sansSerif;
  if (serifOptgroup) serifOptgroup.label = strings.serif;
  if (systemFontsOptgroup) systemFontsOptgroup.label = strings.systemFonts;
  if (customFontOption) customFontOption.textContent = strings.customFont;
  if (uploadFontLabel) uploadFontLabel.textContent = strings.uploadFont;
  if (fontFormatsLabel) fontFormatsLabel.textContent = strings.fontFormats;
  if (fontSizeLabel) fontSizeLabel.textContent = strings.fontSize;
  
  // About section
  const aboutTitle = document.querySelector('#about-settings-title');
  const aboutVersion = document.querySelector('#about-settings-version');
  const viewDetailsBtn = document.querySelector('#view-details-text');
  const aboutBtnSettings = document.querySelector('#about-btn-text');
  
  if (aboutTitle) aboutTitle.textContent = strings.aboutSection;
  if (aboutVersion) aboutVersion.textContent = strings.aboutVersion;
  if (viewDetailsBtn) viewDetailsBtn.textContent = strings.viewDetails;
  if (aboutBtnSettings) aboutBtnSettings.textContent = strings.aboutBtn;
}

// Layout Management
let currentLayout = 'zen'; // Default layout

function checkFirstVisit() {
  const hasVisited = localStorage.getItem('arabicWriter_hasVisited');
  if (!hasVisited) {
    // First time visitor - show welcome modal
    setTimeout(() => show('welcome'), 500);
  } else {
    // Returning user - load their layout preference
    const savedLayout = localStorage.getItem('arabicWriter_layout');
    if (savedLayout) {
      currentLayout = savedLayout;
      applyLayout(currentLayout);
    }
  }
}

function selectLayout(layout) {
  // Mark as visited and save layout choice
  localStorage.setItem('arabicWriter_hasVisited', 'true');
  localStorage.setItem('arabicWriter_layout', layout);
  
  currentLayout = layout;
  applyLayout(layout);
  hide('welcome');
}

function changeLayout(layout) {
  localStorage.setItem('arabicWriter_layout', layout);
  currentLayout = layout;
  applyLayout(layout);
  updateLayoutSelector();
}

function applyLayout(layout) {
  const body = document.body;
  
  // Remove all layout classes
  body.classList.remove('layout-floating', 'layout-sidebar', 'layout-cards', 'layout-zen');
  
  // Add new layout class
  body.classList.add(`layout-${layout}`);
  
  // Apply layout-specific changes
  switch (layout) {
    case 'floating':
      applyFloatingLayout();
      break;
    case 'sidebar':
      applySidebarLayout();
      break;
    case 'cards':
      applyCardsLayout();
      break;
    case 'zen':
      applyZenLayout();
      break;
  }
}

function applyFloatingLayout() {
  // Current structure works well for floating
  console.log('Applied floating layout');
}

function applySidebarLayout() {
  // For now, just a visual change - could be enhanced later
  console.log('Applied sidebar layout');
}

function applyCardsLayout() {
  // For now, just a visual change - could be enhanced later  
  console.log('Applied cards layout');
}

function applyZenLayout() {
  // Current zen-like structure
  console.log('Applied zen layout');
}

function updateLayoutSelector() {
  const buttons = document.querySelectorAll('.layout-btn');
  buttons.forEach(btn => {
    btn.classList.remove('active');
    if (btn.dataset.layout === currentLayout) {
      btn.classList.add('active');
    }
  });
}

function updateSettingsValues() {
  // Update theme name in settings
  const themeName = getElement('theme-name');
  const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
  if (themeName) {
    themeName.textContent = currentTheme === 'dark' ? 'Dark' : 'Light';
  }
}

// Font management
let currentFont = 'system';
let currentFontSize = 16;
let customFontName = '';

function initializeFontSettings() {
  // Load saved font preferences
  const savedFont = localStorage.getItem('arabicWriter_font') || 'system';
  const savedFontSize = localStorage.getItem('arabicWriter_fontSize') || '16';
  
  currentFont = savedFont;
  currentFontSize = parseInt(savedFontSize);
  
  // Update UI
  const fontSelector = getElement('font-selector');
  const fontSizeSlider = getElement('font-size-slider');
  const fontSizeValue = getElement('font-size-value');
  
  if (fontSelector) {
    fontSelector.value = savedFont;
    updateCustomFontSection();
  }
  
  if (fontSizeSlider) {
    fontSizeSlider.value = currentFontSize;
  }
  
  if (fontSizeValue) {
    fontSizeValue.textContent = currentFontSize + 'px';
  }
  
  // Apply font to textareas
  applyFontToTextareas();
}

function changeFontFamily() {
  const fontSelector = getElement('font-selector');
  if (fontSelector) {
    currentFont = fontSelector.value;
    localStorage.setItem('arabicWriter_font', currentFont);
    
    updateCustomFontSection();
    applyFontToTextareas();
  }
}

function updateCustomFontSection() {
  const customSection = getElement('custom-font-section');
  if (customSection) {
    customSection.style.display = currentFont === 'custom' ? 'flex' : 'none';
  }
}

function uploadCustomFont() {
  const fileInput = getElement('font-upload');
  if (fileInput && fileInput.files.length > 0) {
    const file = fileInput.files[0];
    const reader = new FileReader();
    
    reader.onload = function(e) {
      const fontData = e.target.result;
      const fontName = 'CustomFont_' + Date.now();
      
      // Create font face
      const fontFace = new FontFace(fontName, fontData);
      
      fontFace.load().then(function(loadedFace) {
        document.fonts.add(loadedFace);
        customFontName = fontName;
        
        // Save to localStorage (base64 encoded)
        localStorage.setItem('arabicWriter_customFont', fontData);
        localStorage.setItem('arabicWriter_customFontName', fontName);
        
        // Apply the font
        applyFontToTextareas();
        
        // Show success message
        alert('Custom font uploaded successfully!');
      }).catch(function(error) {
        console.error('Error loading font:', error);
        alert('Error loading font. Please try a different font file.');
      });
    };
    
    reader.readAsDataURL(file);
  }
}

function changeFontSize() {
  const fontSizeSlider = getElement('font-size-slider');
  const fontSizeValue = getElement('font-size-value');
  
  if (fontSizeSlider) {
    currentFontSize = parseInt(fontSizeSlider.value);
    localStorage.setItem('arabicWriter_fontSize', currentFontSize.toString());
    
    if (fontSizeValue) {
      fontSizeValue.textContent = currentFontSize + 'px';
    }
    
    applyFontToTextareas();
  }
}

function applyFontToTextareas() {
  const inputBox = getElement('inpbox');
  const outputBox = getElement('outbox');
  
  let fontFamily = '';
  
  switch (currentFont) {
    case 'system':
      fontFamily = 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      break;
    // Arabic Google Fonts
    case 'amiri':
      fontFamily = '"Amiri", serif';
      break;
    case 'cairo':
      fontFamily = '"Cairo", sans-serif';
      break;
    case 'noto-sans-arabic':
      fontFamily = '"Noto Sans Arabic", sans-serif';
      break;
    case 'tajawal':
      fontFamily = '"Tajawal", sans-serif';
      break;
    case 'almarai':
      fontFamily = '"Almarai", sans-serif';
      break;
    // Popular Sans-Serif Google Fonts
    case 'inter':
      fontFamily = '"Inter", sans-serif';
      break;
    case 'roboto':
      fontFamily = '"Roboto", sans-serif';
      break;
    case 'open-sans':
      fontFamily = '"Open Sans", sans-serif';
      break;
    case 'lato':
      fontFamily = '"Lato", sans-serif';
      break;
    case 'montserrat':
      fontFamily = '"Montserrat", sans-serif';
      break;
    case 'nunito':
      fontFamily = '"Nunito", sans-serif';
      break;
    case 'poppins':
      fontFamily = '"Poppins", sans-serif';
      break;
    case 'source-sans-pro':
      fontFamily = '"Source Sans Pro", sans-serif';
      break;
    case 'ubuntu':
      fontFamily = '"Ubuntu", sans-serif';
      break;
    case 'fira-sans':
      fontFamily = '"Fira Sans", sans-serif';
      break;
    case 'raleway':
      fontFamily = '"Raleway", sans-serif';
      break;
    case 'oswald':
      fontFamily = '"Oswald", sans-serif';
      break;
    case 'rubik':
      fontFamily = '"Rubik", sans-serif';
      break;
    // Popular Serif Google Fonts
    case 'playfair-display':
      fontFamily = '"Playfair Display", serif';
      break;
    case 'merriweather':
      fontFamily = '"Merriweather", serif';
      break;
    case 'libre-baskerville':
      fontFamily = '"Libre Baskerville", serif';
      break;
    case 'crimson-text':
      fontFamily = '"Crimson Text", serif';
      break;
    // System fonts
    case 'arial':
      fontFamily = 'Arial, sans-serif';
      break;
    case 'helvetica':
      fontFamily = 'Helvetica, Arial, sans-serif';
      break;
    case 'times':
      fontFamily = '"Times New Roman", Times, serif';
      break;
    case 'georgia':
      fontFamily = 'Georgia, serif';
      break;
    case 'courier':
      fontFamily = '"Courier New", Courier, monospace';
      break;
    case 'verdana':
      fontFamily = 'Verdana, Geneva, sans-serif';
      break;
    case 'tahoma':
      fontFamily = 'Tahoma, Geneva, sans-serif';
      break;
    case 'trebuchet':
      fontFamily = '"Trebuchet MS", Helvetica, sans-serif';
      break;
    case 'palatino':
      fontFamily = '"Palatino Linotype", "Book Antiqua", Palatino, serif';
      break;
    case 'custom':
      if (customFontName) {
        fontFamily = customFontName + ', system-ui, sans-serif';
      } else {
        fontFamily = 'system-ui, sans-serif';
      }
      break;
    default:
      fontFamily = 'system-ui, sans-serif';
  }
  
  if (inputBox) {
    inputBox.style.fontFamily = fontFamily;
    inputBox.style.fontSize = currentFontSize + 'px';
  }
  
  if (outputBox) {
    outputBox.style.fontFamily = fontFamily;
    outputBox.style.fontSize = currentFontSize + 'px';
  }
}

function loadCustomFontFromStorage() {
  const savedFontData = localStorage.getItem('arabicWriter_customFont');
  const savedFontName = localStorage.getItem('arabicWriter_customFontName');
  
  if (savedFontData && savedFontName) {
    const fontFace = new FontFace(savedFontName, savedFontData);
    
    fontFace.load().then(function(loadedFace) {
      document.fonts.add(loadedFace);
      customFontName = savedFontName;
      
      // If current font is custom, apply it
      if (currentFont === 'custom') {
        applyFontToTextareas();
      }
    }).catch(function(error) {
      console.error('Error loading saved custom font:', error);
    });
  }
}

// Enhanced Features Initialization
function initializeEnhancedFeatures() {
  // Load saved theme
  const savedTheme = localStorage.getItem('arabicWriter_advancedTheme') || 'light';
  setAdvancedTheme(savedTheme);
  
  // Load gradient settings
  const gradientEnabled = localStorage.getItem('arabicWriter_gradientEnabled') === 'true';
  const gradientType = localStorage.getItem('arabicWriter_gradientType') || 'primary';
  
  if (gradientEnabled) {
    document.getElementById('gradient-enabled').checked = true;
    document.getElementById('gradient-selector').style.display = 'grid';
    setGradientBackground(gradientType);
  }
  
  // Load custom theme colors
  loadCustomThemeColors();
  
  // Update theme selector
  updateThemeSelector();
  
  // Update layout selector
  updateEnhancedLayoutSelector();
}

// Advanced Theme Management - Enhanced
function setAdvancedTheme(theme) {
  // Store previous theme for comparison
  const previousTheme = document.documentElement.getAttribute('data-theme');
  
  // Set new theme
  document.documentElement.setAttribute('data-theme', theme);
  
  // Show/hide custom theme section
  const customSection = document.getElementById('custom-theme-section');
  if (customSection) {
    customSection.style.display = theme === 'custom' ? 'block' : 'none';
  }
  
  // Apply custom theme if selected
  if (theme === 'custom') {
    applyCustomTheme();
  } else {
    // Reset any custom theme overrides when switching to preset themes
    resetCustomThemeOverrides();
  }
  
  // Save to localStorage
  localStorage.setItem('arabicWriter_advancedTheme', theme);
  
  // Update theme selector
  updateThemeSelector();
}

function resetCustomThemeOverrides() {
  // Remove custom theme style overrides when switching to preset themes
  const customProperties = [
    'bg-primary', 'bg-secondary', 'text-primary', 'accent-primary'
  ];
  
  customProperties.forEach(property => {
    document.documentElement.style.removeProperty(`--${property}`);
  });
}

function updateThemeSelector() {
  const currentTheme = localStorage.getItem('arabicWriter_advancedTheme') || 'light';
  const themeOptions = document.querySelectorAll('.theme-option');
  
  themeOptions.forEach(option => {
    option.classList.remove('active');
    if (option.dataset.theme === currentTheme) {
      option.classList.add('active');
    }
  });
}

// Custom Theme Management
function updateCustomTheme(property, value) {
  document.documentElement.style.setProperty(`--custom-${property}`, value);
  
  // Save to localStorage
  const customTheme = JSON.parse(localStorage.getItem('arabicWriter_customTheme') || '{}');
  customTheme[property] = value;
  localStorage.setItem('arabicWriter_customTheme', JSON.stringify(customTheme));
  
  // If custom theme is active, apply changes immediately
  if (localStorage.getItem('arabicWriter_advancedTheme') === 'custom') {
    applyCustomTheme();
  }
}

function applyCustomTheme() {
  const customTheme = JSON.parse(localStorage.getItem('arabicWriter_customTheme') || '{}');
  
  Object.keys(customTheme).forEach(property => {
    if (property === 'font-color') {
      // Apply font color to text elements
      document.documentElement.style.setProperty(`--text-primary`, customTheme[property]);
    } else if (property === 'textbox-bg') {
      // Apply textbox background color
      document.documentElement.style.setProperty(`--bg-primary`, customTheme[property]);
    } else {
      // Apply other custom properties
      document.documentElement.style.setProperty(`--${property}`, customTheme[property]);
    }
  });
}

function loadCustomThemeColors() {
  const customTheme = JSON.parse(localStorage.getItem('arabicWriter_customTheme') || '{}');
  
  // Set default values and load saved values
  const colorInputs = {
    'custom-bg-color': { property: 'bg-primary', default: '#ffffff' },
    'custom-bg-secondary': { property: 'bg-secondary', default: '#f8f9fa' },
    'custom-text-color': { property: 'text-primary', default: '#1f2937' },
    'custom-accent-color': { property: 'accent-primary', default: '#3b82f6' },
    'custom-font-color': { property: 'font-color', default: '#1f2937' },
    'custom-textbox-bg': { property: 'textbox-bg', default: '#ffffff' },
    'custom-button-color': { property: 'button-color', default: '#3b82f6' },
    'custom-button-bg': { property: 'button-bg', default: '#ffffff' }
  };
  
  Object.keys(colorInputs).forEach(inputId => {
    const input = document.getElementById(inputId);
    const config = colorInputs[inputId];
    
    if (input) {
      const savedValue = customTheme[config.property] || config.default;
      input.value = savedValue;
      document.documentElement.style.setProperty(`--custom-${config.property}`, savedValue);
    }
  });
}

function resetCustomTheme() {
  const defaults = {
    'bg-primary': '#ffffff',
    'bg-secondary': '#f8f9fa',
    'text-primary': '#1f2937',
    'accent-primary': '#3b82f6',
    'font-color': '#1f2937',
    'textbox-bg': '#ffffff',
    'button-color': '#3b82f6',
    'button-bg': '#ffffff'
  };
  
  // Reset CSS custom properties
  Object.keys(defaults).forEach(property => {
    document.documentElement.style.setProperty(`--custom-${property}`, defaults[property]);
  });
  
  // Reset input values
  const inputMap = {
    'bg-primary': 'custom-bg-color',
    'bg-secondary': 'custom-bg-secondary',
    'text-primary': 'custom-text-color',
    'accent-primary': 'custom-accent-color',
    'font-color': 'custom-font-color',
    'textbox-bg': 'custom-textbox-bg',
    'button-color': 'custom-button-color',
    'button-bg': 'custom-button-bg'
  };
  
  Object.keys(inputMap).forEach(property => {
    const input = document.getElementById(inputMap[property]);
    if (input) {
      input.value = defaults[property];
    }
  });
  
  // Clear localStorage
  localStorage.removeItem('arabicWriter_customTheme');
  
  // Apply changes if custom theme is active
  if (localStorage.getItem('arabicWriter_advancedTheme') === 'custom') {
    applyCustomTheme();
  }
}

function saveCustomTheme() {
  const customTheme = {
    'bg-primary': document.getElementById('custom-bg-color').value,
    'bg-secondary': document.getElementById('custom-bg-secondary').value,
    'text-primary': document.getElementById('custom-text-color').value,
    'accent-primary': document.getElementById('custom-accent-color').value,
    'font-color': document.getElementById('custom-font-color').value,
    'textbox-bg': document.getElementById('custom-textbox-bg').value,
    'button-color': document.getElementById('custom-button-color').value,
    'button-bg': document.getElementById('custom-button-bg').value
  };
  
  localStorage.setItem('arabicWriter_customTheme', JSON.stringify(customTheme));
  
  // Apply the custom theme immediately
  applyCustomTheme();
  
  // Show success message
  const saveBtn = document.querySelector('[onclick="saveCustomTheme()"]');
  if (saveBtn) {
    const originalText = saveBtn.textContent;
    saveBtn.textContent = 'Saved!';
    saveBtn.style.background = 'var(--success)';
    
    setTimeout(() => {
      saveBtn.textContent = originalText;
      saveBtn.style.background = '';
    }, 2000);
  }
}

// Gradient Background Management
function toggleGradientBackground() {
  const enabled = document.getElementById('gradient-enabled').checked;
  const selector = document.getElementById('gradient-selector');
  
  if (enabled) {
    selector.style.display = 'grid';
    setGradientBackground('primary');
  } else {
    selector.style.display = 'none';
    document.body.classList.remove('gradient-enabled');
    document.documentElement.style.setProperty('--background-gradient', 'none');
  }
  
  localStorage.setItem('arabicWriter_gradientEnabled', enabled);
}

function setGradientBackground(type) {
  const gradient = `var(--gradient-${type})`;
  document.documentElement.style.setProperty('--background-gradient', gradient);
  document.body.classList.add('gradient-enabled');
  
  // Update active gradient option
  const gradientOptions = document.querySelectorAll('.gradient-option');
  gradientOptions.forEach(option => {
    option.classList.remove('active');
    if (option.dataset.gradient === type) {
      option.classList.add('active');
    }
  });
  
  localStorage.setItem('arabicWriter_gradientType', type);
  localStorage.setItem('arabicWriter_gradientEnabled', 'true');
}

// Enhanced Layout Management
function updateEnhancedLayoutSelector() {
  const currentLayout = localStorage.getItem('arabicWriter_layout') || 'floating';
  const layoutOptions = document.querySelectorAll('.enhanced-layout-option');
  
  layoutOptions.forEach(option => {
    option.classList.remove('active');
    if (option.dataset.layout === currentLayout) {
      option.classList.add('active');
    }
  });
}

function changeLayout(layout) {
  // Save previous layout for distraction-free mode
  if (layout === 'distraction-free' && currentLayout !== 'distraction-free') {
    localStorage.setItem('arabicWriter_previousLayout', currentLayout);
  }
  
  // Remove all layout classes
  document.body.classList.remove(
    'layout-floating', 'layout-sidebar', 'layout-cards', 'layout-zen',
    'layout-distraction-free', 'layout-split-screen', 'layout-presentation', 'layout-compact'
  );
  
  // Add new layout class
  document.body.classList.add(`layout-${layout}`);
  
  // Handle special layout features
  switch(layout) {
    case 'distraction-free':
      // Add escape instruction
      if (!document.getElementById('escape-instruction')) {
        const instruction = document.createElement('div');
        instruction.id = 'escape-instruction';
        instruction.innerHTML = '<p style="position: fixed; top: 10px; right: 10px; background: rgba(0,0,0,0.8); color: white; padding: 8px 12px; border-radius: 20px; font-size: 0.8rem; z-index: 1000;">Press ESC to exit distraction-free mode</p>';
        document.body.appendChild(instruction);
      }
      break;
    case 'presentation':
      // Auto-focus on input
      setTimeout(() => {
        const inputBox = document.getElementById('inpbox');
        if (inputBox) inputBox.focus();
      }, 100);
      break;
    default:
      // Remove escape instruction
      const instruction = document.getElementById('escape-instruction');
      if (instruction) instruction.remove();
      break;
  }
  
  localStorage.setItem('arabicWriter_layout', layout);
  currentLayout = layout;
  updateEnhancedLayoutSelector();
}

// Override existing layout functions
function applyLayout(layout) {
  changeLayout(layout);
}

function selectLayout(layout) {
  // Mark as visited and save layout choice
  localStorage.setItem('arabicWriter_hasVisited', 'true');
  localStorage.setItem('arabicWriter_layout', layout);
  
  currentLayout = layout;
  changeLayout(layout);
  hide('welcome');
}

// Enhanced updateSettingsValues function
function updateSettingsValues() {
  // Update theme selector
  updateThemeSelector();
  
  // Update layout selector
  updateEnhancedLayoutSelector();
  
  // Update gradient settings
  const gradientEnabled = localStorage.getItem('arabicWriter_gradientEnabled') === 'true';
  const gradientCheckbox = document.getElementById('gradient-enabled');
  const gradientSelector = document.getElementById('gradient-selector');
  
  if (gradientCheckbox) {
    gradientCheckbox.checked = gradientEnabled;
  }
  
  if (gradientSelector) {
    gradientSelector.style.display = gradientEnabled ? 'grid' : 'none';
  }
  
  // Update gradient selector active state
  const gradientType = localStorage.getItem('arabicWriter_gradientType') || 'primary';
  const gradientOptions = document.querySelectorAll('.gradient-option');
  gradientOptions.forEach(option => {
    option.classList.remove('active');
    if (option.dataset.gradient === gradientType) {
      option.classList.add('active');
    }
  });
  
  // Update custom theme section visibility
  const currentTheme = localStorage.getItem('arabicWriter_advancedTheme') || 'light';
  const customSection = document.getElementById('custom-theme-section');
  if (customSection) {
    customSection.style.display = currentTheme === 'custom' ? 'block' : 'none';
  }
}

// Enhanced updateLayoutSelector function
function updateLayoutSelector() {
  updateEnhancedLayoutSelector();
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  initializeApp();
  
  // Check if user has visited before
  const hasVisited = localStorage.getItem('arabicWriter_hasVisited');
  if (!hasVisited) {
    show('welcome');
  } else {
    // Load saved layout
    const savedLayout = localStorage.getItem('arabicWriter_layout') || 'floating';
    changeLayout(savedLayout);
  }
});

// Helper functions for buttons
function copyOutput() {
  const outputBox = document.getElementById('outbox');
  if (outputBox) {
    outputBox.select();
    document.execCommand('copy');
    
    // Show feedback
    const copyBtn = document.getElementById('copy-btn');
    if (copyBtn) {
      const originalText = copyBtn.querySelector('.btn-text').textContent;
      copyBtn.querySelector('.btn-text').textContent = 'Copied!';
      copyBtn.style.background = 'var(--success)';
      
      setTimeout(() => {
        copyBtn.querySelector('.btn-text').textContent = originalText;
        copyBtn.style.background = '';
      }, 2000);
    }
  }
}

function clearFields() {
  document.getElementById('inpbox').value = '';
  document.getElementById('outbox').value = '';
}

function selectit() {
  const outputBox = document.getElementById('outbox');
  if (outputBox) {
    outputBox.select();
  }
}

// Initialize the application
function initializeApp() {
  // Initialize enhanced features
  initializeEnhancedFeatures();
  
  // Initialize font settings
  initializeFontSettings();
  
  // Load custom font from storage if exists
  loadCustomFontFromStorage();
  
  // Set default language
  setLang(config.defaultLang);
  
  // Update button labels
  updateButtonLabels();
  
  // Update about content with current language
  updateAboutContent(languageStrings[config.defaultLang]);
  
  // Update settings modal content with current language
  updateSettingsModal(languageStrings[config.defaultLang]);
  
  // Add event listeners for modal clicking outside to close
  document.addEventListener('click', function(event) {
    if (event.target.classList.contains('modal')) {
      event.target.style.display = 'none';
    }
  });
  
  // Add keyboard shortcuts
  document.addEventListener('keydown', function(event) {
    if (event.ctrlKey || event.metaKey) {
      switch(event.key) {
        case 'Enter':
          event.preventDefault();
          ProcessInput();
          break;
        case 'k':
          event.preventDefault();
          show('inline-keyboard');
          break;
        case 'l':
          event.preventDefault();
          toggleLanguage();
          break;
        case 'f':
          event.preventDefault();
          changeLayout('distraction-free');
          break;
        case 'p':
          event.preventDefault();
          changeLayout('presentation');
          break;
      }
    }
    
    if (event.key === 'Escape') {
      // Close any open modals
      hide('lang');
      hide('numbers');
      hide('keyboard');
      hide('about');
      hide('inline-keyboard');
      hide('welcome');
      hide('settings');
      
      // Exit distraction-free mode
      if (currentLayout === 'distraction-free') {
        changeLayout(localStorage.getItem('arabicWriter_previousLayout') || 'floating');
      }
    }
  });
}

 
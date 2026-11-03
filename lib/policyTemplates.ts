export interface PolicyDefinition {
  type: string;
  title: string;
  badge: string;
  badgeColor: string;
  category: string;
  description: string;
  storeNotice: string;
  defaultContent: string;
}

export const POLICY_DEFINITIONS: PolicyDefinition[] = [
  {
    type: "privacy-policy",
    title: "Privacy Policy",
    badge: "Mandatory",
    badgeColor: "bg-red-50 text-red-700 border-red-200",
    category: "Google Play & Apple App Store Mandatory",
    description: "Discloses personal data collection, location permissions for prayer times, third-party SDKs, and data protection.",
    storeNotice: "Required by both Google Play Developer Console & Apple App Store Connect during store listing review.",
    defaultContent: `<h1>Privacy Policy</h1>
<p><strong>Effective Date:</strong> November 2026</p>
<p><strong>Application:</strong> Quran International (Web, iOS, and Android)</p>

<p>Welcome to <strong>Quran International</strong> ("we", "our", or "us"). We are committed to protecting your privacy and ensuring your personal information is handled in a safe and responsible manner. This Privacy Policy describes how we collect, use, and protect your information when you use our mobile applications and related services.</p>

<h2>1. Information We Collect</h2>
<h3>a. Account Information</h3>
<p>When you register or sign in using Google, Apple ID, or email, we collect your name, email address, profile image, and an authentication identifier. This allows us to sync your bookmarks, reading progress, and premium features across devices.</p>

<h3>b. Location Data (Prayer Times &amp; Qibla Direction)</h3>
<p>With your explicit permission, our application accesses your device's geographical location (latitude and longitude) strictly to calculate accurate local Islamic prayer times (Salah) and determine the direction of the Kaaba (Qibla). <strong>We do not track your location in the background when not needed, and we never sell, share, or monetize your location data.</strong></p>

<h3>c. App Activity &amp; Offline Content</h3>
<p>We store your reading history, surah bookmarks, notes, audio recitation preferences, and offline downloaded language packs locally on your device or linked to your cloud profile for seamless synchronization.</p>

<h3>d. Device &amp; Notification Information</h3>
<p>We collect device type, operating system version, and a push notification token (via Firebase Cloud Messaging or Apple Push Notification Service) to send you optional prayer reminders, daily Quran verses, and important service updates.</p>

<h2>2. How We Use Your Information</h2>
<ul>
  <li>To provide, maintain, and personalize the Quran International experience.</li>
  <li>To calculate precise prayer schedules and Qibla bearings tailored to your location.</li>
  <li>To synchronize bookmarks, Hasanat points, and audio downloads across your devices.</li>
  <li>To process in-app purchases and verify premium subscriptions securely.</li>
  <li>To respond to your support inquiries and feedback.</li>
</ul>

<h2>3. Third-Party Services &amp; SDKs</h2>
<p>We integrate trusted third-party service providers that process data under strict confidentiality agreements:</p>
<ul>
  <li><strong>Google Play Services &amp; Apple StoreKit:</strong> In-app purchase processing and subscription verification.</li>
  <li><strong>Firebase Cloud Messaging (Google):</strong> Reliable push notifications for daily reminders.</li>
  <li><strong>Amazon Web Services (AWS S3):</strong> Fast, secure content delivery for offline audio and Quran translation packs.</li>
</ul>

<h2>4. Data Retention &amp; Security</h2>
<p>We implement industry-standard encryption (TLS/SSL in transit and secure database hashing) to protect your personal data. We retain your profile information only as long as your account remains active.</p>

<h2>5. Account &amp; Data Deletion Rights</h2>
<p>In full compliance with Google Play Store and Apple App Store policies, you have the right to request deletion of your account and all associated personal data at any time. You can delete your account directly inside the app under <em>Settings &gt; Profile &gt; Delete Account</em> or by visiting our public Data Deletion page at <a href="/policies/data-deletion">/policies/data-deletion</a>.</p>

<h2>6. Children's Privacy</h2>
<p>Quran International is family-friendly and suitable for all ages. We do not knowingly collect personal identifiable information from children under the age of 13 without parental consent.</p>

<h2>7. Contact Us</h2>
<p>If you have any questions or suggestions regarding this Privacy Policy, please contact our privacy compliance team at:</p>
<p><strong>Email:</strong> support@quraninternational.com<br/>
<strong>Website:</strong> https://quraninternational.com</p>`,
  },
  {
    type: "terms-and-conditions",
    title: "Terms and Conditions",
    badge: "Required for Subscriptions",
    badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
    category: "App Store Mandatory (Guideline 3.1.2)",
    description: "Defines terms of service, auto-renewing subscriptions, intellectual property rights, and user conduct.",
    storeNotice: "Mandatory on Apple App Store for any app offering recurring auto-renewing subscription tiers.",
    defaultContent: `<h1>Terms and Conditions</h1>
<p><strong>Last Updated:</strong> November 2026</p>
<p><strong>Application:</strong> Quran International</p>

<p>Please read these Terms and Conditions ("Terms") carefully before using the Quran International mobile application and platform. By accessing or using our application, you agree to be bound by these Terms.</p>

<h2>1. Sacred Text &amp; Translation Attribution</h2>
<p>The Holy Quran in its original Arabic text is sacred and divine. Quran International takes every technical and scholarly measure to preserve the Uthmani script with complete accuracy. Translations, transliterations, and tafsir interpretations represent the scholarly efforts of their respective translators and are provided for educational and spiritual enrichment.</p>

<h2>2. User Accounts &amp; Responsibilities</h2>
<p>When you create an account with us, you must provide accurate and complete information. You are responsible for safeguarding your login credentials and for all activities that occur under your account.</p>

<h2>3. Subscriptions &amp; In-App Purchases</h2>
<ul>
  <li><strong>Auto-Renewable Subscriptions:</strong> Quran International offers optional Premium subscriptions providing ad-free reading, unlimited offline audio downloads, and advanced Sheikh lectures.</li>
  <li><strong>Billing:</strong> Payment is charged to your Apple App Store or Google Play account upon confirmation of purchase.</li>
  <li><strong>Renewal:</strong> Subscriptions automatically renew unless auto-renew is cancelled at least 24 hours before the end of the current billing cycle.</li>
  <li><strong>Cancellation:</strong> You can manage or cancel your subscription anytime in your Apple ID Account Settings or Google Play Subscription Manager.</li>
</ul>

<h2>4. Prohibited Uses</h2>
<p>You agree not to reverse engineer, decompile, scrape, or extract bulk data from our APIs or offline packages without explicit written authorization.</p>

<h2>5. Disclaimer of Astronomical Calculations</h2>
<p>Prayer times and Qibla directions are calculated using established astronomical formulas and Islamic calculation conventions (such as Muslim World League, ISNA, and Umm al-Qura). Because atmospheric and elevation conditions vary, users should confirm prayer times with local mosques when necessary.</p>

<h2>6. Changes to Terms</h2>
<p>We reserve the right to modify these Terms at any time. Continued use of the application after modifications signifies acceptance of the updated Terms.</p>

<h2>7. Contact Support</h2>
<p>For questions regarding these Terms, contact us at <strong>support@quraninternational.com</strong>.</p>`,
  },
  {
    type: "data-deletion",
    title: "Account & Data Deletion",
    badge: "Play Store Mandatory URL",
    badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
    category: "Google Play Store Data Safety Policy",
    description: "Provides public instructions and web deletion request mechanism for users without needing to reinstall the app.",
    storeNotice: "Google Play requires a dedicated, publicly accessible URL where users can request account and data deletion.",
    defaultContent: `<h1>Account and Data Deletion Policy</h1>
<p><strong>Effective Date:</strong> November 2026</p>
<p><strong>Application:</strong> Quran International (Google Play &amp; Apple App Store Compliance)</p>

<p>Quran International respects your right to control your personal data. In accordance with Google Play Store Data Safety requirements and Apple App Store Guideline 5.1.1, this page explains how you can easily request the complete deletion of your account and all associated personal data.</p>

<h2>1. What Data Will Be Deleted</h2>
<p>When your account is deleted, the following data is permanently purged from our active databases:</p>
<ul>
  <li>Your user profile (Name, email address, profile photo, and authentication credentials).</li>
  <li>Your saved bookmarks, highlights, reading progress, and personal notes.</li>
  <li>Your daily Hasanat calculation logs and reading history.</li>
  <li>Your device push notification tokens and preferences.</li>
</ul>

<h2>2. How to Delete Your Account (In-App)</h2>
<p>The fastest way to delete your account is directly within the Quran International mobile application:</p>
<ol>
  <li>Open the <strong>Quran International</strong> app on your device.</li>
  <li>Tap on <strong>Settings</strong> (or Profile) in the bottom navigation.</li>
  <li>Scroll down to <strong>Account &amp; Security</strong>.</li>
  <li>Tap on <strong>Delete Account</strong>.</li>
  <li>Confirm the prompt. Your account and personal data will be deleted immediately.</li>
</ol>

<h2>3. How to Request Deletion via Web / Email (Without App Installed)</h2>
<p>If you have uninstalled the app or cannot access your device, you can submit an account deletion request through either method below:</p>
<ul>
  <li><strong>Email Request:</strong> Send an email from the address registered with your Quran International account to <strong>support@quraninternational.com</strong> with the subject line <em>"Account Deletion Request"</em>.</li>
  <li><strong>Processing Time:</strong> Web and email deletion requests are processed within <strong>48 to 72 hours</strong>. You will receive a confirmation email once your data has been completely erased.</li>
</ul>

<h2>4. Data Retention Exceptions</h2>
<p>We do not retain personal data following deletion. Historical transaction receipts for in-app purchases processed through Apple or Google are archived solely in anonymized format where required by applicable tax and accounting laws.</p>

<h2>5. Contact Our Data Protection Officer</h2>
<p>If you have questions about your personal data or need assistance with deletion, please contact:<br/>
<strong>Email:</strong> support@quraninternational.com</p>`,
  },
  {
    type: "disclaimer",
    title: "Content & Religious Disclaimer",
    badge: "Religious Notice",
    badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    category: "Islamic Content & Calculations Notice",
    description: "Clarifies Quranic translations, prayer time calculation algorithms, and copyright for scholarly recitations.",
    storeNotice: "Protects developers from liability regarding Islamic interpretations and geographic calculation differences.",
    defaultContent: `<h1>Content &amp; Religious Disclaimer</h1>
<p><strong>Effective Date:</strong> November 2026</p>
<p><strong>Application:</strong> Quran International</p>

<h2>1. Quranic Text Integrity</h2>
<p>The Arabic text of the Holy Quran presented in this application is based on authenticated Uthmani script standards. Every effort has been made to verify the text, diacritics (tashkeel), and verse numbering against certified Islamic publishing authorities.</p>

<h2>2. Translations &amp; Tafsir Commentary</h2>
<p>Translations in various languages (English, Bengali, Urdu, French, German, Indonesian, and others) are human interpretations of the Quranic meanings. No translation can duplicate the miraculous eloquence of the divine Arabic text. Tafsir commentaries reflect the scholarly analysis of their respective authors and classical scholars.</p>

<h2>3. Prayer Times &amp; Qibla Direction</h2>
<p>Prayer times and Qibla angles are calculated using widely recognized astronomical formulas and Islamic conventions (such as Muslim World League, University of Islamic Sciences Karachi, Egyptian General Authority, and ISNA). Variations may occur due to local geographic topography, horizon conditions, and magnetic declination. Users are advised to confirm critical prayer times with their local community masjids.</p>

<h2>4. Audio Recitations</h2>
<p>Recitation audio provided in Quran International is curated with great respect for world-renowned Qaris. Audio recordings are streamed and cached for personal, non-commercial spiritual listening.</p>

<h2>5. Not a Substitute for Scholarly Consultation</h2>
<p>The informational content in this app is intended for educational and spiritual purposes and should not be treated as binding legal rulings (fatwa) for specific personal circumstances. Please consult qualified Islamic scholars for personal jurisprudence questions.</p>`,
  },
  {
    type: "refund-policy",
    title: "Subscription & Refund Policy",
    badge: "Billing Policy",
    badgeColor: "bg-purple-50 text-purple-700 border-purple-200",
    category: "Store Billing & Subscription Management",
    description: "Outlines subscription renewal, trial terms, and Apple / Google Play Store refund guidelines.",
    storeNotice: "Assists users and store review teams with clear cancellation and refund instructions.",
    defaultContent: `<h1>Subscription &amp; Refund Policy</h1>
<p><strong>Effective Date:</strong> November 2026</p>
<p><strong>Application:</strong> Quran International</p>

<p>Thank you for choosing Quran International Premium. We strive to provide the best Islamic learning and Quran recitation experience. Please review our subscription and refund terms below.</p>

<h2>1. Subscription Terms</h2>
<p>Quran International offers monthly, annual, and lifetime premium subscriptions. When you purchase an auto-renewing subscription:</p>
<ul>
  <li>Your subscription will automatically renew at the specified interval unless cancelled at least 24 hours prior to the renewal date.</li>
  <li>Payment is securely processed by the platform through which you subscribed (Apple App Store or Google Play Store).</li>
</ul>

<h2>2. Free Trials</h2>
<p>If a free trial period is offered, you will not be charged if you cancel before the trial period expires. Any unused portion of a free trial will be forfeited upon subscription purchase.</p>

<h2>3. Managing &amp; Cancelling Subscriptions</h2>
<p>You can cancel your subscription at any time using your platform account settings:</p>
<ul>
  <li><strong>iOS (Apple App Store):</strong> Open device Settings &gt; tap your Apple ID &gt; Subscriptions &gt; select Quran International &gt; Cancel Subscription.</li>
  <li><strong>Android (Google Play):</strong> Open Google Play Store &gt; tap your profile icon &gt; Payments &amp; Subscriptions &gt; Subscriptions &gt; select Quran International &gt; Cancel.</li>
</ul>

<h2>4. Refund Requests</h2>
<p>Because in-app purchases are billed directly through Apple or Google, Quran International cannot issue direct financial refunds. Refunds are governed by store policies:</p>
<ul>
  <li><strong>Apple App Store:</strong> Visit <a href="https://reportaproblem.apple.com" target="_blank" rel="noopener noreferrer">reportaproblem.apple.com</a> to request a refund from Apple.</li>
  <li><strong>Google Play Store:</strong> Request a refund through Google Play account order history within 48 hours of purchase.</li>
</ul>
<p>For any technical issues or billing inquiries, our support team is happy to help at <strong>support@quraninternational.com</strong>.</p>`,
  },
  {
    type: "contact",
    title: "Support & Contact Us",
    badge: "Support URL",
    badgeColor: "bg-teal-50 text-teal-700 border-teal-200",
    category: "Store Support Listing Information",
    description: "Official contact information, email, and support channels for Quran International users.",
    storeNotice: "Mandatory support URL for both Google Play and Apple App Store store presence.",
    defaultContent: `<h1>Support &amp; Contact Us</h1>
<p><strong>Application:</strong> Quran International</p>
<p>We are dedicated to supporting our global community of users. If you have any inquiries, technical issues, translation feedback, or feature suggestions, please reach out to us through any of the channels below.</p>

<h2>Customer Support</h2>
<ul>
  <li><strong>Support Email:</strong> <a href="mailto:support@quraninternational.com">support@quraninternational.com</a></li>
  <li><strong>General Inquiries:</strong> <a href="mailto:contact@quraninternational.com">contact@quraninternational.com</a></li>
  <li><strong>Response Time:</strong> We strive to respond to all inquiries within 24 to 48 business hours.</li>
</ul>

<h2>Report a Translation or Content Issue</h2>
<p>If you spot a typo, translation nuance, or calculation discrepancy, please include the Surah name, Ayah number, and the translation language in your email so our editorial team can review it promptly.</p>

<h2>Account &amp; Privacy Inquiries</h2>
<p>For account deletion, data requests, or privacy concerns, please email us with the subject <em>"Privacy Request"</em> or visit our <a href="/policies/data-deletion">Data Deletion Policy</a>.</p>`,
  },
  {
    type: "about",
    title: "About Quran International",
    badge: "App Overview",
    badgeColor: "bg-slate-100 text-slate-700 border-slate-200",
    category: "General Application Overview",
    description: "Mission and vision of Quran International app and its worldwide Islamic resources.",
    storeNotice: "Provides descriptive background for user trust and marketing materials.",
    defaultContent: `<h1>About Quran International</h1>
<p><strong>Quran International</strong> is a comprehensive, global Islamic application engineered to provide millions of Muslims worldwide with authentic, beautifully designed, and technologically advanced Quran reading, recitation, and study tools.</p>

<h2>Our Key Features</h2>
<ul>
  <li><strong>Sacred Uthmani Quran:</strong> Crisp typography, word-by-word analysis, and authentic script.</li>
  <li><strong>Multilingual Translations:</strong> Over 100 languages with instant switching and offline access.</li>
  <li><strong>World-Renowned Sheikh Recitations:</strong> High-fidelity audio streaming and offline download packs.</li>
  <li><strong>Accurate Prayer Times &amp; Qibla:</strong> Precise geographical calculations with custom Azan notifications.</li>
  <li><strong>Islamic Knowledge Library:</strong> Authentic Hadith collections, daily Duas, and scholarly articles.</li>
</ul>

<p>Our mission is to make the Word of Allah and authentic Islamic knowledge accessible, engaging, and easy to recite anywhere, anytime.</p>`,
  },
];

export function findPolicyDefinition(type: string): PolicyDefinition {
  const normalized = (type || "").trim().toLowerCase();
  const direct = POLICY_DEFINITIONS.find((p) => p.type === normalized);
  if (direct) return direct;

  if (normalized.includes("term")) {
    return (
      POLICY_DEFINITIONS.find((p) => p.type.includes("term")) ||
      POLICY_DEFINITIONS[0]
    );
  }
  if (normalized.includes("delet")) {
    return (
      POLICY_DEFINITIONS.find((p) => p.type.includes("deletion")) ||
      POLICY_DEFINITIONS[0]
    );
  }
  if (normalized.includes("privac")) {
    return (
      POLICY_DEFINITIONS.find((p) => p.type.includes("privacy")) ||
      POLICY_DEFINITIONS[0]
    );
  }
  if (normalized.includes("refund")) {
    return (
      POLICY_DEFINITIONS.find((p) => p.type.includes("refund")) ||
      POLICY_DEFINITIONS[0]
    );
  }
  if (normalized.includes("contact") || normalized.includes("support")) {
    return (
      POLICY_DEFINITIONS.find((p) => p.type.includes("contact")) ||
      POLICY_DEFINITIONS[0]
    );
  }
  return POLICY_DEFINITIONS[0];
}



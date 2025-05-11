import { BannerItem } from "../../@Types/chabadType";

export const bannersData: BannerItem[] = [
  {
    title: "רישום לשבת",
    subtitle: "הצטרפו לארוחות שבת באווירה חמה ומשפחתית.",
    buttonText: "הרשמה לשבת",
    navigateTo: "/shabbat",
    className: "banner-1",
    image: "/images/shabbat-banner.jpg",
  },
  {
    title: "תמכו בפעילות בית חב״ד",
    subtitle: "עזרו לנו להמשיך להפיץ יהדות ולסייע לנזקקים.",
    buttonText: "תרום עכשיו",
    navigateTo: "/kampein",
    className: "banner-2",
    image: "/images/donation-banner.jpg",
  },
  {
    title: "פרשת השבוע",
    subtitle: "קראו והעמיקו בפרשת השבוע באתר שלנו.",
    buttonText: "לפרשת השבוע",
    navigateTo: "/parasha",
    className: "banner-3",
    image: "/images/parasha-banner.jpg",
  },
];

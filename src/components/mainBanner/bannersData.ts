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
    subtitle: "עזרו לנו להמשיך להפיץ יהדות ולסייע.",
    buttonText: "תרום עכשיו",
    navigateTo: "/kampein",
    className: "banner-2",
    image: "/images/donation-banner.jpg",
  },
  {
    title: "שאל את הרב",
    subtitle: "יש לך שאלה? אנחנו כאן בשבילך",
    buttonText: "שלח שאלה",
    navigateTo: "/ask-rabbi",
    image: "/img/rabbi.jpg",
    className: "slide-3"
  }
];

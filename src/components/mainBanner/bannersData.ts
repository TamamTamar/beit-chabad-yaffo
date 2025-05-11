// components/Banner/bannersData.ts

import { BannerItem } from "../../@Types/chabadType";

export const bannersData: BannerItem[] = [
  {
    title: "רישום לשבת",
    subtitle: "הצטרפו לארוחות שבת באווירה חמה ומשפחתית.",
    buttonText: "הרשמה לשבת",
    navigateTo: "/shabbat", // זה הנתיב לטופס רישום
    className: "banner-1",
  },
  {
    title: "תמכו בפעילות בית חב״ד",
    subtitle: "עזרו לנו להמשיך להפיץ יהדות ולסייע לנזקקים.",
    buttonText: "תרום עכשיו",
    navigateTo: "/kampein", // דף הקמפיין
    className: "banner-2",
  },
  {
    title: "פרשת השבוע",
    subtitle: "קראו והעמיקו בפרשת השבוע באתר שלנו.",
    buttonText: "לפרשת השבוע",
    navigateTo: "/parasha", // רשימת הפרשות
    className: "banner-3",
  },
];

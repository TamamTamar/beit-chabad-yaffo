// bannersData.ts

import { BannerItem } from "../../../@Types/chabadType";

  
  export const bannersData: BannerItem[] = [
    {
      title: "ברוכים הבאים לבית חב\"ד יפו",
      subtitle: "מקום של אהבה, חום ועזרה לכל יהודי.",
      buttonText: "הירשם עכשיו",
      navigateTo: "/register",
      className: "banner-1",
    },
    {
      title: "שיעורי תורה והשראה",
      subtitle: "בואו ללמוד ולהתחבר לאור התורה.",
      buttonText: "למידע נוסף",
      navigateTo: "/torah-classes",
      className: "banner-2",
    },
    {
      title: "תמכו בפעילות שלנו",
      subtitle: "עזרו לנו להמשיך להפיץ יהדות ולסייע לנזקקים.",
      buttonText: "תרום עכשיו",
      navigateTo: "/donate",
      className: "banner-3",
    },
  ];
  
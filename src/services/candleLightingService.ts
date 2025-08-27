import { HebcalData } from "../@Types/chabadType";

    export const fetchCandleLightingTimes = async () => {
    try {
      const response = await fetch(
        'https://www.hebcal.com/shabbat?cfg=json&geonameid=293397&M=on'
      );
      if (!response.ok) {
        throw new Error('Failed to fetch candle lighting times');
      }
      const json: HebcalData = await response.json();
  
      const candles = json.items.find((item) => item.category === 'candles');
      const havdalah = json.items.find((item) => item.category === 'havdalah');
      const parasha = json.items.find((item) => item.category === 'parashat');
  
      if (candles && havdalah && parasha) {
        return {
          date: new Date(candles.date).toLocaleDateString('he-IL', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          }),
          parasha: parasha.hebrew,
          candles: candles.title.split(': ')[1], // השעה בלבד
          havdalah: havdalah.title.split(': ')[1], // השעה בלבד
        };
      }
    } catch (err) {
      throw new Error(err.message);
    }
  };
  
import dayjs, { DEF_TZ } from '@/utilities/dayjs';

export const GAMES = [
  {
    name: 'Wordle',
    regex:
      /Wordle (?<number>\d+) (?<score>\d|X)\/6(?<hardMode>\*)?\n?\n(?<emoji>(?:(?:(?:🟩|⬜|🟨|⬛){5})\n){0,5}(?:(?:🟩|⬜|🟨|⬛){5}))/,
    regexTypes: {
      number: Number,
      score: (score: string) => {
        const numberScore = Number(score);
        if (!isNaN(numberScore)) {
          return numberScore;
        }
        return score;
      },
      emoji: String,
      hardMode: (asterisk?: string) => !!asterisk,
    },
    example: 'Wordle 317 3/6\n\n🟩🟩⬜🟩⬜\n🟩🟩🟩🟩⬜\n🟩🟩🟩🟩🟩',
    url: 'https://www.nytimes.com/games/wordle/index.html',
    utcResetOffset: dayjs().tz(DEF_TZ, true).utcOffset(),
  },
  {
    name: 'octordle',
    regex: /Daily Octordle #(?<number>\d+)\n\n?(?<emoji>(?:(?:0️⃣|1️⃣|2️⃣|3️⃣|4️⃣|5️⃣|6️⃣|7️⃣|8️⃣|9️⃣|🔟|🕚|🕛|🕐|🟥)\n?){8})/,
    regexTypes: {
      number: Number,
      emoji: String,
    },
    additionalProps: {
      score: ({ number, emoji }: { number: number; emoji: string }) => {
        if (emoji.includes('🟥')) return 'unsolved';
        if (emoji.includes('🕐')) return 13;
        if (emoji.includes('🕛')) return 12;
        if (emoji.includes('🕚')) return 11;
        if (emoji.includes('🔟')) return 10;
        if (emoji.includes('9️⃣')) return 9;
        if (emoji.includes('8️⃣')) return 8;
        return '?';
      },
    },
    example: 'Daily Octordle #99\n🔟6️⃣\n🕛7️⃣\n9️⃣🕚\n8️⃣🕐',
    url: 'https://octordle.com/',
    utcResetOffset: dayjs().tz(DEF_TZ, true).utcOffset(),
  },
  {
    name: 'nerdlegame',
    regex: /nerdlegame (?<number>\d+) (?<score>\d)\/6\n?\n(?<emoji>(?:(?:(?:🟩|🟪|⬛){8})\n){0,5}(?:(?:🟩|🟪|⬛){8}))/,
    regexTypes: {
      number: Number,
      score: Number,
      emoji: String,
    },
    example: 'nerdlegame 104 4/6\n\n🟩🟩⬛🟪⬛🟪🟪⬛\n🟩🟩⬛🟩🟩🟪🟩🟪\n🟩🟩🟩🟩🟩🟪🟩🟪\n🟩🟩🟩🟩🟩🟩🟩🟩',
    url: 'https://nerdlegame.com',
    utcResetOffset: 0,
  },
  {
    name: 'mini nerdlegame',
    regex:
      /mini nerdlegame (?<number>\d+) (?<score>\d)\/6\n?\n(?<emoji>(?:(?:(?:🟩|🟪|⬛){6})\n){0,5}(?:(?:🟩|🟪|⬛){6}))/,
    example: 'mini nerdlegame 104 3/6\n\n🟪⬛⬛⬛🟪🟩\n⬛⬛⬛🟩⬛🟩\n🟩🟩🟩🟩🟩🟩',
    regexTypes: {
      number: Number,
      score: Number,
      emoji: String,
    },
    url: 'https://mini.nerdlegame.com',
    utcResetOffset: 0,
  },
  {
    name: 'instant nerdle',
    regex: /(?:(?:🟩|🟪|⬛️) ?){3}Instant Nerdle (?<number>\d+) solved in (?<time>\d+m (?:\d+s)?)!/,
    regexTypes: {
      number: Number,
      time: (t: string) => {
        const match = /(?<minutes>\d+)m (?<seconds>\d+)s/.exec(t);
        return dayjs
          .duration(Object.keys(match?.groups || {}).reduce((obj, k) => ({ ...obj, [k]: Number(match.groups[k]) }), {}))
          .asMilliseconds();
      },
    },
    example: '🟩 🟪 ⬛️ Instant Nerdle 90 solved in 6m 13s!',
    url: 'https://instant.nerdlegame.com',
    utcResetOffset: 0,
  },
  {
    name: 'globle',
    regex:
      /🌎 (?<date>\w+ \d+, \d+) 🌍(?:\s|\n)🔥 (?<streak>\d+) \| Avg\. Guesses: (?<average>(?:\d|\.)+)\n(?<emoji>(?:⬜|🟨|🟧|🟥|🟩|\n)+) = (?<score>\d+)/,
    regexTypes: {
      date: (d: string) => dayjs.tz(d, 'MMM D, YYYY', DEF_TZ).format(),
      streak: Number,
      average: Number,
      emoji: (e: string) => e?.replace('\n', ''),
      score: Number,
    },
    example: '🌎 May 2, 2022 🌍\n🔥 1 | Avg. Guesses: 12\n⬜⬜🟨🟨🟧🟨🟧🟨\n🟧🟥⬜🟩 = 12',
    url: 'https://globle-game.com',
    utcResetOffset: dayjs().tz(DEF_TZ, true).utcOffset(),
  },
  {
    name: 'semantle',
    regex:
      /I solved Semantle #(?<number>\d+) in (?<score>\d+) guesses(?: with (?<hints>\d+) hints?)?\. My first guess had a similarity of (?:(?:\d|\.|-)*\d). My first word in the top 1000 was at guess #(?:\d+)\. (?:My penultimate guess had a similarity of (?:(?:\d|\.|-)*\d)(?: \(\d+\/1000\))?\.)?/,
    regexTypes: {
      number: Number,
      score: Number,
      hints: Number,
    },
    example:
      'I solved Semantle #95 in 149 guesses with 2 hints. My first guess had a similarity of 5.82. My first word in the top 1000 was at guess #7. My penultimate guess had a similarity of 70.88 (999/1000).',
    url: 'https://semantle.com',
    utcResetOffset: 0,
  },
];

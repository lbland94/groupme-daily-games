import dayjs, { DEF_TZ } from '@/utilities/dayjs';

export const GAMES = [
  {
    name: 'Wordle',
    regex:
      /Wordle (?<number>\d+) (?<score>\d|X)\/6(?<hardMode>\*)?\n?\n(?<emoji>(?:(?:(?:š©|ā¬|šØ|ā¬){5})\n){0,5}(?:(?:š©|ā¬|šØ|ā¬){5}))/,
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
    example: 'Wordle 317 3/6\n\nš©š©ā¬š©ā¬\nš©š©š©š©ā¬\nš©š©š©š©š©',
    url: 'https://www.nytimes.com/games/wordle/index.html',
    utcResetOffset: dayjs().tz(DEF_TZ, true).utcOffset(),
  },
  {
    name: 'octordle',
    regex: /Daily Octordle #(?<number>\d+)\n\n?(?<emoji>(?:(?:0ļøā£|1ļøā£|2ļøā£|3ļøā£|4ļøā£|5ļøā£|6ļøā£|7ļøā£|8ļøā£|9ļøā£|š|š|š|š|š„)\n?){8})/,
    regexTypes: {
      number: Number,
      emoji: String,
    },
    additionalProps: {
      score: ({ number, emoji }: { number: number; emoji: string }) => {
        if (emoji.includes('š„')) return 'unsolved';
        if (emoji.includes('š')) return 13;
        if (emoji.includes('š')) return 12;
        if (emoji.includes('š')) return 11;
        if (emoji.includes('š')) return 10;
        if (emoji.includes('9ļøā£')) return 9;
        if (emoji.includes('8ļøā£')) return 8;
        return '?';
      },
    },
    example: 'Daily Octordle #99\nš6ļøā£\nš7ļøā£\n9ļøā£š\n8ļøā£š',
    url: 'https://octordle.com/',
    utcResetOffset: dayjs().tz(DEF_TZ, true).utcOffset(),
  },
  {
    name: 'nerdlegame',
    regex: /nerdlegame (?<number>\d+) (?<score>\d)\/6\n?\n(?<emoji>(?:(?:(?:š©|šŖ|ā¬){8})\n){0,5}(?:(?:š©|šŖ|ā¬){8}))/,
    regexTypes: {
      number: Number,
      score: Number,
      emoji: String,
    },
    example: 'nerdlegame 104 4/6\n\nš©š©ā¬šŖā¬šŖšŖā¬\nš©š©ā¬š©š©šŖš©šŖ\nš©š©š©š©š©šŖš©šŖ\nš©š©š©š©š©š©š©š©',
    url: 'https://nerdlegame.com',
    utcResetOffset: 0,
  },
  {
    name: 'mini nerdlegame',
    regex:
      /mini nerdlegame (?<number>\d+) (?<score>\d)\/6\n?\n(?<emoji>(?:(?:(?:š©|šŖ|ā¬){6})\n){0,5}(?:(?:š©|šŖ|ā¬){6}))/,
    example: 'mini nerdlegame 104 3/6\n\nšŖā¬ā¬ā¬šŖš©\nā¬ā¬ā¬š©ā¬š©\nš©š©š©š©š©š©',
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
    regex: /(?:(?:š©|šŖ|ā¬ļø) ?){3}Instant Nerdle (?<number>\d+) solved in (?<time>\d+m (?:\d+s)?)!/,
    regexTypes: {
      number: Number,
      time: (t: string) => {
        const match = /(?<minutes>\d+)m (?<seconds>\d+)s/.exec(t);
        return dayjs
          .duration(Object.keys(match?.groups || {}).reduce((obj, k) => ({ ...obj, [k]: Number(match.groups[k]) }), {}))
          .asMilliseconds();
      },
    },
    example: 'š© šŖ ā¬ļø Instant Nerdle 90 solved in 6m 13s!',
    url: 'https://instant.nerdlegame.com',
    utcResetOffset: 0,
  },
  {
    name: 'globle',
    regex:
      /š (?<date>\w+ \d+, \d+) š(?:\s|\n)š„ (?<streak>\d+) \| Avg\. Guesses: (?<average>(?:\d|\.)+)\n(?<emoji>(?:ā¬|šØ|š§|š„|š©|\n)+) = (?<score>\d+)/,
    regexTypes: {
      date: (d: string) => dayjs.tz(d, 'MMM D, YYYY', DEF_TZ).format(),
      streak: Number,
      average: Number,
      emoji: (e: string) => e?.replace('\n', ''),
      score: Number,
    },
    example: 'š May 2, 2022 š\nš„ 1 | Avg. Guesses: 12\nā¬ā¬šØšØš§šØš§šØ\nš§š„ā¬š© = 12',
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

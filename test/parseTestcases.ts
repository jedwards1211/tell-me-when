import { DateFn } from '../src/DateFn'

export const parseTestcases: Record<
  string,
  DateFn[] | { ref: string } | 'error'
> = {
  '2021': [
    ['setYear', 2021],
    ['startOfYear'],
    ['makeInterval', ['addYears', 1]],
  ],
  ' \t2021 ': { ref: '2021' },
  '202': 'error',
  '2021aug': [
    ['setYear', 2021],
    ['setMonth', 7],
    ['startOfMonth'],
    ['makeInterval', ['addMonths', 1]],
  ],
  'aug 2021': { ref: '2021aug' },
  '202aug': 'error',
  '2021au': 'error',
  '2021augu': 'error',
  '2021Aug': { ref: '2021aug' },
  '2021AUG': { ref: '2021aug' },
  '2021august': { ref: '2021aug' },
  '2021.aug': { ref: '2021aug' },
  '2021-aug': { ref: '2021aug' },
  '2021_aug': { ref: '2021aug' },
  '2021/aug': { ref: '2021aug' },
  '2021 aug': { ref: '2021aug' },
  '2021 aug.': { ref: '2021aug' },
  '2021 AUG.': { ref: '2021aug' },
  '2021  AUG.': { ref: '2021aug' },
  '2021aug.': 'error',

  '2021.08': { ref: '2021aug' },
  '2021-08': { ref: '2021aug' },
  '2021_08': { ref: '2021aug' },
  '2021/08': { ref: '2021aug' },
  '2021 08': { ref: '2021aug' },

  '2021.8': { ref: '2021aug' },
  '2021-8': { ref: '2021aug' },
  '2021_8': { ref: '2021aug' },
  '2021/8': { ref: '2021aug' },
  '2021 8': { ref: '2021aug' },

  '2021aug06': [
    ['setYear', 2021],
    ['setMonth', 7],
    ['setDate', 6],
    ['startOfDay'],
    ['makeInterval', ['addDays', 1]],
  ],
  '2021.aug.06': { ref: '2021aug06' },
  '2021-aug-06': { ref: '2021aug06' },
  '2021_aug_06': { ref: '2021aug06' },
  '2021/aug/06': { ref: '2021aug06' },
  '2021 aug 06': { ref: '2021aug06' },
  '2021 aug. 06': { ref: '2021aug06' },

  '2021.08.06': { ref: '2021aug06' },
  '2021-08-06': { ref: '2021aug06' },
  '2021_08_06': { ref: '2021aug06' },
  '2021/08/06': { ref: '2021aug06' },
  '2021 08 06': { ref: '2021aug06' },

  '2021aug6': { ref: '2021aug06' },
  '2021.aug.6': { ref: '2021aug06' },
  '2021-aug-6': { ref: '2021aug06' },
  '2021_aug_6': { ref: '2021aug06' },
  '2021/aug/6': { ref: '2021aug06' },
  '2021 aug 6': { ref: '2021aug06' },
  '2021 aug. 6': { ref: '2021aug06' },

  '2021aug6th': { ref: '2021aug06' },
  '2021.aug.6th': { ref: '2021aug06' },
  '2021-aug-6th': { ref: '2021aug06' },
  '2021_aug_6th': { ref: '2021aug06' },
  '2021/aug/6th': { ref: '2021aug06' },
  '2021 aug 6th': { ref: '2021aug06' },
  '2021 aug. 6th': { ref: '2021aug06' },

  '2021.8.6': { ref: '2021aug06' },
  '2021-8-6': { ref: '2021aug06' },
  '2021_8_6': { ref: '2021aug06' },
  '2021/8/6': { ref: '2021aug06' },
  '2021 8 6': { ref: '2021aug06' },

  // aug: [['setMonth', 7], ['startOfMonth'], ['makeInterval', ['addMonths', 1]]],
  aug: [
    ['setMonth', 7],
    ['startOfMonth'],
    [
      'closestToNow',
      [['if', { afterNow: [['addYears', -1]] }]],
      [['if', { beforeNow: [['addYears', 1]] }]],
    ],
    ['makeInterval', ['addMonths', 1]],
  ],
  august: { ref: 'aug' },
  'aug.': { ref: 'aug' },
  au: 'error',
  augu: 'error',
  '08': 'error',

  aug1: [
    ['setMonth', 7],
    ['setDate', 1],
    ['startOfDay'],
    [
      'closestToNow',
      [['if', { afterNow: [['addYears', -1]] }]],
      [['if', { beforeNow: [['addYears', 1]] }]],
    ],
    ['makeInterval', ['addDays', 1]],
  ],
  aug2: [
    ['setMonth', 7],
    ['setDate', 2],
    ['startOfDay'],
    [
      'closestToNow',
      [['if', { afterNow: [['addYears', -1]] }]],
      [['if', { beforeNow: [['addYears', 1]] }]],
    ],
    ['makeInterval', ['addDays', 1]],
  ],
  aug3: [
    ['setMonth', 7],
    ['setDate', 3],
    ['startOfDay'],
    [
      'closestToNow',
      [['if', { afterNow: [['addYears', -1]] }]],
      [['if', { beforeNow: [['addYears', 1]] }]],
    ],
    ['makeInterval', ['addDays', 1]],
  ],
  aug4: [
    ['setMonth', 7],
    ['setDate', 4],
    ['startOfDay'],
    [
      'closestToNow',
      [['if', { afterNow: [['addYears', -1]] }]],
      [['if', { beforeNow: [['addYears', 1]] }]],
    ],
    ['makeInterval', ['addDays', 1]],
  ],
  'aug.1': { ref: 'aug1' },
  'aug-1': { ref: 'aug1' },
  aug_1: { ref: 'aug1' },
  'aug/1': { ref: 'aug1' },
  'aug 1': { ref: 'aug1' },
  aug01: { ref: 'aug1' },
  'aug.01': { ref: 'aug1' },
  'aug-01': { ref: 'aug1' },
  aug_01: { ref: 'aug1' },
  'aug/01': { ref: 'aug1' },
  'aug 01': { ref: 'aug1' },
  aug1st: { ref: 'aug1' },
  'aug.1st': { ref: 'aug1' },
  'aug-1st': { ref: 'aug1' },
  aug_1st: { ref: 'aug1' },
  'aug/1st': { ref: 'aug1' },
  'aug 1st': { ref: 'aug1' },
  '1st aug': { ref: 'aug1' },
  '1st of aug': { ref: 'aug1' },
  '1ST OF AUG': { ref: 'aug1' },
  '1st of august': { ref: 'aug1' },
  '1st of aug.': { ref: 'aug1' },
  '1st day of aug': { ref: 'aug1' },
  '1 of aug': 'error',
  '1 day of aug': 'error',
  aug2nd: { ref: 'aug2' },
  'aug.2nd': { ref: 'aug2' },
  'aug-2nd': { ref: 'aug2' },
  aug_2nd: { ref: 'aug2' },
  'aug/2nd': { ref: 'aug2' },
  'aug 2nd': { ref: 'aug2' },
  aug3rd: { ref: 'aug3' },
  'aug.3rd': { ref: 'aug3' },
  'aug-3rd': { ref: 'aug3' },
  aug_3rd: { ref: 'aug3' },
  'aug/3rd': { ref: 'aug3' },
  'aug 3rd': { ref: 'aug3' },
  aug4th: { ref: 'aug4' },
  'aug.4th': { ref: 'aug4' },
  'aug-4th': { ref: 'aug4' },
  aug_4th: { ref: 'aug4' },
  'aug/4th': { ref: 'aug4' },
  'aug 4th': { ref: 'aug4' },

  'aug 1 2020': [
    ['setYear', 2020],
    ['setMonth', 7],
    ['setDate', 1],
    ['startOfDay'],
    ['makeInterval', ['addDays', 1]],
  ],
  'aug.1.2020': { ref: 'aug 1 2020' },
  'aug.1.20': { ref: 'aug 1 2020' },
  'aug-1-2020': { ref: 'aug 1 2020' },
  aug_1_2020: { ref: 'aug 1 2020' },
  aug_1_20: { ref: 'aug 1 2020' },
  'aug/1/2020': { ref: 'aug 1 2020' },
  'aug/1/20': { ref: 'aug 1 2020' },
  'aug.01.2020': { ref: 'aug 1 2020' },
  'aug.01.20': { ref: 'aug 1 2020' },
  'aug-01-2020': { ref: 'aug 1 2020' },
  'aug-01-20': { ref: 'aug 1 2020' },
  aug_01_2020: { ref: 'aug 1 2020' },
  aug_01_20: { ref: 'aug 1 2020' },
  'aug/01/2020': { ref: 'aug 1 2020' },
  'aug/01/20': { ref: 'aug 1 2020' },
  'aug 01 2020': { ref: 'aug 1 2020' },
  'aug 01 20': { ref: 'aug 1 2020' },
  "aug 01 '20": { ref: 'aug 1 2020' },
  aug1st2020: { ref: 'aug 1 2020' },
  aug1st20: { ref: 'aug 1 2020' },
  "aug1st'20": { ref: 'aug 1 2020' },
  'aug.1st.2020': { ref: 'aug 1 2020' },
  'aug.1st.20': { ref: 'aug 1 2020' },
  'aug-1st-2020': { ref: 'aug 1 2020' },
  'aug-1st-20': { ref: 'aug 1 2020' },
  aug_1st_2020: { ref: 'aug 1 2020' },
  aug_1st_20: { ref: 'aug 1 2020' },
  'aug/1st/2020': { ref: 'aug 1 2020' },
  'aug/1st/20': { ref: 'aug 1 2020' },
  'aug 1st 2020': { ref: 'aug 1 2020' },
  'aug 1st 20': { ref: 'aug 1 2020' },
  "aug 1st '20": { ref: 'aug 1 2020' },
  'aug 1st, 2020': { ref: 'aug 1 2020' },
  'aug 1st, 20': { ref: 'aug 1 2020' },
  "aug 1st, '20": { ref: 'aug 1 2020' },
  'aug. 1st 2020': { ref: 'aug 1 2020' },
  'aug. 1st 20': { ref: 'aug 1 2020' },
  "aug. 1st '20": { ref: 'aug 1 2020' },
  'aug. 1st, 2020': { ref: 'aug 1 2020' },
  'aug. 1st, 20': { ref: 'aug 1 2020' },
  "aug. 1st, '20": { ref: 'aug 1 2020' },
  'aug 1 20': { ref: 'aug 1 2020' },
  "aug 1 '20": { ref: 'aug 1 2020' },
  'aug 1, 2020': { ref: 'aug 1 2020' },
  'aug 1, 20': { ref: 'aug 1 2020' },
  "aug 1, '20": { ref: 'aug 1 2020' },
  'aug. 1 2020': { ref: 'aug 1 2020' },
  'aug. 1 20': { ref: 'aug 1 2020' },
  "aug. 1 '20": { ref: 'aug 1 2020' },
  'aug. 1, 2020': { ref: 'aug 1 2020' },
  'aug. 1, 20': { ref: 'aug 1 2020' },
  "aug. 1, '20": { ref: 'aug 1 2020' },
  '1st aug 2020': { ref: 'aug 1 2020' },
  '1st aug 20': { ref: 'aug 1 2020' },
  "1st aug '20": { ref: 'aug 1 2020' },
  '1st of aug 2020': { ref: 'aug 1 2020' },
  '1st of aug 20': { ref: 'aug 1 2020' },
  "1st of aug '20": { ref: 'aug 1 2020' },
  '1st of aug, 2020': { ref: 'aug 1 2020' },
  '1st of aug, 20': { ref: 'aug 1 2020' },
  "1st of aug, '20": { ref: 'aug 1 2020' },
  '1st of august 2020': { ref: 'aug 1 2020' },
  '1st of august 20': { ref: 'aug 1 2020' },
  "1st of august '20": { ref: 'aug 1 2020' },
  '1st of august, 2020': { ref: 'aug 1 2020' },
  '1st of august, 20': { ref: 'aug 1 2020' },
  "1st of august, '20": { ref: 'aug 1 2020' },
  '1st of aug. 2020': { ref: 'aug 1 2020' },
  '1st of aug. 20': { ref: 'aug 1 2020' },
  "1st of aug. '20": { ref: 'aug 1 2020' },
  '1st of aug., 2020': { ref: 'aug 1 2020' },
  '1st of aug., 20': { ref: 'aug 1 2020' },
  "1st of aug., '20": { ref: 'aug 1 2020' },
  '1st day of aug 2020': { ref: 'aug 1 2020' },
  '1st day of aug 20': { ref: 'aug 1 2020' },
  "1st day of aug '20": { ref: 'aug 1 2020' },
  '1st day of aug, 2020': { ref: 'aug 1 2020' },
  '1st day of aug, 20': { ref: 'aug 1 2020' },
  "1st day of aug, '20": { ref: 'aug 1 2020' },
  '1 of aug 2020': 'error',
  '1 of aug 20': 'error',
  "1 of aug '20": 'error',
  '1 day of aug 2020': 'error',
  '1 day of aug 20': 'error',
  "1 day of aug '20": 'error',
  '1st': [
    ['setDate', 1],
    ['startOfDay'],
    [
      'closestToNow',
      [['if', { afterNow: [['addMonths', -1]] }]],
      [['if', { beforeNow: [['addMonths', 1]] }]],
    ],
    ['makeInterval', ['addDays', 1]],
  ],
  first: { ref: '1st' },
  'the 1st': { ref: '1st' },
  'the first': { ref: '1st' },
  '2nd': [
    ['setDate', 2],
    ['startOfDay'],

    [
      'closestToNow',
      [['if', { afterNow: [['addMonths', -1]] }]],
      [['if', { beforeNow: [['addMonths', 1]] }]],
    ],
    ['makeInterval', ['addDays', 1]],
  ],
  second: { ref: '2nd' },
  'the 2nd': { ref: '2nd' },
  'the second': { ref: '2nd' },
  '3rd': [
    ['setDate', 3],
    ['startOfDay'],
    [
      'closestToNow',
      [['if', { afterNow: [['addMonths', -1]] }]],
      [['if', { beforeNow: [['addMonths', 1]] }]],
    ],
    ['makeInterval', ['addDays', 1]],
  ],
  third: { ref: '3rd' },
  'the 3rd': { ref: '3rd' },
  'the third': { ref: '3rd' },
  '1aug': { ref: 'aug1' },
  '1 aug': { ref: 'aug1' },
  '1.aug': { ref: 'aug1' },
  '1-aug': { ref: 'aug1' },
  '1_aug': { ref: 'aug1' },
  '1/aug': { ref: 'aug1' },
  '01aug': { ref: 'aug1' },
  '01 aug': { ref: 'aug1' },
  '01.aug': { ref: 'aug1' },
  '01-aug': { ref: 'aug1' },
  '01_aug': { ref: 'aug1' },
  '01/aug': { ref: 'aug1' },
  '1st.aug': { ref: 'aug1' },
  '1st-aug': { ref: 'aug1' },
  '1st_aug': { ref: 'aug1' },
  '1st/aug': { ref: 'aug1' },
  '1aug2020': { ref: 'aug 1 2020' },
  '1aug20': { ref: 'aug 1 2020' },
  '1 aug 2020': { ref: 'aug 1 2020' },
  '1 aug 20': { ref: 'aug 1 2020' },
  "1 aug '20": { ref: 'aug 1 2020' },
  '1.aug.2020': { ref: 'aug 1 2020' },
  '1.aug.20': { ref: 'aug 1 2020' },
  '1-aug-2020': { ref: 'aug 1 2020' },
  '1-aug-20': { ref: 'aug 1 2020' },
  '1_aug_2020': { ref: 'aug 1 2020' },
  '1_aug_20': { ref: 'aug 1 2020' },
  '1/aug/2020': { ref: 'aug 1 2020' },
  '1/aug/20': { ref: 'aug 1 2020' },
  '01aug2020': { ref: 'aug 1 2020' },
  '01aug20': { ref: 'aug 1 2020' },
  '01 aug 2020': { ref: 'aug 1 2020' },
  '01 aug 20': { ref: 'aug 1 2020' },
  "01 aug '20": { ref: 'aug 1 2020' },
  '01.aug.2020': { ref: 'aug 1 2020' },
  '01.aug.20': { ref: 'aug 1 2020' },
  '01-aug-2020': { ref: 'aug 1 2020' },
  '01-aug-20': { ref: 'aug 1 2020' },
  '01_aug_2020': { ref: 'aug 1 2020' },
  '01_aug_20': { ref: 'aug 1 2020' },
  '01/aug/2020': { ref: 'aug 1 2020' },
  '01/aug/20': { ref: 'aug 1 2020' },
  '1st.aug.2020': { ref: 'aug 1 2020' },
  '1st.aug.20': { ref: 'aug 1 2020' },
  '1st-aug-2020': { ref: 'aug 1 2020' },
  '1st-aug-20': { ref: 'aug 1 2020' },
  '1st_aug_2020': { ref: 'aug 1 2020' },
  '1st_aug_20': { ref: 'aug 1 2020' },
  '1st/aug/2020': { ref: 'aug 1 2020' },
  '1st/aug/20': { ref: 'aug 1 2020' },
  'aug 6 1am': [
    ['setMonth', 7],
    ['setDate', 6],
    [
      'closestToNow',
      [['if', { afterNow: [['addYears', -1]] }]],
      [['if', { beforeNow: [['addYears', 1]] }]],
    ],
    ['setHours', 1],
    ['startOfHour'],
  ],
  'aug 6 13:00': [
    ['setMonth', 7],
    ['setDate', 6],
    [
      'closestToNow',
      [['if', { afterNow: [['addYears', -1]] }]],
      [['if', { beforeNow: [['addYears', 1]] }]],
    ],
    ['setHours', 13],
    ['setMinutes', 0],
    ['startOfMinute'],
  ],
  'aug 6 12am': [
    ['setMonth', 7],
    ['setDate', 6],
    [
      'closestToNow',
      [['if', { afterNow: [['addYears', -1]] }]],
      [['if', { beforeNow: [['addYears', 1]] }]],
    ],
    ['setHours', 0],
    ['startOfHour'],
  ],
  'aug 6 12 am': { ref: 'aug 6 12am' },
  '6 aug 12 am': { ref: 'aug 6 12am' },
  '12 am aug 6': { ref: 'aug 6 12am' },
  '12am aug 6': { ref: 'aug 6 12am' },
  "aug 6 '12 12am": [
    ['setYear', 2012],
    ['setMonth', 7],
    ['setDate', 6],
    ['setHours', 0],
    ['startOfHour'],
  ],
  'aug 6 at 1am': { ref: 'aug 6 1am' },
  'aug 6 at 1': { ref: 'aug 6 1am' },
  '1am on aug 6': { ref: 'aug 6 1am' },
  '1 on aug 6': { ref: 'aug 6 1am' },
  '1am aug 6': { ref: 'aug 6 1am' },
  'aug 6 1:23am': [
    ['setMonth', 7],
    ['setDate', 6],
    [
      'closestToNow',
      [['if', { afterNow: [['addYears', -1]] }]],
      [['if', { beforeNow: [['addYears', 1]] }]],
    ],
    ['setHours', 1],
    ['setMinutes', 23],
    ['startOfMinute'],
  ],
  '1:23am on aug 6': { ref: 'aug 6 1:23am' },
  '1:23am ON aug 6': { ref: 'aug 6 1:23am' },
  '1:23 on aug 6': { ref: 'aug 6 1:23am' },
  '1:23 aug 6': { ref: 'aug 6 1:23am' },
  '1:23am aug 6': { ref: 'aug 6 1:23am' },
  'aug 6 at 1:23am': { ref: 'aug 6 1:23am' },
  'aug 6 at 1:23': { ref: 'aug 6 1:23am' },
  'aug 6 AT 1:23': { ref: 'aug 6 1:23am' },
  'aug 6 1:23': { ref: 'aug 6 1:23am' },

  'aug 6 2020 1am': [
    ['setYear', 2020],
    ['setMonth', 7],
    ['setDate', 6],
    ['setHours', 1],
    ['startOfHour'],
  ],
  'aug 6 2020 at 1am': { ref: 'aug 6 2020 1am' },
  'AUG 6 2020 AT 1AM': { ref: 'aug 6 2020 1am' },
  'aug 6 2020 at 1': { ref: 'aug 6 2020 1am' },
  '1am on aug 6 2020': { ref: 'aug 6 2020 1am' },
  '1 on aug 6 2020': { ref: 'aug 6 2020 1am' },
  '1am aug 6 2020': { ref: 'aug 6 2020 1am' },
  'aug 6 2020 1:23am': [
    ['setYear', 2020],
    ['setMonth', 7],
    ['setDate', 6],
    ['setHours', 1],
    ['setMinutes', 23],
    ['startOfMinute'],
  ],
  '1:23am on aug 6 2020': { ref: 'aug 6 2020 1:23am' },
  '1:23 on aug 6 2020': { ref: 'aug 6 2020 1:23am' },
  '1:23 aug 6 2020': { ref: 'aug 6 2020 1:23am' },
  '1:23am aug 6 2020': { ref: 'aug 6 2020 1:23am' },
  'aug 6 2020 at 1:23am': { ref: 'aug 6 2020 1:23am' },
  'aug 6 2020 at 1:23': { ref: 'aug 6 2020 1:23am' },
  'aug 6 2020 1:23': { ref: 'aug 6 2020 1:23am' },

  '1am': [['setHours', 1], ['startOfHour']],
  '01am': { ref: '1am' },
  '1:23am': [['setHours', 1], ['setMinutes', 23], ['startOfMinute']],
  '01:23am': { ref: '1:23am' },
  '01:23': { ref: '1:23am' },
  '1:23:45am': [
    ['setHours', 1],
    ['setMinutes', 23],
    ['setSeconds', 45],
    ['startOfSecond'],
  ],
  '01:23:45am': { ref: '1:23:45am' },
  '01:23:45': { ref: '1:23:45am' },
  '1:23:45.7am': [
    ['setHours', 1],
    ['setMinutes', 23],
    ['setSeconds', 45],
    ['setMilliseconds', 700],
  ],
  '01:23:45.7am': { ref: '1:23:45.7am' },
  '01:23:45.7': { ref: '1:23:45.7am' },
  '1:23:45.72am': [
    ['setHours', 1],
    ['setMinutes', 23],
    ['setSeconds', 45],
    ['setMilliseconds', 720],
  ],
  '01:23:45.72am': { ref: '1:23:45.72am' },
  '01:23:45.72': { ref: '1:23:45.72am' },
  '1:23:45.729am': [
    ['setHours', 1],
    ['setMinutes', 23],
    ['setSeconds', 45],
    ['setMilliseconds', 729],
  ],
  '01:23:45.729am': { ref: '1:23:45.729am' },
  '01:23:45.729': { ref: '1:23:45.729am' },
  '1:23:45.7298am': 'error',
  '24am': 'error',
  '001:23': 'error',
  '01:60am': 'error',
  '01:59': [['setHours', 1], ['setMinutes', 59], ['startOfMinute']],
  '01:59:60': 'error',
  'aug 9 to sep 8': [
    ['setMonth', 7],
    ['setDate', 9],
    ['startOfDay'],
    [
      'closestToNow',
      [['if', { afterNow: [['addYears', -1]] }]],
      [['if', { beforeNow: [['addYears', 1]] }]],
    ],
    [
      'makeInterval',
      ['setMonth', 8],
      ['setDate', 8],
      ['startOfDay'],
      [
        'closestToNow',
        [['if', { afterNow: [['addYears', -1]] }]],
        [['if', { beforeNow: [['addYears', 1]] }]],
      ],
    ],
  ],
  'aug 9 - sep 8': { ref: 'aug 9 to sep 8' },
  'aug 9 until sep 8': { ref: 'aug 9 to sep 8' },
  'from aug 9 to sep 8': { ref: 'aug 9 to sep 8' },
  'from aug 9 - sep 8': { ref: 'aug 9 to sep 8' },
  'from aug 9 until sep 8': { ref: 'aug 9 to sep 8' },

  'aug 9 through sep 8': [
    ['setMonth', 7],
    ['setDate', 9],
    ['startOfDay'],

    [
      'closestToNow',
      [['if', { afterNow: [['addYears', -1]] }]],
      [['if', { beforeNow: [['addYears', 1]] }]],
    ],
    [
      'makeInterval',
      ['setMonth', 8],
      ['setDate', 8],
      ['startOfDay'],
      [
        'closestToNow',
        [['if', { afterNow: [['addYears', -1]] }]],
        [['if', { beforeNow: [['addYears', 1]] }]],
      ],
      ['addDays', 1],
    ],
  ],
  'from aug 9 through sep 8': { ref: 'aug 9 through sep 8' },

  'aug 9 through sep': [
    ['setMonth', 7],
    ['setDate', 9],
    ['startOfDay'],
    [
      'closestToNow',
      [['if', { afterNow: [['addYears', -1]] }]],
      [['if', { beforeNow: [['addYears', 1]] }]],
    ],
    [
      'makeInterval',
      ['setMonth', 8],
      ['startOfMonth'],
      [
        'closestToNow',
        [['if', { afterNow: [['addYears', -1]] }]],
        [['if', { beforeNow: [['addYears', 1]] }]],
      ],

      ['addMonths', 1],
    ],
  ],
  'from aug 9 through sep': { ref: 'aug 9 through sep' },

  'aug 9 to sep': [
    ['setMonth', 7],
    ['setDate', 9],
    ['startOfDay'],
    [
      'closestToNow',
      [['if', { afterNow: [['addYears', -1]] }]],
      [['if', { beforeNow: [['addYears', 1]] }]],
    ],
    [
      'makeInterval',
      ['setMonth', 8],
      ['startOfMonth'],
      [
        'closestToNow',
        [['if', { afterNow: [['addYears', -1]] }]],
        [['if', { beforeNow: [['addYears', 1]] }]],
      ],
    ],
  ],
  'aug 9 - sep': { ref: 'aug 9 to sep' },
  'aug 9 until sep': { ref: 'aug 9 to sep' },
  'from aug 9 - sep': { ref: 'aug 9 to sep' },
  'from aug 9 until sep': { ref: 'aug 9 to sep' },

  'aug 9 to sep 13 at 8:25': [
    ['setMonth', 7],
    ['setDate', 9],
    ['startOfDay'],
    [
      'closestToNow',
      [['if', { afterNow: [['addYears', -1]] }]],
      [['if', { beforeNow: [['addYears', 1]] }]],
    ],
    [
      'makeInterval',
      ['setMonth', 8],
      ['setDate', 13],
      [
        'closestToNow',
        [['if', { afterNow: [['addYears', -1]] }]],
        [['if', { beforeNow: [['addYears', 1]] }]],
      ],
      ['setHours', 8],
      ['setMinutes', 25],
      ['startOfMinute'],
    ],
  ],
  'aug 9 3pm to sep 13 at 8:25': [
    ['setMonth', 7],
    ['setDate', 9],
    [
      'closestToNow',
      [['if', { afterNow: [['addYears', -1]] }]],
      [['if', { beforeNow: [['addYears', 1]] }]],
    ],
    ['setHours', 15],
    ['startOfHour'],
    [
      'makeInterval',
      ['setMonth', 8],
      ['setDate', 13],
      [
        'closestToNow',
        [['if', { afterNow: [['addYears', -1]] }]],
        [['if', { beforeNow: [['addYears', 1]] }]],
      ],
      ['setHours', 8],
      ['setMinutes', 25],
      ['startOfMinute'],
    ],
  ],
  today: [['startOfDay'], ['makeInterval', ['addDays', 1]]],
  'today at 3pm': [['setHours', 15], ['startOfHour']],
  yesterday: [
    ['addDays', -1],
    ['startOfDay'],
    ['makeInterval', ['addDays', 1]],
  ],
  'day before yesterday': [
    ['addDays', -2],
    ['startOfDay'],
    ['makeInterval', ['addDays', 1]],
  ],
  'the day before yesterday': { ref: 'day before yesterday' },
  'yesterday at 3pm': [['addDays', -1], ['setHours', 15], ['startOfHour']],
  'day before yesterday at 3pm': [
    ['addDays', -2],
    ['setHours', 15],
    ['startOfHour'],
  ],
  'the day before yesterday at 3pm': { ref: 'day before yesterday at 3pm' },
  tomorrow: [['addDays', 1], ['startOfDay'], ['makeInterval', ['addDays', 1]]],
  'day after tomorrow': [
    ['addDays', 2],
    ['startOfDay'],
    ['makeInterval', ['addDays', 1]],
  ],
  'the day after tomorrow': { ref: 'day after tomorrow' },
  'tomorrow at 3pm': [['addDays', 1], ['setHours', 15], ['startOfHour']],
  'day after tomorrow at 3pm': [
    ['addDays', 2],
    ['setHours', 15],
    ['startOfHour'],
  ],
  'the day after tomorrow at 3pm': { ref: 'day after tomorrow at 3pm' },
  'today until tomorrow': [
    ['startOfDay'],
    ['makeInterval', ['now'], ['addDays', 1], ['startOfDay']],
  ],
  'today through tomorrow': [
    ['startOfDay'],
    ['makeInterval', ['now'], ['addDays', 1], ['startOfDay'], ['addDays', 1]],
  ],
  'yesterday at 4am through the day after tomorrow': [
    ['addDays', -1],
    ['setHours', 4],
    ['startOfHour'],
    ['makeInterval', ['now'], ['addDays', 2], ['startOfDay'], ['addDays', 1]],
  ],
  'a week ago': [['addWeeks', -1]],
  'an hour ago': [['addHours', -1]],
  '3 days ago': [['addDays', -3]],
  '3d2h1m ago': [
    ['addDays', -3],
    ['addHours', -2],
    ['addMinutes', -1],
  ],
  '3d 2h 1m ago': { ref: '3d2h1m ago' },
  '3 day 2 hr 1 min ago': { ref: '3d2h1m ago' },
  '3 day 2 hr 1 min in the past': { ref: '3d2h1m ago' },
  '3 day 2 hr 1 min before now': { ref: '3d2h1m ago' },
  '3 day 2 hr 1 min before present': { ref: '3d2h1m ago' },
  '3 day 2 hr 1 min before the present': { ref: '3d2h1m ago' },
  '3 day 2 hr 1 min before the present time': { ref: '3d2h1m ago' },
  '3 day 2 hr 1 min before present time': { ref: '3d2h1m ago' },
  '3 days, two hours and 1 minute ago': { ref: '3d2h1m ago' },
  '3d2h1m from now': [
    ['addDays', 3],
    ['addHours', 2],
    ['addMinutes', 1],
  ],
  '3d2h1m in the future': { ref: '3d2h1m from now' },
  'three days ago': { ref: '3 days ago' },
  'three days from now': [['addDays', 3]],
  'three days in the future': { ref: 'three days from now' },
  '1 day ago': [['addDays', -1]],
  'one day ago': { ref: '1 day ago' },
  'three days from now at 3pm': [
    ['addDays', 3],
    ['setHours', 15],
    ['startOfHour'],
  ],
  'this month': [['startOfMonth'], ['makeInterval', ['addMonths', 1]]],
  'last month': [
    ['addMonths', -1],
    ['startOfMonth'],
    ['makeInterval', ['addMonths', 1]],
  ],
  '1 month ago': [['addMonths', -1]],
  'a month ago': { ref: '1 month ago' },
  'one month ago': { ref: '1 month ago' },
  'month before last': [
    ['addMonths', -2],
    ['startOfMonth'],
    ['makeInterval', ['addMonths', 1]],
  ],
  'the month before last': { ref: 'month before last' },
  '2 months ago': [['addMonths', -2]],
  'two months ago': { ref: '2 months ago' },
  '3 months ago': [['addMonths', -3]],
  'three months ago': { ref: '3 months ago' },

  'next month': [
    ['addMonths', 1],
    ['startOfMonth'],
    ['makeInterval', ['addMonths', 1]],
  ],
  '1 month from now': [['addMonths', 1]],
  'one month from now': { ref: '1 month from now' },
  '1 month in the future': { ref: '1 month from now' },
  'one month in the future': { ref: '1 month from now' },
  'month after next': [
    ['addMonths', 2],
    ['startOfMonth'],
    ['makeInterval', ['addMonths', 1]],
  ],
  'the month after next': { ref: 'month after next' },
  '2 months from now': [['addMonths', 2]],
  'two months from now': { ref: '2 months from now' },
  '3 months from now': [['addMonths', 3]],
  'three months from now': { ref: '3 months from now' },
  'yesterday to two months from now': [
    ['addDays', -1],
    ['startOfDay'],
    ['makeInterval', ['now'], ['addMonths', 2]],
  ],
  'yesterday through two months from now': [
    ['addDays', -1],
    ['startOfDay'],
    ['makeInterval', ['now'], ['addMonths', 2]],
  ],
  'yesterday at 4pm to two hours later': [
    ['addDays', -1],
    ['setHours', 16],
    ['startOfHour'],
    ['makeInterval', ['addHours', 2]],
  ],
  'yesterday 4pm to 2h later': {
    ref: 'yesterday at 4pm to two hours later',
  },
  'yesterday at 4pm to two hours after that': {
    ref: 'yesterday at 4pm to two hours later',
  },
  'yesterday at 4pm to two hours thereafter': {
    ref: 'yesterday at 4pm to two hours later',
  },
  'yesterday at 4pm to two hours after then': {
    ref: 'yesterday at 4pm to two hours later',
  },
  'yesterday at 4pm to two hours after now': [
    ['addDays', -1],
    ['setHours', 16],
    ['startOfHour'],
    ['makeInterval', ['now'], ['addHours', 2]],
  ],
  'the day before yesterday at 2am until now': [
    ['addDays', -2],
    ['setHours', 2],
    ['startOfHour'],
    ['makeInterval', ['now']],
  ],
  'now until tomorrow': [
    ['now'],
    ['makeInterval', ['now'], ['addDays', 1], ['startOfDay']],
  ],
  'the past 3 months': [
    ['addMonths', -3],
    ['makeInterval', ['now']],
  ],
  'past 3 months': { ref: 'the past 3 months' },
  'last 3 months': { ref: 'the past 3 months' },
  'the last three months': { ref: 'the past 3 months' },
  'last three months': { ref: 'the past 3 months' },
  'the past 5 mins': [
    ['addMinutes', -5],
    ['makeInterval', ['now']],
  ],
  'past 5 mins': { ref: 'the past 5 mins' },
  'last 5 mins': { ref: 'the past 5 mins' },
  'the last five minutes': { ref: 'the past 5 mins' },
  'last five minutes': { ref: 'the past 5 mins' },
  'the past 3 months and 2 days': [
    ['addMonths', -3],
    ['addDays', -2],
    ['makeInterval', ['now']],
  ],
  'the next 3 months': [['makeInterval', ['addMonths', 3]]],
  'next 3 months': { ref: 'the next 3 months' },
  'the coming three months': { ref: 'the next 3 months' },
  'the next 3 months and 2 days': [
    ['makeInterval', ['addMonths', 3], ['addDays', 2]],
  ],
  'may 26 last year': [
    ['addYears', -1],
    ['setMonth', 4],
    ['setDate', 26],
    ['startOfDay'],
    ['makeInterval', ['addDays', 1]],
  ],
  'last year may 26': { ref: 'may 26 last year' },
  'may 26 this year': [
    ['setMonth', 4],
    ['setDate', 26],
    ['startOfDay'],
    ['makeInterval', ['addDays', 1]],
  ],
  'may 26 next year': [
    ['addYears', 1],
    ['setMonth', 4],
    ['setDate', 26],
    ['startOfDay'],
    ['makeInterval', ['addDays', 1]],
  ],
  'may 26 the year after next': [
    ['addYears', 2],
    ['setMonth', 4],
    ['setDate', 26],
    ['startOfDay'],
    ['makeInterval', ['addDays', 1]],
  ],
  'may 26 next year at 3pm': [
    ['addYears', 1],
    ['setMonth', 4],
    ['setDate', 26],
    ['setHours', 15],
    ['startOfHour'],
  ],
  '3pm may 26 next year': { ref: 'may 26 next year at 3pm' },
  '3pm on may 26 next year': { ref: 'may 26 next year at 3pm' },
  sunday: [
    ['setDay', 0],
    [
      'closestToNow',
      [['if', { afterNow: [['addWeeks', -1]] }]],
      [['if', { beforeNow: [['addWeeks', 1]] }]],
    ],
    ['startOfDay'],
    ['makeInterval', ['addDays', 1]],
  ],
  sun: { ref: 'sunday' },
  'last sunday': [
    ['setDay', 0],
    ['startOfDay'],
    ['addDays', 1],
    ['if', { afterNow: [['addWeeks', -1]] }],
    ['addDays', -1],
    ['makeInterval', ['addDays', 1]],
  ],
  'sunday before last': [
    ['setDay', 0],
    ['startOfDay'],
    ['addDays', 1],
    ['if', { afterNow: [['addWeeks', -1]] }],
    ['addDays', -1],
    ['addWeeks', -1],
    ['makeInterval', ['addDays', 1]],
  ],
  'last sun': { ref: 'last sunday' },
  'next sunday': [
    ['setDay', 0],
    ['startOfDay'],
    ['if', { beforeNow: [['addWeeks', 1]] }],
    ['makeInterval', ['addDays', 1]],
  ],
  'next sunday at 3pm': [
    ['setDay', 0],
    ['startOfDay'],
    ['if', { beforeNow: [['addWeeks', 1]] }],
    ['setHours', 15],
    ['startOfHour'],
  ],
  'sunday after next': [
    ['setDay', 0],
    ['startOfDay'],
    ['if', { beforeNow: [['addWeeks', 1]] }],
    ['addWeeks', 1],
    ['makeInterval', ['addDays', 1]],
  ],
  'week before last': [
    ['addWeeks', -2],
    ['startOfWeek'],
    ['makeInterval', ['addWeeks', 1]],
  ],
  'the week before last': { ref: 'week before last' },
  'last week': [
    ['addWeeks', -1],
    ['startOfWeek'],
    ['makeInterval', ['addWeeks', 1]],
  ],
  'next week': [
    ['addWeeks', 1],
    ['startOfWeek'],
    ['makeInterval', ['addWeeks', 1]],
  ],
  'last week through next week': [
    ['addWeeks', -1],
    ['startOfWeek'],
    [
      'makeInterval',
      ['now'],
      ['addWeeks', 1],
      ['startOfWeek'],
      ['addWeeks', 1],
    ],
  ],
  'last week through next month': [
    ['addWeeks', -1],
    ['startOfWeek'],
    [
      'makeInterval',
      ['now'],
      ['addMonths', 1],
      ['startOfMonth'],
      ['addMonths', 1],
    ],
  ],
  'the past week through next month': [
    ['addWeeks', -1],
    [
      'makeInterval',
      ['now'],
      ['addMonths', 1],
      ['startOfMonth'],
      ['addMonths', 1],
    ],
  ],
  'last week to next month': [
    ['addWeeks', -1],
    ['startOfWeek'],
    ['makeInterval', ['now'], ['addMonths', 1], ['startOfMonth']],
  ],
  'last year': [
    ['addYears', -1],
    ['startOfYear'],
    ['makeInterval', ['addYears', 1]],
  ],
  'next year': [
    ['addYears', 1],
    ['startOfYear'],
    ['makeInterval', ['addYears', 1]],
  ],
  'last hour': [
    ['addHours', -1],
    ['startOfHour'],
    ['makeInterval', ['addHours', 1]],
  ],
  'yesterday 3pm to 5pm': [
    ['addDays', -1],
    ['setHours', 15],
    ['startOfHour'],
    ['makeInterval', ['setHours', 17], ['startOfHour']],
  ],
  'yesterday 3pm through 5pm': [
    ['addDays', -1],
    ['setHours', 15],
    ['startOfHour'],
    ['makeInterval', ['setHours', 17], ['startOfHour']],
  ],
  'last june': [
    ['setMonth', 5],
    ['startOfMonth'],
    ['addMonths', 1],
    ['if', { afterNow: [['addYears', -1]] }],
    ['addMonths', -1],
    ['makeInterval', ['addMonths', 1]],
  ],
  'last jun': { ref: 'last june' },
  'june before last': [
    ['setMonth', 5],
    ['startOfMonth'],
    ['addMonths', 1],
    ['if', { afterNow: [['addYears', -1]] }],
    ['addMonths', -1],
    ['addYears', -1],
    ['makeInterval', ['addMonths', 1]],
  ],
  'next june': [
    ['setMonth', 5],
    ['startOfMonth'],
    ['if', { beforeNow: [['addYears', 1]] }],
    ['makeInterval', ['addMonths', 1]],
  ],
  'next jun': { ref: 'next june' },
  'june after next': [
    ['setMonth', 5],
    ['startOfMonth'],
    ['if', { beforeNow: [['addYears', 1]] }],
    ['addYears', 1],
    ['makeInterval', ['addMonths', 1]],
  ],
  'next jun 1': [
    ['setMonth', 5],
    ['startOfMonth'],
    ['if', { beforeNow: [['addYears', 1]] }],
    ['setDate', 1],
    ['startOfDay'],
    ['makeInterval', ['addDays', 1]],
  ],
  'next jun 1st': { ref: 'next jun 1' },
  'next jun 1st at 8pm': [
    ['setMonth', 5],
    ['startOfMonth'],
    ['if', { beforeNow: [['addYears', 1]] }],
    ['setDate', 1],
    ['setHours', 20],
    ['startOfHour'],
  ],
  'jun-aug last year': [
    ['addYears', -1],
    ['setMonth', 5],
    ['startOfMonth'],
    ['makeInterval', ['setMonth', 7], ['startOfMonth']],
  ],
  'jun-aug 2021': [
    ['setYear', 2021],
    ['setMonth', 5],
    ['startOfMonth'],
    ['makeInterval', ['setMonth', 7], ['startOfMonth']],
  ],
  'jun 1-aug 3 last year': [
    ['addYears', -1],
    ['setMonth', 5],
    ['setDate', 1],
    ['startOfDay'],
    ['makeInterval', ['setMonth', 7], ['setDate', 3], ['startOfDay']],
  ],
  '10/13/2024 12pm - now': [
    ['setYear', 2024],
    ['setMonth', 9],
    ['setDate', 13],
    ['setHours', 12],
    ['startOfHour'],
    ['makeInterval', ['now']],
  ],
  '10/13/2024 11am - now': [
    ['setYear', 2024],
    ['setMonth', 9],
    ['setDate', 13],
    ['setHours', 11],
    ['startOfHour'],
    ['makeInterval', ['now']],
  ],
  '10/13/2024 12am - now': [
    ['setYear', 2024],
    ['setMonth', 9],
    ['setDate', 13],
    ['setHours', 0],
    ['startOfHour'],
    ['makeInterval', ['now']],
  ],
  '10/13/2024 12am to now': { ref: '10/13/2024 12am - now' },
  '10-13-2024 12am to now': { ref: '10/13/2024 12am - now' },
  '2024/10/13 12am - now': { ref: '10/13/2024 12am - now' },
  '2024/10/13 12am to now': { ref: '10/13/2024 12am - now' },
}

export const supportedValues = Object.keys(parseTestcases)
  .filter((value) => parseTestcases[value] !== 'error')
  .sort()

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
  stats: {
    shifts: number;
    nights: number;
    weekends: number;
    fairness: number;
    coverage: number;
  };
}

export interface UncoveredShift {
  id: string;
  title: string;
  date: string;
  time: string;
}

export const INITIAL_TEAM_MEMBERS: TeamMember[] = [
  {
    id: "1",
    name: "מיכל אברהם",
    role: "אחות אחראית",
    avatar: "מ",
    stats: { shifts: 22, nights: 7, weekends: 7, fairness: 88, coverage: 85 },
  },
  {
    id: "2",
    name: "דני כהן",
    role: "אח מוסמך",
    avatar: "ד",
    stats: { shifts: 23, nights: 8, weekends: 7, fairness: 92, coverage: 88 },
  },
  {
    id: "3",
    name: "שרה לוי",
    role: "אחות",
    avatar: "ש",
    stats: { shifts: 23, nights: 8, weekends: 7, fairness: 85, coverage: 88 },
  },
  {
    id: "4",
    name: "יוסי אברהם",
    role: "אח",
    avatar: "י",
    stats: { shifts: 23, nights: 8, weekends: 8, fairness: 95, coverage: 88 },
  },
  {
    id: "5",
    name: "רחל דוד",
    role: "אחות",
    avatar: "ר",
    stats: { shifts: 23, nights: 9, weekends: 8, fairness: 72, coverage: 88 },
  },
  {
    id: "6",
    name: "אלון מזרחי",
    role: "אח",
    avatar: "א",
    stats: { shifts: 23, nights: 8, weekends: 8, fairness: 92, coverage: 88 },
  },
  {
    id: "7",
    name: "עדי לוי",
    role: "אחות",
    avatar: "ע",
    stats: { shifts: 23, nights: 7, weekends: 8, fairness: 90, coverage: 88 },
  },
  {
    id: "8",
    name: "עומר גולן",
    role: "אח",
    avatar: "ע",
    stats: { shifts: 23, nights: 8, weekends: 8, fairness: 86, coverage: 88 },
  },
];

export const INITIAL_UNCOVERED_SHIFTS: UncoveredShift[] = [
  { id: "u1", title: "משמרת ערב", date: "15/03/2026", time: "15:00 - 23:00" },
  { id: "u2", title: "משמרת לילה", date: "20/03/2026", time: "23:00 - 07:00" },
  { id: "u3", title: "משמרת בוקר", date: "25/03/2026", time: "07:00 - 15:00" },
];

export const WEEKENDS = [2, 3, 9, 10, 16, 17, 23, 24, 30, 31];

export function getWeekends(month: number, year: number) {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const weekends: number[] = [];
  for (let d = 1; d <= daysInMonth; d++) {
    const dayOfWeek = new Date(year, month, d).getDay();
    if (dayOfWeek === 5 || dayOfWeek === 6) weekends.push(d);
  }
  return weekends;
}

export function getWeek(d: number) {
  return Math.ceil(d / 7);
}

export function calculateFairness(stats: TeamMember["stats"], memberShifts: { day: number; type: string }[]) {
  let score = 100;
  // Avg nights/month approximation (assuming ~30 days)
  // ... no change to logic ...
  const avgNights = 186 / (8 * 3);
  const nightPenalty = Math.max(0, (stats.nights - 7.75) * 4);
  score -= nightPenalty;
  const weekendPenalty = Math.max(0, (stats.weekends - 7) * 3);
  score -= weekendPenalty;
  let consecutiveNights = 0;
  const sortedShifts = [...memberShifts].sort((a, b) => a.day - b.day);
  for (let i = 0; i < sortedShifts.length - 1; i++) {
    if (sortedShifts[i].type === "night" && sortedShifts[i + 1].type === "night" && sortedShifts[i + 1].day === sortedShifts[i].day + 1) {
      consecutiveNights++;
    }
  }
  score -= consecutiveNights * 10;
  return Math.min(100, Math.max(0, Math.round(score)));
}

export function generateAllShifts(teamMembers: TeamMember[], uncoveredShifts: UncoveredShift[], month: number = 0, year: number = 2026) {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const weekends = getWeekends(month, year);
  const monthStr = (month + 1).toString().padStart(2, '0');

  const allShifts: { day: number; memberName: string; type: string; title: string; time: string }[] = [];
  const slots: Record<string, string[]> = {};
  for (let day = 1; day <= daysInMonth; day++) {
    ["morning", "evening", "night"].forEach(type => {
      slots[`${day}-${type}`] = [];
    });
  }
  const memberAssignments: Record<string, Set<number>> = {};
  teamMembers.forEach(m => memberAssignments[m.id] = new Set());

  const canMemberWork = (member: TeamMember, day: number) => {
    if (memberAssignments[member.id].has(day)) return false;
    const week = getWeek(day);
    let shiftsInWeek = 0;
    memberAssignments[member.id].forEach(d => {
      if (getWeek(d) === week) shiftsInWeek++;
    });
    return shiftsInWeek < 6;
  };

  const canDoNight = (member: TeamMember, day: number) => {
    const prevKey = `${day - 1}-night`;
    if (slots[prevKey] && slots[prevKey].includes(member.name)) return false;
    const nextKey = `${day + 1}-night`;
    if (slots[nextKey] && slots[nextKey].includes(member.name)) return false;
    return true;
  };

  const memberQuotas = teamMembers.map(m => ({
    ...m,
    nightsLeft: m.stats.nights,
    weekendsLeft: m.stats.weekends,
    totalLeft: m.stats.shifts
  }));

  weekends.forEach(day => {
    ["morning", "evening", "night"].forEach(type => {
      const slotKey = `${day}-${type}`;
      const dateStr = `${day.toString().padStart(2, '0')}/${monthStr}/${year}`;
      const missingAssignments = uncoveredShifts.filter(u => u.date === dateStr && (
        (type === "morning" && u.title.includes("בוקר")) || 
        (type === "evening" && u.title.includes("ערב")) ||
        (type === "night" && u.title.includes("לילה"))
      )).length;
      const maxPeople = Math.max(0, 2 - missingAssignments);
      const sortedByWeekends = [...memberQuotas].sort((a, b) => b.weekendsLeft - a.weekendsLeft);
      sortedByWeekends.forEach(mq => {
        if (type === "night" && !canDoNight(mq, day)) return;
        if (slots[slotKey].length < maxPeople && mq.weekendsLeft > 0 && mq.totalLeft > 0 && canMemberWork(mq, day)) {
          slots[slotKey].push(mq.name);
          mq.weekendsLeft--;
          mq.totalLeft--;
          memberAssignments[mq.id].add(day);
          if (type === "night") mq.nightsLeft--;
        }
      });
    });
  });

  for (let day = 1; day <= daysInMonth; day++) {
    if (weekends.includes(day)) continue;
    const type = "night";
    const slotKey = `${day}-${type}`;
    const dateStr = `${day.toString().padStart(2, '0')}/${monthStr}/${year}`;
    const missingAssignments = uncoveredShifts.filter(u => u.date === dateStr && u.title.includes("לילה")).length;
    const maxPeople = Math.max(0, 2 - missingAssignments);
    const sortedForNights = [...memberQuotas].sort((a, b) => b.nightsLeft - a.nightsLeft);
    sortedForNights.forEach(mq => {
      if (!canDoNight(mq, day)) return;
      if (slots[slotKey].length < maxPeople && mq.nightsLeft > 0 && mq.totalLeft > 0 && canMemberWork(mq, day)) {
        slots[slotKey].push(mq.name);
        mq.nightsLeft--;
        mq.totalLeft--;
        memberAssignments[mq.id].add(day);
      }
    });
  }

  for (let day = 1; day <= daysInMonth; day++) {
    if (weekends.includes(day)) continue;
    ["morning", "evening"].forEach(type => {
      const slotKey = `${day}-${type}`;
      const dateStr = `${day.toString().padStart(2, '0')}/${monthStr}/${year}`;
      const missingAssignments = uncoveredShifts.filter(u => u.date === dateStr && (
        (type === "morning" && u.title.includes("בוקר")) || 
        (type === "evening" && u.title.includes("ערב"))
      )).length;
      const maxPeople = Math.max(0, 2 - missingAssignments);
      const sortedByTotal = [...memberQuotas].sort((a, b) => b.totalLeft - a.totalLeft);
      sortedByTotal.forEach(mq => {
        if (slots[slotKey].length < maxPeople && mq.totalLeft > 0 && canMemberWork(mq, day)) {
          slots[slotKey].push(mq.name);
          mq.totalLeft--;
          memberAssignments[mq.id].add(day);
        }
      });
    });
  }

  for (let day = 1; day <= daysInMonth; day++) {
    ["morning", "evening", "night"].forEach(type => {
      const slotKey = `${day}-${type}`;
      const dateStr = `${day.toString().padStart(2, '0')}/${monthStr}/${year}`;
      const missingAssignments = uncoveredShifts.filter(u => u.date === dateStr && (
        (type === "morning" && u.title.includes("בוקר")) || 
        (type === "evening" && u.title.includes("ערב")) ||
        (type === "night" && u.title.includes("לילה"))
      )).length;
      const maxPeople = Math.max(0, 2 - missingAssignments);
      if (slots[slotKey].length < maxPeople) {
        const availableMembers = [...memberQuotas].sort((a, b) => b.totalLeft - a.totalLeft);
        for (const mq of availableMembers) {
          if (type === "night" && !canDoNight(mq, day)) continue;
          if (slots[slotKey].length < maxPeople && canMemberWork(mq, day)) {
            slots[slotKey].push(mq.name);
            mq.totalLeft--;
            memberAssignments[mq.id].add(day);
            if (type === "night") mq.nightsLeft--;
            if (weekends.includes(day)) mq.weekendsLeft--;
            if (slots[slotKey].length === maxPeople) break;
          }
        }
      }
    });
  }

  Object.entries(slots).forEach(([key, memberNames]) => {
    const [dayStr, type] = key.split("-");
    const day = parseInt(dayStr);
    const title = type === "morning" ? (weekends.includes(day) ? "בוקר (סופ״ש)" : "משמרת בוקר") : 
                  type === "evening" ? "משמרת ערב" : "משמרת לילה";
    const time = type === "morning" ? "07:00 - 15:00" : 
                 type === "evening" ? "15:00 - 23:00" : "23:00 - 07:00";
    memberNames.forEach(memberName => {
      allShifts.push({ day, memberName, type, title, time });
    });
  });

  return allShifts;
}

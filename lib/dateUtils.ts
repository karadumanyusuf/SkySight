export function formatDateInLanguage(date: Date, t: (key: string) => string): string {
  const dayNames = {
    0: t("days.sunday"),
    1: t("days.monday"),
    2: t("days.tuesday"),
    3: t("days.wednesday"),
    4: t("days.thursday"),
    5: t("days.friday"),
    6: t("days.saturday"),
  }

  const monthNames = {
    0: t("months.january"),
    1: t("months.february"),
    2: t("months.march"),
    3: t("months.april"),
    4: t("months.may"),
    5: t("months.june"),
    6: t("months.july"),
    7: t("months.august"),
    8: t("months.september"),
    9: t("months.october"),
    10: t("months.november"),
    11: t("months.december"),
  }

  const dayName = dayNames[date.getDay() as keyof typeof dayNames]
  const monthName = monthNames[date.getMonth() as keyof typeof monthNames]
  const day = date.getDate()

  return `${dayName}, ${day} ${monthName}`
}

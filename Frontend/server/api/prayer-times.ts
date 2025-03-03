interface PrayerTimes {
  schedules: {
    shubuh: string;
    dzuhur: string;
    ashr: string;
    maghrib: string;
    isya: string;
  };
}

export default defineEventHandler(async (event) => {
  try {
    // Untuk sementara return data statis
    // TODO: Integrate dengan API jadwal sholat
    return {
      schedules: {
        shubuh: "04:42",
        dzuhur: "12:07",
        ashr: "15:11",
        maghrib: "18:13",
        isya: "19:23",
      },
    };
  } catch (error) {
    console.error("Error fetching prayer times:", error);
    throw createError({
      statusCode: 500,
      message: "Failed to fetch prayer times",
    });
  }
});

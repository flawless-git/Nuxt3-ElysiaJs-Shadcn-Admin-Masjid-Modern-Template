export interface SummaryResponse {
  date: string;
  income: {
    categories: Record<
      string,
      {
        categoryName: string;
        total: number;
        transactions: any[];
      }
    >;
    total: number;
  };
  expense: {
    categories: Record<
      string,
      {
        categoryName: string;
        total: number;
        transactions: any[];
      }
    >;
    total: number;
  };
  currentBalance: number;
}

export interface Transaction {
  id: number;
  amount: number;
  description: string;
  createdAt: string;
  categoryId: number;
  category: string;
}

export interface PrayerTimes {
  schedules: {
    shubuh: string;
    dzuhur: string;
    ashr: string;
    maghrib: string;
    isya: string;
  };
}

export interface KhatibSchedule {
  id: number;
  name: string;
  description: string;
  date: string;
  title: string;
}

export interface KajianSchedule {
  id: number;
  name: string;
  description: string;
  date: string;
  title: string;
}

export interface Logo {
  id: number;
  name: string;
  path: string;
}

export type LoginRequest = {
  email: string; // This will hold either email or username
  password: string;
};

export interface Category {
  id: number;
  name: string;
  description: string;
}

export type Image = {
  id: number;
  name: string;
  path: string;
  createdAt: string;
  updatedAt: string;
};

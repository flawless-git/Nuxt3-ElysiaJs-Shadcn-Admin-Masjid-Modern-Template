import { Elysia, t } from "elysia";
import { swagger } from "@elysiajs/swagger";
import { db } from "./db";
import {
  cashFlowTable,
  categoryTable,
  usersTable,
  balanceTable,
  khatibScheduleTable,
  kajianTable,
  imageTable,
} from "./db/schema";
import { eq, and, desc, or } from "drizzle-orm";
import { sql } from "drizzle-orm";
import { compare, hash } from "bcrypt";
import { unlink } from "node:fs/promises";
import { join } from "path";
import { mkdir } from "node:fs/promises";
import { config } from "./config";
import { staticPlugin } from "@elysiajs/static";

// Auth routes
const auth = new Elysia({ prefix: "/auth" })
  .post(
    "/register",
    async ({ body }) => {
      // Hash password
      const hashedPassword = await hash(body.password, 10);

      // Create user with hashed password
      const [user] = await db
        .insert(usersTable)
        .values({
          ...body,
          password: hashedPassword,
        })
        .returning({
          id: usersTable.id,
          username: usersTable.username,
          email: usersTable.email,
        });

      return user;
    },
    {
      body: t.Object({
        username: t.String({ description: "Username pengguna" }),
        email: t.String({ description: "Email pengguna" }),
        password: t.String({ description: "Password pengguna" }),
      }),
    }
  )
  .post(
    "/login",
    async ({ body }) => {
      // Find user by username or email
      const [user] = await db
        .select()
        .from(usersTable)
        .where(
          or(
            body.username ? eq(usersTable.username, body.username) : undefined,
            body.email ? eq(usersTable.email, body.email) : undefined
          )
        )
        .limit(1);

      if (!user) {
        throw new Error("Username/email atau password salah");
      }

      // Verify password
      const validPassword = await compare(body.password, user.password);
      if (!validPassword) {
        throw new Error("Username/email atau password salah");
      }

      return {
        id: user.id,
        username: user.username,
        email: user.email,
      };
    },
    {
      body: t.Object({
        username: t.Optional(t.String({ description: "Username pengguna" })),
        email: t.Optional(t.String({ description: "Email pengguna" })),
        password: t.String({ description: "Password pengguna" }),
      }),
      response: t.Object({
        id: t.Number(),
        username: t.String(),
        email: t.String(),
      }),
    }
  );

// Category routes
const categories = new Elysia({ prefix: "/categories" })
  .get("/", async () => {
    return await db.select().from(categoryTable);
  })
  .post(
    "/",
    async ({ body }) => {
      const category = await db.insert(categoryTable).values(body).returning();
      return category[0];
    },
    {
      body: t.Object({
        name: t.String({ description: "Nama kategori" }),
        description: t.Optional(
          t.String({ description: "Deskripsi kategori" })
        ),
      }),
    }
  )
  .put(
    "/:id",
    async ({ params, body }) => {
      const [updated] = await db
        .update(categoryTable)
        .set(body)
        .where(eq(categoryTable.id, params.id))
        .returning();

      if (!updated) {
        throw new Error("Kategori tidak ditemukan");
      }

      return updated;
    },
    {
      params: t.Object({
        id: t.Numeric({ description: "ID kategori" }),
      }),
      body: t.Object({
        name: t.String({ description: "Nama kategori" }),
        description: t.Optional(
          t.String({ description: "Deskripsi kategori" })
        ),
      }),
    }
  )
  .delete(
    "/:id",
    async ({ params }) => {
      const [deleted] = await db
        .delete(categoryTable)
        .where(eq(categoryTable.id, params.id))
        .returning();

      if (!deleted) {
        throw new Error("Kategori tidak ditemukan");
      }
      return deleted;
    },
    {
      params: t.Object({
        id: t.Numeric({ description: "ID kategori" }),
      }),
    }
  );

// Balance routes
const balance = new Elysia({ prefix: "/balance" })
  .get("/", async () => {
    return await db.select().from(balanceTable);
  })
  .post(
    "/initialize",
    async ({ body }) => {
      const [balance] = await db
        .insert(balanceTable)
        .values({
          amount: body.amount,
          updatedAt: new Date(),
        })
        .returning();
      return balance;
    },
    {
      body: t.Object({
        amount: t.Number({ description: "Saldo awal" }),
      }),
    }
  );

// Transaction routes
const transactions = new Elysia({ prefix: "/transactions" })
  .get("/", async () => {
    return await db
      .select({
        id: cashFlowTable.id,
        createdAt: cashFlowTable.createdAt,
        amount: cashFlowTable.amount,
        description: cashFlowTable.description,
        category: categoryTable.name,
        balance: balanceTable.amount,
      })
      .from(cashFlowTable)
      .innerJoin(categoryTable, eq(cashFlowTable.categoryId, categoryTable.id))
      .innerJoin(balanceTable, eq(cashFlowTable.balanceId, balanceTable.id));
  })
  .post(
    "/",
    async ({ body }) => {
      // Check if user exists
      const user = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.id, body.userId))
        .limit(1);

      if (!user.length) {
        throw new Error("User not found");
      }

      // Get current balance
      const [currentBalance] = await db
        .select()
        .from(balanceTable)
        .orderBy(balanceTable.updatedAt, desc(balanceTable.updatedAt))
        .limit(1);

      if (!currentBalance) {
        throw new Error("Balance belum diinisialisasi");
      }

      // Update existing balance
      const [updatedBalance] = await db
        .update(balanceTable)
        .set({
          amount: currentBalance.amount + body.amount,
          updatedAt: new Date(),
        })
        .where(eq(balanceTable.id, currentBalance.id))
        .returning();

      // Create transaction
      const [transaction] = await db
        .insert(cashFlowTable)
        .values({
          amount: body.amount,
          description: body.description,
          userId: body.userId,
          categoryId: body.categoryId,
          balanceId: currentBalance.id,
        })
        .returning();

      return {
        transaction,
        previousBalance: currentBalance.amount,
        currentBalance: updatedBalance.amount,
      };
    },
    {
      body: t.Object({
        amount: t.Number({
          description: "Jumlah uang (positif=tambah, negatif=kurang)",
        }),
        description: t.String({ description: "Keterangan transaksi" }),
        userId: t.Number({ description: "ID pengguna yang membuat transaksi" }),
        categoryId: t.Number({ description: "ID kategori transaksi" }),
      }),
    }
  )
  .put(
    "/:id",
    async ({ params, body }) => {
      // Get current transaction
      const [currentTransaction] = await db
        .select()
        .from(cashFlowTable)
        .where(eq(cashFlowTable.id, params.id))
        .limit(1);

      if (!currentTransaction) {
        throw new Error("Transaksi tidak ditemukan");
      }

      // Get current balance
      const [currentBalance] = await db
        .select()
        .from(balanceTable)
        .where(eq(balanceTable.id, currentTransaction.balanceId))
        .limit(1);

      if (!currentBalance) {
        throw new Error("Balance tidak ditemukan");
      }

      // Calculate balance adjustment
      const balanceAdjustment = body.amount - currentTransaction.amount;
      const newBalance = currentBalance.amount + balanceAdjustment;

      // Update balance
      const [updatedBalance] = await db
        .update(balanceTable)
        .set({
          amount: newBalance,
          updatedAt: new Date(),
        })
        .where(eq(balanceTable.id, currentBalance.id))
        .returning();

      // Update transaction
      const [transaction] = await db
        .update(cashFlowTable)
        .set({
          amount: body.amount,
          description: body.description,
          categoryId: body.categoryId,
        })
        .where(eq(cashFlowTable.id, params.id))
        .returning();

      return {
        transaction,
        previousBalance: currentBalance.amount,
        currentBalance: updatedBalance.amount,
      };
    },
    {
      params: t.Object({
        id: t.Numeric({ description: "ID transaksi" }),
      }),
      body: t.Object({
        amount: t.Number({
          description: "Jumlah uang (positif=tambah, negatif=kurang)",
        }),
        description: t.String({ description: "Keterangan transaksi" }),
        categoryId: t.Number({ description: "ID kategori transaksi" }),
      }),
    }
  )
  .delete(
    "/:id",
    async ({ params }) => {
      // Get current transaction
      const [currentTransaction] = await db
        .select()
        .from(cashFlowTable)
        .where(eq(cashFlowTable.id, params.id))
        .limit(1);

      if (!currentTransaction) {
        throw new Error("Transaksi tidak ditemukan");
      }

      // Get and update balance
      const [currentBalance] = await db
        .select()
        .from(balanceTable)
        .where(eq(balanceTable.id, currentTransaction.balanceId))
        .limit(1);

      if (!currentBalance) {
        throw new Error("Balance tidak ditemukan");
      }

      // Reverse the transaction amount
      const [updatedBalance] = await db
        .update(balanceTable)
        .set({
          amount: currentBalance.amount - currentTransaction.amount,
          updatedAt: new Date(),
        })
        .where(eq(balanceTable.id, currentBalance.id))
        .returning();

      // Delete transaction
      const [deleted] = await db
        .delete(cashFlowTable)
        .where(eq(cashFlowTable.id, params.id))
        .returning();

      return {
        transaction: deleted,
        previousBalance: currentBalance.amount,
        currentBalance: updatedBalance.amount,
      };
    },
    {
      params: t.Object({
        id: t.Numeric({ description: "ID transaksi" }),
      }),
    }
  );

// Summary routes
const summary = new Elysia({ prefix: "/summary" }).get("/", async () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const transactions = await db
    .select({
      id: cashFlowTable.id,
      createdAt: cashFlowTable.createdAt,
      amount: cashFlowTable.amount,
      description: cashFlowTable.description,
      categoryId: categoryTable.id,
      categoryName: categoryTable.name,
    })
    .from(cashFlowTable)
    .innerJoin(categoryTable, eq(cashFlowTable.categoryId, categoryTable.id))
    .where(sql`DATE(${cashFlowTable.createdAt}) = DATE(${today})`);

  // Separate income and expense transactions
  const incomeTransactions = transactions.filter((t) => t.amount > 0);
  const expenseTransactions = transactions.filter((t) => t.amount < 0);

  // Group income by category
  const incomeByCategory = incomeTransactions.reduce(
    (acc, transaction) => {
      const categoryId = transaction.categoryId;
      if (!acc[categoryId]) {
        acc[categoryId] = {
          categoryName: transaction.categoryName,
          total: 0,
          transactions: [],
        };
      }
      acc[categoryId].total += transaction.amount;
      acc[categoryId].transactions.push({
        id: transaction.id,
        date: transaction.createdAt,
        amount: transaction.amount,
        description: transaction.description,
      });
      return acc;
    },
    {} as Record<
      number,
      {
        categoryName: string;
        total: number;
        transactions: Array<{
          id: number;
          date: Date;
          amount: number;
          description: string;
        }>;
      }
    >
  );

  // Group expense by category
  const expenseByCategory = expenseTransactions.reduce(
    (acc, transaction) => {
      const categoryId = transaction.categoryId;
      if (!acc[categoryId]) {
        acc[categoryId] = {
          categoryName: transaction.categoryName,
          total: 0,
          transactions: [],
        };
      }
      acc[categoryId].total += Math.abs(transaction.amount); // Convert to positive
      acc[categoryId].transactions.push({
        id: transaction.id,
        date: transaction.createdAt,
        amount: Math.abs(transaction.amount), // Convert to positive
        description: transaction.description,
      });
      return acc;
    },
    {} as Record<
      number,
      {
        categoryName: string;
        total: number;
        transactions: Array<{
          id: number;
          date: Date;
          amount: number;
          description: string;
        }>;
      }
    >
  );

  // Calculate totals
  const totalIncome = incomeTransactions.reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = Math.abs(
    expenseTransactions.reduce((sum, t) => sum + t.amount, 0)
  );

  // Get current balance
  const [currentBalance] = await db
    .select()
    .from(balanceTable)
    .orderBy(balanceTable.updatedAt, desc(balanceTable.updatedAt))
    .limit(1);

  return {
    date: today,
    income: {
      categories: incomeByCategory,
      total: totalIncome,
    },
    expense: {
      categories: expenseByCategory,
      total: totalExpense,
    },
    currentBalance: currentBalance?.amount || 0,
  };
});

// Khatib Schedule routes
const khatibSchedule = new Elysia({ prefix: "/khatib" })
  .get("/", async () => {
    return await db.select().from(khatibScheduleTable);
  })
  .post(
    "/",
    async ({ body }) => {
      const schedule = await db
        .insert(khatibScheduleTable)
        .values(body)
        .returning();
      return schedule[0];
    },
    {
      body: t.Object({
        name: t.String({ description: "Nama khatib" }),
        description: t.Optional(
          t.String({ description: "Deskripsi tambahan" })
        ),
        date: t.String({ description: "Tanggal khotbah (YYYY-MM-DD)" }),
        title: t.String({ description: "Judul khotbah" }),
      }),
    }
  )
  .put(
    "/:id",
    async ({ params, body }) => {
      const [updated] = await db
        .update(khatibScheduleTable)
        .set({
          ...body,
          date: body.date,
        })
        .where(eq(khatibScheduleTable.id, params.id))
        .returning();

      if (!updated) {
        throw new Error("Jadwal khatib tidak ditemukan");
      }

      return updated;
    },
    {
      params: t.Object({
        id: t.Numeric({ description: "ID jadwal khatib" }),
      }),
      body: t.Object({
        name: t.String({ description: "Nama khatib" }),
        description: t.Optional(
          t.String({ description: "Deskripsi tambahan" })
        ),
        date: t.String({ description: "Tanggal khotbah (YYYY-MM-DD)" }),
        title: t.String({ description: "Judul khotbah" }),
      }),
    }
  )
  .delete(
    "/:id",
    async ({ params }) => {
      const [deleted] = await db
        .delete(khatibScheduleTable)
        .where(eq(khatibScheduleTable.id, params.id))
        .returning();

      if (!deleted) {
        throw new Error("Jadwal khatib tidak ditemukan");
      }
      return deleted;
    },
    {
      params: t.Object({
        id: t.Numeric({ description: "ID jadwal khatib" }),
      }),
    }
  );

// Kajian routes
const kajian = new Elysia({ prefix: "/kajian" })
  .get("/", async () => {
    return await db.select().from(kajianTable);
  })
  .post(
    "/",
    async ({ body }) => {
      const kajian = await db.insert(kajianTable).values(body).returning();
      return kajian[0];
    },
    {
      body: t.Object({
        name: t.String({ description: "Nama pemateri" }),
        description: t.Optional(t.String({ description: "Deskripsi kajian" })),
        date: t.String({ description: "Tanggal kajian (YYYY-MM-DD)" }),
        title: t.String({ description: "Judul kajian" }),
      }),
    }
  )
  .put(
    "/:id",
    async ({ params, body }) => {
      const [updated] = await db
        .update(kajianTable)
        .set({
          ...body,
          date: body.date,
        })
        .where(eq(kajianTable.id, params.id))
        .returning();

      if (!updated) {
        throw new Error("Jadwal kajian tidak ditemukan");
      }

      return updated;
    },
    {
      params: t.Object({
        id: t.Numeric({ description: "ID jadwal kajian" }),
      }),
      body: t.Object({
        name: t.String({ description: "Nama pemateri" }),
        description: t.Optional(t.String({ description: "Deskripsi kajian" })),
        date: t.String({ description: "Tanggal kajian (YYYY-MM-DD)" }),
        title: t.String({ description: "Judul kajian" }),
      }),
    }
  )
  .delete(
    "/:id",
    async ({ params }) => {
      const [deleted] = await db
        .delete(kajianTable)
        .where(eq(kajianTable.id, params.id))
        .returning();

      if (!deleted) {
        throw new Error("Jadwal kajian tidak ditemukan");
      }
      return deleted;
    },
    {
      params: t.Object({
        id: t.Numeric({ description: "ID jadwal kajian" }),
      }),
    }
  );

// Image routes (renamed from Logo)
const image = new Elysia({ prefix: "/image" })
  .get("/", async () => {
    return await db.select().from(imageTable);
  })
  .post(
    "/upload",
    async ({ body: { image, name } }) => {
      // Ensure upload directory exists
      await mkdir(config.upload.imageDir, { recursive: true });

      // Generate unique filename
      const fileName = `${Date.now()}-${image[0].name}`;
      const filePath = join(config.upload.imageDir, fileName);
      const fileUrl = `${config.upload.baseUrl}/image/${fileName}`;

      // Save file
      await Bun.write(filePath, image[0]);

      // Save to database
      const savedImage = await db
        .insert(imageTable)
        .values({
          name,
          path: fileUrl,
          updatedAt: new Date(),
        })
        .returning();

      return savedImage[0];
    },
    {
      body: t.Object({
        name: t.String({ description: "Nama gambar" }),
        image: t.Files({
          type: config.upload.allowedTypes,
          maxSize: config.upload.maxSize,
        }),
      }),
    }
  )
  .put(
    "/:id",
    async ({ params, body: { image, name } }) => {
      // Get current image
      const [currentImage] = await db
        .select()
        .from(imageTable)
        .where(eq(imageTable.id, params.id))
        .limit(1);

      if (!currentImage) {
        throw new Error("Gambar tidak ditemukan");
      }

      let fileUrl = currentImage.path;

      // If new image uploaded
      if (image) {
        // Delete old file
        try {
          const oldPath = join(
            config.upload.baseDir,
            currentImage.path.replace(config.upload.baseUrl, "")
          );
          await unlink(oldPath);
        } catch (error) {
          console.error("Error deleting file:", error);
        }

        // Save new file
        const fileName = `${Date.now()}-${image[0].name}`;
        const filePath = join(config.upload.imageDir, fileName);
        fileUrl = `${config.upload.baseUrl}/image/${fileName}`;

        await Bun.write(filePath, image[0]);
      }

      // Update database
      const [updated] = await db
        .update(imageTable)
        .set({
          name,
          path: fileUrl,
          updatedAt: new Date(),
        })
        .where(eq(imageTable.id, params.id))
        .returning();

      return updated;
    },
    {
      params: t.Object({
        id: t.Numeric({ description: "ID gambar" }),
      }),
      body: t.Object({
        name: t.String({ description: "Nama gambar" }),
        image: t.Optional(
          t.Files({
            type: config.upload.allowedTypes,
            maxSize: config.upload.maxSize,
          })
        ),
      }),
    }
  )
  .delete(
    "/:id",
    async ({ params }) => {
      const [image] = await db
        .select()
        .from(imageTable)
        .where(eq(imageTable.id, params.id))
        .limit(1);

      if (!image) {
        throw new Error("Gambar tidak ditemukan");
      }

      // Delete file
      try {
        const filePath = join(
          config.upload.baseDir,
          image.path.replace(config.upload.baseUrl, "")
        );
        await unlink(filePath);
      } catch (error) {
        console.error("Error deleting file:", error);
      }

      // Delete from database
      const [deleted] = await db
        .delete(imageTable)
        .where(eq(imageTable.id, params.id))
        .returning();

      return deleted;
    },
    {
      params: t.Object({
        id: t.Numeric({ description: "ID gambar" }),
      }),
    }
  );

// Main app
const app = new Elysia()
  .use(
    staticPlugin({
      prefix: "/public", // Match dengan config.upload.baseUrl
      assets: "public", // Match dengan config.upload.baseDir
    })
  )
  .use(
    swagger({
      documentation: {
        info: {
          title: "Masjid API",
          version: "1.0.0",
          description: "API untuk manajemen masjid",
        },
        tags: [
          { name: "Auth", description: "Autentikasi endpoints" },
          { name: "Categories", description: "Manajemen kategori" },
          { name: "Transactions", description: "Manajemen transaksi" },
          { name: "Summary", description: "Ringkasan keuangan" },
          { name: "Khatib", description: "Jadwal khatib jumat" },
          { name: "Kajian", description: "Jadwal kajian" },
          { name: "Image", description: "Manajemen gambar" },
        ],
      },
    })
  )
  .use(auth)
  .use(balance)
  .use(categories)
  .use(transactions)
  .use(summary)
  .use(khatibSchedule)
  .use(kajian)
  .use(image)
  .listen(1010);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);

import { db } from "./index";
import { usersTable, categoryTable, imageTable, balanceTable } from "./schema";
import { hash } from "bcrypt";
import { mkdir, copyFile } from "node:fs/promises";
import { join } from "path";
import { config } from "../config";

async function seed() {
  try {
    // Create admin user
    const hashedPassword = await hash("admin123", 10);
    const [admin] = await db
      .insert(usersTable)
      .values({
        username: "admin",
        email: "admin@masjid.com",
        password: hashedPassword,
        isAdmin: true,
      })
      .returning();

    console.log("✅ Admin user created:", admin);

    // Initialize balance
    const [balance] = await db
      .insert(balanceTable)
      .values({
        amount: 1000000, // Start with 0 balance
        updatedAt: new Date(),
      })
      .returning();

    console.log("✅ Balance initialized:", balance);

    // Create default categories
    const categories = await db
      .insert(categoryTable)
      .values([
        {
          name: "Pemasukan",
          description: "Kategori untuk semua jenis pemasukan kas masjid",
        },
        {
          name: "Pengeluaran",
          description: "Kategori untuk semua jenis pengeluaran kas masjid",
        },
      ])
      .returning();

    console.log("✅ Default categories created:", categories);

    // Ensure image directory exists
    await mkdir(config.upload.imageDir, { recursive: true });

    // Copy default images from assets
    const defaultImages = [
      {
        name: "Logo Utama",
        source: "assets/logo-1.png",
        target: "logo-1.png",
      },
      {
        name: "Logo Sekunder",
        source: "assets/logo-2.png",
        target: "logo-2.png",
      },
      {
        name: "Foto Banner",
        source: "assets/banner-1.png",
        target: "banner-1.png",
      },
    ];

    // Insert images to database
    const images = await db
      .insert(imageTable)
      .values(
        defaultImages.map((img) => ({
          name: img.name,
          path: `${config.upload.baseUrl}/image/${img.target}`,
          updatedAt: new Date(),
        }))
      )
      .returning();

    // Copy image files
    for (const img of defaultImages) {
      await copyFile(
        join(process.cwd(), img.source),
        join(config.upload.imageDir, img.target)
      );
    }

    console.log("✅ Default images created:", images);
  } catch (error) {
    console.error("❌ Seed error:", error);
  } finally {
    process.exit(0);
  }
}

seed();

@echo off
echo Starting Backend Development...

cd Backend
call bun i
call bun drizzle-kit push
call bun run seed
call bun run dev

cd .. 
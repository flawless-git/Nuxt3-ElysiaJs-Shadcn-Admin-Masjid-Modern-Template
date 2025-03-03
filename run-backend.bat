@echo off
echo Starting Backend Setup...

cd Backend

echo Installing dependencies...
call bun i

echo Running database migrations...
call bun drizzle-kit push

echo Seeding database...
call bun run seed

echo Building project...
call bun run build

echo Starting server...
server.exe

cd .. 
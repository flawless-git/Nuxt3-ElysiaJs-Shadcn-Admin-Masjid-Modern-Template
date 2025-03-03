@echo off
echo Starting Frontend Setup...

cd Frontend

echo Installing dependencies...
call pnpm i

echo Building project...
call pnpm build

echo Starting preview server...
call pnpm preview

cd .. 
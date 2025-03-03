export default defineEventHandler(async () => {
  const response = await $fetch("http://localhost:1010/kajian");
  return response;
});

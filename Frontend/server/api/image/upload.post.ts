export default defineEventHandler(async (event) => {
  const formData = await readMultipartFormData(event);
  console.log("Received form data:", formData);

  if (!formData) throw new Error("No form data");

  const file = formData.find((f) => f.name === "image");
  const name = formData.find((f) => f.name === "name")?.data.toString();

  if (!file || !name) {
    throw createError({
      statusCode: 400,
      message: "File and name are required",
    });
  }

  try {
    const apiFormData = new globalThis.FormData();
    apiFormData.append("name", name);
    apiFormData.append(
      "image",
      new Blob([file.data], { type: file.type }),
      file.filename
    );

    const response = await $fetch("http://localhost:1010/image/upload", {
      method: "POST",
      body: apiFormData,
    });

    console.log("Upload response:", response);
    return response;
  } catch (error: any) {
    console.error("Upload error:", error);
    throw createError({
      statusCode: error?.statusCode || 500,
      message: error?.message || "Failed to upload image",
    });
  }
});

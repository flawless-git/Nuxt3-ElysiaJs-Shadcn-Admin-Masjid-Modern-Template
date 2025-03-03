export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  const formData = await readMultipartFormData(event);

  if (!formData) throw new Error("No form data");

  const file = formData.find((f) => f.name === "image");
  const name = formData.find((f) => f.name === "name")?.data.toString();

  if (!name) {
    throw createError({
      statusCode: 400,
      message: "Name is required",
    });
  }

  try {
    const apiFormData = new globalThis.FormData();
    apiFormData.append("name", name);

    if (file) {
      apiFormData.append(
        "image",
        new Blob([file.data], { type: file.type }),
        file.filename
      );
    }

    const response = await $fetch(`http://localhost:1010/image/${id}`, {
      method: "PUT" as const,
      body: apiFormData,
    });

    return response;
  } catch (error: any) {
    throw createError({
      statusCode: error?.statusCode || 500,
      message: error?.message || "Failed to update image",
    });
  }
});

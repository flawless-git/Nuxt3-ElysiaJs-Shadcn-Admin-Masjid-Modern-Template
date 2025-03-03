<template>
  <ClientOnly>
    <div class="flex-1 flex items-center justify-center p-4">
      <Card class="w-[350px]">
        <CardHeader>
          <CardTitle>Login Admin</CardTitle>
          <CardDescription>
            Masukkan username/email dan password untuk login
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form @submit.prevent="handleSubmit" class="space-y-4">
            <div class="space-y-2">
              <Label for="identifier">Username / Email</Label>
              <Input
                id="identifier"
                v-model="form.email"
                type="text"
                placeholder="Masukkan username atau email"
                required
              />
            </div>
            <div class="space-y-2">
              <Label for="password">Password</Label>
              <Input
                id="password"
                v-model="form.password"
                type="password"
                placeholder="Masukkan password"
                required
              />
            </div>
            <Button type="submit" class="w-full" :loading="isLoading">
              {{ isLoading ? "Loading..." : "Login" }}
            </Button>
            <p v-if="error" class="text-red-500 text-sm">{{ error }}</p>
          </form>
        </CardContent>
      </Card>
    </div>
  </ClientOnly>
</template>

<script lang="ts" setup>
definePageMeta({
  layout: "auth",
  middleware: ["guest"],
});

const router = useRouter();
const { login, isLoading, error } = useAuth();

const form = ref({
  email: "",
  password: "",
});

const handleSubmit = async () => {
  try {
    const success = await login(form.value.email, form.value.password);
    if (success) {
      router.push("/admin");
    }
  } catch (error) {
    console.error("Login failed:", error);
  }
};
</script>

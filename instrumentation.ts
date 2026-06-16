export async function register() {
  // Skip if neither bootstrap nor seed env vars are set
  if (
    !process.env.ADMIN_BOOTSTRAP_EMAIL &&
    !process.env.ADMIN_BOOTSTRAP_PASSWORD &&
    !process.env.ADMIN_SEED_EMAIL &&
    !process.env.ADMIN_SEED_PASSWORD
  ) {
    return;
  }

  const { bootstrapSuperAdmin } = await import("@/server/lib/admin-bootstrap");
  await bootstrapSuperAdmin();
}

// Same fallback for everything
export function getJwtSecret() {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET er ikke satt i miljøvariabler!");
  }

  return secret;
}

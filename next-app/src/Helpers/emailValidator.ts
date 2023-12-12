export function emailValidator(email: string) {
  const re = /\S+@\S+\.\S+/;
  if (!email) return -1;
  if (!re.test(email)) return 0;
  return 1;
}

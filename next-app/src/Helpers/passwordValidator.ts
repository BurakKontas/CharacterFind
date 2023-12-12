export function passwordValidator(password: string) {
  if (!password) return -1;
  if (password.length < 8) return 0;
  return 1;
}

export default function generateToken(length: number): string {
  const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const array = new Uint32Array(length);
  crypto.getRandomValues(array);

  return Array.from(array, x => chars[x % chars.length]).join('');
}
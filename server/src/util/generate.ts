export function generatePrice(price: number): number {
  const min = -0.4
  const max = 0.4
  const deviation = Math.random() * (max - min) + min

  return Math.floor(price + price * deviation)
}

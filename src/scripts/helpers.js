export const roundDec = n => Math.round(n * 100) / 100
export const lerp = (a, b, n) => (1 - n) * a + n * b
export const mapColors = colors =>
  colors.map(pair => {
    const [bg, text] = pair.split(' ')
    return { bg, text }
  })

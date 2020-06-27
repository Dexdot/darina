export const roundDec = n => Math.round(n * 100) / 100
export const lerp = (a, b, n) => (1 - n) * a + n * b
export const mapColors = colors =>
  colors.map(pair => {
    const [bg, text] = pair.split(' ')
    return { bg, text }
  })

export const isImage = ({ fields }) =>
  fields.file.contentType.split('/')[0] === 'image'

export const isVideo = ({ fields }) =>
  fields.file.contentType.split('/')[0] === 'video'

export const isJPG = img =>
  isImage(img) && img.fields.file.contentType.split('/')[1] === 'jpeg'

const getSupports = () => {
  // FF
  const ffMatch = navigator.userAgent.match(/Firefox\/(.*)$/)
  let ffv = 0

  if (ffMatch && ffMatch.length > 1) {
    ffv = parseInt(ffMatch[1])
  }

  // WEBP
  const webp =
    (ffMatch && ffv >= 65) ||
    document
      .createElement('canvas')
      .toDataURL('image/webp')
      .indexOf('data:image/webp') == 0

  return {
    isMob: window.innerWidth <= 500,
    webp
  }
}

const encodeParams = data => {
  const ret = []
  for (let d in data)
    ret.push(encodeURIComponent(d) + '=' + encodeURIComponent(data[d]))
  return ret.join('&')
}

export const getImageUrl = img => {
  const supports = getSupports()
  const url = img.fields.file.url

  const fmfl = isJPG(img)
    ? {
        fm: supports.webp ? 'webp' : 'jpg',
        fl: supports.webp ? '' : 'progressive'
      }
    : {}

  const params = {
    ...fmfl,
    w: '',
    fit: supports.isMob ? 'fill' : ''
  }

  return `${url}?${encodeParams(params)}`
}

const contentful = require('contentful')

// Get keys
const space = process.env.VUE_APP_SPACE_ID
const accessToken = process.env.VUE_APP_ACCESS_TOKEN
const MAIN_CASES_ID = process.env.VUE_APP_MAIN_CASES_ID
const PALETTE_ID = process.env.VUE_APP_PALETTE_ID

// Client instance
const client = contentful.createClient({ accessToken, space })

export const fetchAbout = () =>
  new Promise(resolve => {
    // Get black
    client
      .getEntries({
        content_type: 'about'
      })
      .then(({ items }) => {
        resolve(items[0] ? items[0].fields : null)
      })
  })

export const fetchCase = slug =>
  new Promise(resolve => {
    // Get black
    client
      .getEntries({
        content_type: 'case',
        'fields.slug': slug
      })
      .then(({ items }) => {
        resolve(items[0] ? items[0].fields : null)
      })
  })

export const fetchPalette = () =>
  new Promise(resolve => {
    client.getEntry(PALETTE_ID).then(entry => {
      resolve(entry.fields.list)
    })
  })

export const fetchCases = ctx =>
  new Promise(resolve => {
    client.getEntry(MAIN_CASES_ID).then(entry => {
      ctx.$store.dispatch('addCases', entry.fields.list)
      resolve(entry.fields.list)
    })
  })

export const getCases = ctx =>
  new Promise(resolve => {
    const isStoreContainsCases =
      ctx.$store.getters.cases && ctx.$store.getters.cases.length > 0

    if (isStoreContainsCases) {
      resolve(ctx.$store.getters.cases)
    } else {
      fetchCases(ctx).then(cases => {
        resolve(cases)
      })
    }
  })

export const getCase = (ctx, slug) =>
  new Promise(resolve => {
    const projectFromStore = ctx.$store.getters.cases.find(
      el => el.fields.slug === 'slug'
    )

    if (projectFromStore) {
      resolve(projectFromStore)
    } else {
      fetchCase(slug).then(project => {
        resolve(project)
      })
    }
  })

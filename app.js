require('dotenv').config()

const fetch = require('node-fetch')

const { createClient } = require('@sanity/client')
const urlBuilder = require('@sanity/image-url')

const express = require('express')
const app = express()

this.assets = []

const path = require('path')

app.use(express.static(path.join(__dirname, 'public')))
app.set('views', path.join(__dirname, 'views'))

app.set('view engine', 'pug')

const endpoint = process.env.ENDPOINT
const projectId = process.env.PROJECT_ID
const dataset = process.env.DATASET
const apiVersion = process.env.API_VERSION

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true
})

const build = urlBuilder(client)

/*
  FUNCTIONS.
*/

const url = (query) =>
{
  return fetch(
    `${endpoint}${query}`
  )
    .then(
      (res) =>
        res.json()
    )
}

const linkResolver = doc =>
{
  switch(doc._type)
  {
    case 'work':
      return '/work'
      break
    case 'project':
      return `/project/${doc.slug}`
      break
    case 'info':
      return '/info'
      break
    default:
      return '/'
      break
  }
}

app.use((req, res, next) => {
  res.locals.Link = linkResolver
  res.locals.Build = build

  next()
})

const preloadAssets = async() =>
{
  const selected = await url(
    encodeURIComponent(
      `*[_type == "selected"]{
        image,
        smImage,
      }`
    )
  )

  selected.result.forEach(
    obj =>
    {
      let image = build.image(obj.image.asset._ref).url()

      if(!this.assets.includes(image))
        this.assets.push(image)

      let smImage = build.image(obj.smImage.asset._ref).url()

      if(!this.assets.includes(smImage))
        this.assets.push(smImage)
    }
  )

  const projects = await url(
    encodeURIComponent(
      `*[_type == "project"]{
        image,
        smImage
      }`
    )
  )

  projects.result.forEach(
    obj =>
    {
      let image = build.image(obj.image.asset._ref).url()

      if(!this.assets.includes(image))
        this.assets.push(image)

      let smImage = build.image(obj.smImage.asset._ref).url()

      if(!this.assets.includes(smImage))
        this.assets.push(smImage)
    }
  )

  const info = await url(
    encodeURIComponent(
      `*[_type == "info"]{
        image
      }`
    )
  )

  let infoMedia = build.image(info.result[0].image.asset._ref).url()

  if(!this.assets.includes(infoMedia))
    this.assets.push(infoMedia)
}

const handleReq = async(req) =>
{
  await preloadAssets()

  const meta = await url(
    encodeURIComponent(
      `*[_type == "metadata"]`
    )
  )

  const navigation = await url(
    encodeURIComponent(
      `*[_type == "navigation"]{
        ...,
        linkLeft->,
        linkRight->
      }`
    )
  )

  return {
    meta: meta.result[0],
    navigation: navigation.result[0],
    assets: this.assets
  }
}

app.get('/', async(req, res) =>
{
  const partials = await handleReq(req)
  const home = await url(
    encodeURIComponent(
      `*[_type == "home"]{
        ...,
        showcase[]->{
          _type,
          name,
          "image": image,
          "slug": slug.current,
          "smImage": smImage,
          title,
          description,
          linkText,
          link
        }
      }`
    )
  )

  res.render('pages/home', {
    ...partials,
    home: home.result[0]
  })
})

app.get('/work', async(req, res) =>
{
  const partials = await handleReq(req)
  const work = await url(
    encodeURIComponent(
      `*[_type == "work"]{
        ...,
        projects[]->{
          title,
          type,
          location,
          area,
          completion,
          description,
          image,
          smImage
        }
      }`
    )
  )

  res.render('pages/work', {
    ...partials,
    work: work.result[0]
  })
})

app.get('/info', async(req, res) =>
{
  const partials = await handleReq(req)
  const info = await url(
    encodeURIComponent(
      `*[_type == "info"]`
    )
  )

  res.render('pages/info', {
    ...partials,
    info: info.result[0]
  })
})

app.listen(process.env.PORT, () => { console.log(`Listening at port: ${ process.env.PORT }`)})
const sstk = require('shutterstock-api')
const Keyword = require('./models/Keyword')
const Photo = require('./models/Photo')
const schedule = require('node-schedule')
require('./db')
let count = 1
let page = 1
let keywords = [];
let step = -1
const applicationClientId = 'BOlGFXzNdcjBjpyElk9NQUtj2mzM34xA'
const applicationClientSecret = 'lola8BBfGxhc8G5I'
sstk.setBasicAuth(applicationClientId, applicationClientSecret)

const imagesApi = new sstk.ImagesApi()

let images = [];

// const getKeywords = async () => {
//   console.log("WAKE UP")
//   const queryParams = {
//     'language': 'es',
//   }
//
//   step++
//   if (images[step]) {
//     const data = await imagesApi.getImage(images[step].id, queryParams);
//     images[step].keywords = data.keywords
//   }
//   console.log("SLEEPING")
//   await sleep(2000)
//   console.log("SLEPT")
//   if (step < images.length) {
//     console.log(step)
//     await getKeywords(images)
//   }
// }
const getImages = async () => {
  const queryParams = {
    'per_page': 500,
    page: page,
    'query': keywords[count].name,
  }
  console.log("SEARCHING")
  const data = await imagesApi.searchImages(queryParams)
  console.log("SEARCHED", data)
  images = data.data.map(photo => {
    return {
      photo_id: photo.id,
      contributor: photo.contributor,
      aspect: photo.aspect,
      thumb: photo.assets.huge_thumb,
      description: photo.description,
      image_type: photo.image_type,
      category: keywords[count].name,
      keywords: []
    }
  })
  // await getKeywords();
}

function onInsert (err, docs) {
  if (err) {
    console.log(err)
  } else {
    console.log(docs)
    console.info('stores')
  }
}

// function sleep(time) {
//   return new Promise((resolve, reject) => {
//     setTimeout(resolve, time)
//   })
// }

const j = schedule.scheduleJob('*/5 * * * * *', async function () {
  keywords = await Keyword.find({})
  if (count < keywords.length) {
    console.log("FUCKED UP?")
    await getImages();
    Photo.collection.insertMany(images, {ordered: false}, onInsert)
    count += 1
    step = -1;
  } else {
    console.log("FUCKED UP? YES", count, keywords.length)
    page += 1
    count = 0
  }
})

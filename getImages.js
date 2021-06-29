const sstk = require('shutterstock-api')
const Keyword = require('./models/Keyword')
const Count = require('./models/Count')
const Photo = require('./models/Photo')
const schedule = require('node-schedule')
const process = require('process');
require('./db')
let count = 1
let page = 1
let keywords = [];
// let step = -1;
(async () => {
  const data = await Count.find({});
  if(data[0]) {
    page = parseInt(data[0].page)
    count = parseInt(data[0].keyword_step)
  }
})();
const applicationClientId = 'BOlGFXzNdcjBjpyElk9NQUtj2mzM34xA'
const applicationClientSecret = 'lola8BBfGxhc8G5I'
sstk.setBasicAuth(applicationClientId, applicationClientSecret)

const imagesApi = new sstk.ImagesApi()

let images = [];

function exitHandler(options, exitCode) {
  const dataToSave = {
    keyword_step: count,
    page: page
  }
  Count.collection.deleteMany({});
  Count.collection.insertOne(dataToSave, {ordered: false}, onInsert);
}
process.on('SIGINT', exitHandler.bind(this, {exit:true}));
process.on('uncaughtException', exitHandler.bind(this, {exit:true}));

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
  console.log(count, "count");
  console.log(page, "page");
  console.log(keywords[count].name);
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
    // console.log(err)
  } else {
    // console.log(docs)
    console.info('stores')
  }
}

const j = schedule.scheduleJob('*/5 * * * * *', async function () {
  keywords = await Keyword.find({ scraped: 0 }).exec();
  console.log(keywords);
  if (count < keywords.length) {
    await getImages();
    Photo.collection.insertMany(images, {ordered: false}, onInsert)
    count += 1
    // step = -1;
  } else {
    if(page > 4) {
      page += 1
      count = 0
      console.log("PAGE IS CHANGED")
    } else {
      await Keyword.updateMany({"scraped": 0}, {"$set":{"scraped": 1}}, {"multi": true}, (err, writeResult) => {});
      console.log("KEYWORD PARSING IS FINISHED", `COUNT - ${count}`, `KEYWORDS LENGTH - ${keywords.length}`)
    }
  }
})

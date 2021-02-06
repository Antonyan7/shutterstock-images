const sstk = require('shutterstock-api')
const Photo = require('./models/Photo')
require('./db');
const applicationClientId = 'BOlGFXzNdcjBjpyElk9NQUtj2mzM34xA'
const applicationClientSecret = 'lola8BBfGxhc8G5I'
sstk.setBasicAuth(applicationClientId, applicationClientSecret)
const schedule = require('node-schedule')
let count = 0;

const imagesApi = new sstk.ImagesApi()

const getKeywordsAndUpdatePhoto = async () => {
    const queryParams = {
        'language': 'es',
    }

    const image = await Photo.find().skip(count).limit(1).exec();
    if(image[0]){
        const data = await imagesApi.getImage(image[0].photo_id, queryParams);
        if(image[0].keywords.length === 0){
            const update = { $push: { keywords: data.keywords } };
            await Photo.updateOne({ photo_id: image[0].photo_id }, update, (err, res) => {
                console.log(res);
            });
        }
    }
    count++;
}

const j = schedule.scheduleJob('*/5 * * * * *', async function () {
    getKeywordsAndUpdatePhoto();
})
const sstk = require('shutterstock-api')
const Photo = require('./models/Photo')
require('./db');
const applicationClientId = 'BOlGFXzNdcjBjpyElk9NQUtj2mzM34xA'
const applicationClientSecret = 'lola8BBfGxhc8G5I'
sstk.setBasicAuth(applicationClientId, applicationClientSecret)
let count = 1000000;

const imagesApi = new sstk.ImagesApi()

const getKeywordsAndUpdatePhoto = async () => {

    const images = await Photo.find().skip(count).limit(20).exec();
    const data = images.map(image => {
        return {
            id: image.photo_id,
            keywords: image.keywords
        }
    })

    const ids = data.filter(function(item) {
        return item.id;
    }).map(function(item) { return item.id; });

    const queryParams = {
        "view": "full",
        "language": "en"
    };

    if (count < 2000000) {
        try {
            const response = await imagesApi.getImageList(ids, queryParams);
            const imagesKeywords = response.data.map(image => {
                return {
                    id: image.id,
                    keywords: image.keywords
                }
            });

            imagesKeywords.map(async (data, index) => {
                // if (data[index] && data[index].keywords.length === 0) {
                    const update = {$set: {keywords: data.keywords}};
                    await Photo.updateOne({photo_id: data.id}, update, {overwrite: true}, (err, res) => {
                        console.log(res);
                    });
                // } else {
                //     console.log("already Keywords exists")
                // }
            })
            count += 20;
            return true;
        } catch (e) {
            console.log("catched");
            return false;
        }
    }
}

async function recursiveKeywordMining() {
    const response = await getKeywordsAndUpdatePhoto();
    if (response && count < 2000000) {
        await recursiveKeywordMining()
    }
}

recursiveKeywordMining();
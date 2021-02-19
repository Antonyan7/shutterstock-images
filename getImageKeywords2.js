const sstk = require('shutterstock-api')
const Photo = require('./models/Photo')
require('./db');
const applicationClientId = 'BOlGFXzNdcjBjpyElk9NQUtj2mzM34xA'
const applicationClientSecret = 'lola8BBfGxhc8G5I'
sstk.setBasicAuth(applicationClientId, applicationClientSecret)
let count = 1000000;

const imagesApi = new sstk.ImagesApi()

const findKeywords = async (data) => {
    return new Promise(resolve => {

        const update = {$set: {keywords: data.keywords}};
        Photo.findByIdAndUpdate(data.id, update, {overwrite: true}, (err, res) => {
            console.log(res);
            console.log(err,222);
            resolve(res);
        });
    })
}

const getKeywordsAndUpdatePhoto = async () => {

    const images = await Photo.find().skip(count).limit(20).exec();

    const data = images.map(image => {
        return {
            id: image.id,
            photo_id: image.photo_id,
            keywords: image.keywords
        }
    })

    const photoIds = data.filter(function(item) {
        return item.photo_id;
    }).map(function(item) { return item.photo_id; });

    const queryParams = {
        "view": "full",
        "language": "en"
    };

    if (count < 2000000) {
        try {
            const response = await imagesApi.getImageList(photoIds, queryParams);
            const imagesKeywords = response.data.map(image => {
                return {
                    id: images.find(photo => photo.photo_id === image.id).id,
                    photo_id: image.id,
                    keywords: image.keywords
                }
            });
            imagesKeywords.sort(function(a, b) {
                return photoIds.indexOf(a.photo_id) - photoIds.indexOf(b.photo_id);
            });

            // imagesKeywords.map(async (data, index) => {
            //     // if (data[index] && data[index].keywords.length === 0) {
            //         const update = {$set: {keywords: data.keywords}};
            //         Photo.updateOne({photo_id: data.id}, update, {overwrite: true}, (err, res) => {
            //             console.log(res);
            //         });
            //     // } else {
            //     //     console.log("already Keywords exists")
            //     // }
            // })
            for(let i = 0; i < imagesKeywords.length; i++){
                await findKeywords(imagesKeywords[i]);
            }

            count += 20;
            return true;
        } catch (e) {
            console.log(e);
            console.log("catched");
            return false;
        }
    }
}

async function recursiveKeywordMining() {
    const response = await getKeywordsAndUpdatePhoto();

    if (response && count < 2000000) {
        setTimeout(async () => {
            await recursiveKeywordMining()
        }, 272.727273)
    }
}

recursiveKeywordMining();

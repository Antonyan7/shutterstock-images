const sstk = require('shutterstock-api')
const Photo = require('./models/Photo')
require('./db');
const applicationClientId = 'BOlGFXzNdcjBjpyElk9NQUtj2mzM34xA'
const applicationClientSecret = 'lola8BBfGxhc8G5I'
sstk.setBasicAuth(applicationClientId, applicationClientSecret)
const schedule = require('node-schedule')
let count = 2000000;

const imagesApi = new sstk.ImagesApi()

const getKeywordsAndUpdatePhoto = async () => {

    const images = await Photo.find().skip(count).limit(20).exec();
    const data = images.map(image => {
        return {
            id: image.photo_id,
            keywords: image.keywords
        }
    })

    const ids = data.map(item => {
        return item.id;
    })


    const queryParams = {
        "view": "full",
	"language": "en"
    };

    // imagesApi.getImageList(queryParams)
    //     .then((data) => {
    //         console.log(data);
    //     })
    //     .catch((error) => {
    //         console.error(error);
    //     });

    // console.log(ids);
if( count < 3000000){
    const response = await imagesApi.getImageList(ids, queryParams);

    const imagesKeywords = response.data.map(image => {
        return {
            id: image.id,
            keywords: image.keywords
        }
    });

    // console.log(imagesKeywords);
    imagesKeywords.map(data => {
        const update = { $push: { keywords: data.keywords } };
        Photo.updateOne({ photo_id: data.id }, {keywords: data.keywords}, (err, res) => {
            console.log(res);
        });
    })
}
    // if(image[0]){
    // console.log(ids);
    // const response = await imagesApi.getImageList(ids, queryParams);
        // console.log(response);
    //     console.log(data);
        // console.log(data);
        // if(image[0].keywords.length === 0){
        //     const update = { $push: { keywords: data.keywords } };
        //     await Photo.updateOne({ photo_id: image[0].photo_id }, update, (err, res) => {
        //         console.log(res);
        //     });
        // }
    // }
    count += 20;
}

const j = schedule.scheduleJob('*/5 * * * * *', async function () {
    getKeywordsAndUpdatePhoto();
})

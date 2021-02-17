const sstk = require('shutterstock-api')
const Photo = require('./models/Photo')
require('./db');
const applicationClientId = 'BOlGFXzNdcjBjpyElk9NQUtj2mzM34xA'
const applicationClientSecret = 'lola8BBfGxhc8G5I'
sstk.setBasicAuth(applicationClientId, applicationClientSecret)
const schedule = require('node-schedule')
const async = require('async');
let count = 4000000;

const imagesApi = new sstk.ImagesApi()

const getKeywordsAndUpdatePhoto = async () => {

    const images = await Photo.find().skip(count).limit(20).exec();
    console.log(images);

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
if( count < 5000000){
    const response = await imagesApi.getImageList(ids, queryParams);
    console.log(response);
    // console.log(response.data);
    const imagesKeywords = response.data.map(image => {
        return {
            id: image.id,
            keywords: image.keywords
        }
    });

    // console.log(imagesKeywords);
    imagesKeywords.map(async data => {
        // const update = { $push: { keywords: data.keywords } };
        // console.log(data.id);
        // Photo.updateOne({ photo_id: data.id }, {keywords: data.keywords}, (err, res) => {
        //     console.log(res);
        // });
        const photo = await Photo.findOne({ photo_id: data.id });
        if(photo.keywords.length === 0) {
            photo.overwrite({ keywords: data.keywords });
            console.log(photo.keywords);
            const res = await photo.save();
        }
    })

    // async.eachSeries(imagesKeywords, function updateObject (obj, done) {
    //     // Model.update(condition, doc, callback)
    //     // console.log(obj);
    //     // Model.update({ _id: obj._id }, { $set : { credits_pending: obj.credits_pending }}, done);
    //     Photo.updateOne({ photo_id: obj.id }, {keywords: obj.keywords}, (err, res) => {
    //         console.log(res);
    //     });
    // }, function allDone (err) {
    //     console.log(err);
    // });

    // async.eachSeries(imagesKeywords, function(rec, callback) {
    //     updateRecord(rec.id, rec.keywords)
    //         .then((updated) => {
    //             console.log(updated);
    //             callback();
    //         })
    // }, function(err){
    //     //execution comes here when array is fully iterated.
    // });
    //
    // function updateRecord(id, keywords) {
    //     return Photo.updateOne({photo_id: id},{$set : {'keywords' : keywords}});
    // }


    // async.each(imagesKeywords, function (item, callback) {
    //     if (item.id) {
    //         // Now update the item with your changes and you are done
    //         Photo.findOneAndUpdate({
    //             photo_id: item.id
    //         }, {
    //             $set: {
    //                 keywords: item.keywords,
    //             }
    //         }, function (err, updated) {
    //             // console.log(updated);
    //             callback();
    //         });
    //     } else {
    //         callback();
    //     }
    // }, (d => {
    //     console.log(d);
    // })); // done is call when all items are updated!
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

const j = schedule.scheduleJob('*/10 * * * * *', async function () {
    getKeywordsAndUpdatePhoto();
})

const Photo = require('./models/Photo')
const fs = require('fs')

require('./db');
let count = 0;

const keywordsCollection = {}

const getKeywordsAndUpdatePhoto = async () => {
    const images = await Photo.find().skip(count).limit(10000).exec();

    const data = images.map(image => {
        return {
            id: image.id,
            photo_id: image.photo_id,
            keywords: image.keywords
        }
    })

    if (count < 4000000) {
        try {

            data.forEach(item => {
                item.keywords.forEach(async keyword => {
                    if(keywordsCollection[keyword]){
                        keywordsCollection[keyword].count += 1;
                    } else {
                        keywordsCollection[keyword] = {
                            name: keyword,
                            count: 1
                        }
                    }
                })
            })
            console.log(count);
            // await KeywordsStatistics.insert
            count += 10000;
            return true;
        } catch (e) {
            return false;
        }
    }
}

async function recursiveKeywordMining() {
    const response = await getKeywordsAndUpdatePhoto();

    if (response && count < 4000000) {
        await recursiveKeywordMining()
    } else {
        return fs.writeFileSync('/Users/sergeiantonyan/shutterstock-api-images/keywordsDuplicates/duplicated.json', JSON.stringify(keywordsCollection))
    }
}

recursiveKeywordMining();

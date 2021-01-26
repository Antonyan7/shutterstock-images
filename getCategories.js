const sstk = require("shutterstock-api");
const Category = require("./models/Category");
require('./db');
const getCategories = async () => {

  const applicationClientId = "BOlGFXzNdcjBjpyElk9NQUtj2mzM34xA";
  const applicationClientSecret = "lola8BBfGxhc8G5I";
  sstk.setBasicAuth(applicationClientId, applicationClientSecret);

  const imagesApi = new sstk.ImagesApi();

  const queryParams = {
    "language": "en"
  };

  imagesApi.getImageCategories(queryParams)
  .then((data) => {
    if(data.data.length > 0) {
      const categories = data.data.map(item => {
        return {
          id: Object.values(item)[0],
          name: Object.values(item)[1]
        }
      })
      Category.collection.insertMany(categories,{ ordered: false }, onInsert);
    }
  })
  .catch((error) => {
    console.error(error);
  });
}
function onInsert (err, docs) {
  if (err) {
    console.log(err)
  } else {
    console.log(docs)
    console.info('stores')
  }
}

getCategories();

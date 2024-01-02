// import Constants from "expo-constants";
// I was getting an error when I imported from the core library, but this file works as a standin
import * as contentful from "contentful/dist/contentful.browser.min.js";

const client = contentful.createClient({
  space: process.env.CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
});


client.getEntries().then(function (entries) {

  // log the title for all the entries that have it
  entries.items.forEach(function (entry) {
    if (entry.fields.title) {
      // console.log("client.getEntries -->", entry.fields.title);
    }
  });
});

export default client;

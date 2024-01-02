import client from "../utils/contentful";
import _ from "lodash";

// docs: https://www.contentful.com/developers/docs/references/content-delivery-api/

const DEFAULT_TOTAL_ENTRIES = 100;

export const handleContentfulSearch = async (query) => {
  const res = await client.getEntries({ content_type: "article", query });

  const articles = _.sortBy(
    res?.items.map((article) => article.fields),
    ["title"]
  );

  return articles;
};

export const getAllContentfulArticles = async () => {
  try {
    const res = await client.getEntries({ content_type: "article" });


    const total = res?.total || 0;

    if (total === 0) {
      return [];
    }

    const pages = Math.ceil(total / DEFAULT_TOTAL_ENTRIES) - 1;
    const pagedPromises = [];

    for (let i = 0; i <= pages; i++) {

      let obj = {
        content_type: "article",
        limit: DEFAULT_TOTAL_ENTRIES,
        skip: i * 100,
      }
      var data = await client.getEntries(obj)
      pagedPromises.push(data);
    }

    const pagedArticles = await Promise.all(pagedPromises);
    return pagedArticles.flatMap((page) => page.items);
  } catch (error) {
    throw new Error(error);
  }
};

export const getSpecificContentfulArticles = async (articleID) => {
  client
    .getEntry(articleID)
    .then(async entry => {

      var result = await Object.assign(entry.fields, { "id": entry.sys.id });
      await console.log("getSpecificContentfulArticles", result)
      return result
    })
    .catch(err => console.log("getSpecificContentfulArticles", err));
};

export const getContentfulArticles = async (
  options = {
    skip: 0,
    limit: DEFAULT_TOTAL_ENTRIES,
  }
) => {
  return await client.getEntries({
    content_type: "article",
    ...options,
  });
};

export const getContentfulPrivacyPages = async () => {
  const res = await client.getEntries({ content_type: "privacyPage" });
  return res;
};

const express = require("express");
const cheerio = require("cheerio");
const axios = require("axios");

const app = express();

const post = [];
console.log("------------------------------------");
const overall = [];

//newspaper
const newsPaper = [
  {
    newsTitle: "The Guardian",
    newsUrl: "https://www.theguardian.com/world/coronavirus-outbreak",
    key: "coronavirus",
    keyword: "guardian",
  },
  {
    newsTitle: "The Newyork Times",
    newsUrl: "https://www.nytimes.com/section/climate",
    key: "climate",
    keyword: "ny",
  },
];

//get
newsPaper.forEach((news) => {
  axios
    .get(news.newsUrl)
    .then((response) => {
      let html = response.data;
      let $ = cheerio.load(html);
      $(`a:contains(${news.key})`, html).each(function () {
        let url = $(this).attr("href");
        let title = $(this).text();
        console.log(url, title);
        post.push({ url, title, heading: news.newsTitle });
      });
      res.json(post);
    })
    .catch((err) => {
      console.log(err);
    });
});

//home
app.get("/", (req, res) => {
  res.json("Climatic Change");
});

//news
app.get("/news", (req, res) => {
  res.json(post);
});

//using id
app.get("/news/:newsId", (req, res) => {
  const newspaperId=req.params.newsId;
  const newspaperAddress = newsPaper.filter(
    (news) => newspaperId === news.keyword
  )[0].newsUrl;
  const newspaperTitle = newsPaper.filter(
    (news) => newspaperId === news.keyword
  )[0].newsTitle
  const newspaperKey = newsPaper.filter(
    (news) => newspaperId === news.keyword
  )[0].key
  axios
    .get(newspaperAddress)
    .then((response) => {
      let html = response.data;
      let $ = cheerio.load(html);
      $(`a:contains('${newspaperKey}')`, html).each(function () {
        let url = $(this).attr("href");
        let title = $(this).text();
        overall.push({ url, title, heading: newspaperTitle });
      });
    res.json(overall);
    })

    .catch((err) => {
      console.log(err);
    });
});

//Server
app.listen(8000, () => {
  console.log("Server is Ready");
});

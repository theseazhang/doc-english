import * as cheerio from "cheerio";
import got from "got";
import * as fs from "fs";

function sleep(ms = 1000) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const configPath = "doc-english.config.json";
const config = JSON.parse(fs.readFileSync(configPath));

async function nextLinks() {
  const url = "https://nextjs.org/docs/getting-started";
  const body = await got(url).text();
  const $ = cheerio.load(body);
  const res = [];
  const links = $(".nav-link_navLink__TjdhK > a");
  links.each(function (i, ele) {
    const x = "https://nextjs.org" + $(this).attr("href");
    if (!res.includes(x)) res.push(x);
  });
  return res;
}

async function nextParse() {
  const res = [];
  const links = config.spider.next;
  if (!links) links = await nextLinks();

  for (let index = 0; index < links.length; index++) {
    const url = links[index];
    const body = await got(url).text();
    const $ = cheerio.load(body);
    $("pre").remove();
    $("code").remove();
    $("table").remove();
    $("summary").remove();
    $("a").remove();
    const docs = $(".docs-content").children();
    docs.each(function (i, ele) {
      res.push($(this).text());
    });
    console.log("done - ", url);
  }

  return res;
}

async function reactLinks() {
  const url = "https://reactjs.org/docs/getting-started.html";
  const body = await got(url).text();
  const $ = cheerio.load(body);
  const res = [];
  const links = $("nav > div > ul > li > a");
  links.each(function (i, ele) {
    const x = "https://reactjs.org" + $(this).attr("href");
    if (!res.includes(x)) res.push(x);
  });
  return res;
}

async function reactParse() {
  const res = [];
  const links = config.spider.react;
  if (!links) links = await reactLinks();

  for (let index = 0; index < links.length; index++) {
    const url = links[index];
    const body = await got(url).text();
    await sleep(3000);
    const $ = cheerio.load(body);
    $("pre").remove();
    $("code").remove();
    $("table").remove();
    $("summary").remove();
    $("a").remove();
    const docs = $("article").children();
    docs.each(function (i, ele) {
      res.push($(this).text());
    });
    console.log("done - ", url);
  }

  return res;
}

async function tailwindcssLinks() {
  const url = "https://tailwindcss.com/docs/installation";
  const body = await got(url).text();
  const $ = cheerio.load(body);
  const res = [];
  const links = $("#nav > ul > li > ul > li > a");
  links.each(function (i, ele) {
    const href = $(this).attr("href");
    if (href.charAt(0) === "/") {
      const x = "https://tailwindcss.com" + href;
      console.log(x);
      if (!res.includes(x)) res.push(x);
    }
  });
  return res;
}

async function tailwindcssParse() {
  const res = [];
  const links = config.spider.tailwindcss;
  if (!links) links = await tailwindcssLinks();

  for (let index = 0; index < links.length; index++) {
    const url = links[index];
    const body = await got(url).text();
    const $ = cheerio.load(body);
    $("pre").remove();
    $("code").remove();
    $("table").remove();
    $("summary").remove();
    $("a").remove();
    const docs = $("#content-wrapper").children();
    docs.each(function (i, ele) {
      res.push($(this).text());
    });
    console.log("done - ", url);
  }

  return res;
}

async function nodejsLinks() {
  const url = "https://nodejs.org/dist/latest-v18.x/docs/api/";
  const body = await got(url).text();
  const $ = cheerio.load(body);
  const res = [];
  const links = $("#apicontent > ul > li > a");
  links.each(function (i, ele) {
    const href = $(this).attr("href");
    const x = "https://nodejs.org/dist/latest-v18.x/docs/api/" + href;
    if (href !== "https://github.com/nodejs/node" && !res.includes(x)) {
      res.push(x);
    }
  });
  return res;
}

async function nodejsParse() {
  const res = [];
  const links = config.spider.nodejs;
  if (!links) links = await nodejsLinks();

  for (let index = 0; index < links.length; index++) {
    const url = links[index];
    const body = await got(url).text();
    const $ = cheerio.load(body);
    $("pre").remove();
    $("code").remove();
    $("table").remove();
    $("summary").remove();
    $("a").remove();
    const docs = $("#apicontent").children();
    docs.each(function (i, ele) {
      res.push($(this).text());
    });
    console.log("done - ", url);
  }

  return res;
}

async function strapiLinks() {
  const url =
    "https://docs.strapi.io/developer-docs/latest/getting-started/introduction.html";
  const body = await got(url).text();
  const $ = cheerio.load(body);
  const res = [];
  const links = $("a.sidebar-link");
  links.each(function (i, ele) {
    const href = $(this).attr("href");
    const index = href.indexOf("html#");
    if (index === -1) {
      const x = "https://docs.strapi.io" + href;
      if (!res.includes(x)) res.push(x);
    }
  });

  const res2 = [];
  const links2 = $("a.sidebar-heading");
  links2.each(function (i, ele) {
    const href = $(this).attr("href");
    const index = href.indexOf("html#");
    if (index === -1) {
      let x = "https://docs.strapi.io" + href;
      if (!x.endsWith(".html")) x += ".html";
      if (!res.includes(x) && !res2.includes(x)) res2.push(x);
    }
  });

  for (const link of res2) {
    console.log(link);
    const body = await got(link).text();
    const $ = cheerio.load(body);
    const childLinks = $("a.sidebar-link");
    childLinks.each(function (i, ele) {
      const href = $(this).attr("href");
      const index = href.indexOf("html#");
      if (index === -1) {
        const x = "https://docs.strapi.io" + href;
        if (!res.includes(x)) res.push(x);
      }
    });
  }

  return res.concat(res2);
}

async function strapiParse() {
  const res = [];
  const links = config.spider.strapi;
  if (!links) links = await strapiLinks();

  for (let index = 0; index < links.length; index++) {
    const url = links[index];
    const body = await got(url).text();
    const $ = cheerio.load(body);
    $("pre").remove();
    $("code").remove();
    $("table").remove();
    $("summary").remove();
    $("a").remove();
    const docs = $(".theme-default-content").children();
    docs.each(function (i, ele) {
      res.push($(this).text());
    });
    console.log("done - ", url);
  }

  return res;
}

export {
  nextParse,
  reactParse,
  tailwindcssParse,
  nodejsParse,
  strapiParse,
  sleep,
};

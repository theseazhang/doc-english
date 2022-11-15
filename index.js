import {
  nextParse,
  reactParse,
  tailwindcssParse,
  nodejsParse,
  strapiParse,
  sleep,
} from "./lib/spider.js";
import * as fs from "fs";

function spiltStr(str) {
  const res = [];
  const tab = str.toLowerCase().split("\n");
  for (const line of tab) {
    for (let word of line.split(" ")) {
      if (word.length < 2 || word.length > 26) continue;
      if (/^[a-z]+$/.test(word)) res.push(word);
    }
  }

  return res;
}

function wordCount(res) {
  let tmp = new Map();
  res.forEach((str) => {
    let res = spiltStr(str);
    res.forEach((i) => {
      if (tmp.has(i)) tmp.set(i, tmp.get(i) + 1);
      else tmp.set(i, 1);
    });
  });

  let items = Array.from(tmp);
  items.sort((a, b) => b[1] - a[1]);
  return items;
}

async function runNext() {
  const res = await nextParse();
  const words = wordCount(res);
  fs.writeFile("data/nextjs-words.json", JSON.stringify(words), (err) => {
    if (err) {
      console.error(err);
      return;
    }
  });

  console.log(`next.js is done ! get ${words.length} words.`);
}

async function runReact() {
  const res = await reactParse();
  const words = wordCount(res);
  fs.writeFile("data/reactjs-words.json", JSON.stringify(words), (err) => {
    if (err) {
      console.error(err);
      return;
    }
  });

  console.log(`react.js is done ! get ${words.length} words.`);
}

async function runTailwindcss() {
  const res = await tailwindcssParse();
  const words = wordCount(res);
  fs.writeFile("data/tailwindcss-words.json", JSON.stringify(words), (err) => {
    if (err) {
      console.error(err);
      return;
    }
  });

  console.log(`Tailwind CSS is done ! get ${words.length} words.`);
}

async function runNodejs() {
  const res = await nodejsParse();
  const words = wordCount(res);
  fs.writeFile("data/nodejs-words.json", JSON.stringify(words), (err) => {
    if (err) {
      console.error(err);
      return;
    }
  });

  console.log(`Node.js is done ! get ${words.length} words.`);
}

async function runStrapi() {
  const res = await strapiParse();
  const words = wordCount(res);
  fs.writeFile("data/strapi-words.json", JSON.stringify(words), (err) => {
    if (err) {
      console.error(err);
      return;
    }
  });

  console.log(`Strapi is done ! get ${words.length} words.`);
}

const dictPath = [
  "data/nextjs-words.json",
  "data/reactjs-words.json",
  "data/tailwindcss-words.json",
  "data/nodejs-words.json",
  "data/strapi-words.json",
];

function sortAllDicts() {
  let tmp = new Map();
  for (const path of dictPath) {
    const res = JSON.parse(fs.readFileSync(path));
    for (const i of res) {
      let [k, v] = i;
      if (tmp.has(k)) tmp.set(k, tmp.get(k) + v);
      else tmp.set(k, v);
    }
  }

  let items = Array.from(tmp);
  items.sort((a, b) => b[1] - a[1]);
  fs.writeFileSync("data/front-end-words.json", JSON.stringify(items));
  console.log(`All front-end docs is done ! get ${items.length} words.`);
}

// sortAllDicts();

function top4000SortByLetter() {
  let items = JSON.parse(fs.readFileSync("data/front-end-words.json"));
  items = items.slice(0, 4000);
  for (let index = 0; index < items.length; index++) {
    items[index][2] = "";
  }
  items.sort((a, b) => {
    const w1 = a[0];
    const w2 = b[0];
    if (w1 < w2) return -1;
    if (w1 > w2) return 1;
    return 0;
  });
  fs.writeFileSync("data/top4000-sort-by-letter.json", JSON.stringify(items));
  console.log(`top 4000 sorted !`);
}

//top4000SortByLetter();

function addChild(path) {
  let tab = JSON.parse(fs.readFileSync(path));
  tab.forEach((element) => {
    if (!element[3]) {
      element[3] = ["", "", ""];
    }
  });

  fs.writeFileSync(path, JSON.stringify(tab));
}

addChild("data/days/group10.json");

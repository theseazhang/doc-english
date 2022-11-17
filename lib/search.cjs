const { Index, Document, Worker } = require("flexsearch");
const fs = require("fs");

function txtToarray() {
  const str = fs.readFileSync("data/doc-lines.txt", "utf-8");
  return str.split("\n");
}

const index = new Index();
const dict = txtToarray();

function addIndexs() {
  dict.map((item, i) => {
    index.add(i, item);
  });
}

addIndexs();

function addLinesTojson(path) {
  const tab = JSON.parse(fs.readFileSync(path));

  tab.map((item, i) => {
    const word = item[0];
    const searchRes = index.search(word, 5);
    searchRes.map((id, idIndex) => {
      item[3][idIndex] = dict[id];
    });
  });
  fs.writeFileSync(path, JSON.stringify(tab));
  console.log(path, "work done!");
}

addLinesTojson("data/days/group8.json");

import { CSV } from "https://js.sabae.cc/CSV.js";

const data1 = await CSV.fetchJSON("org/park_nakanoku.csv");
const data2 = await CSV.fetchJSON("org/park_suginamiku_scraped.csv");
// console.log(JSON.stringify(Object.keys(data1[0]), null, 2));
// console.log(JSON.stringify(Object.keys(data2[0]), null, 2));

const namemap = {
  "名称": "name",
  "郵便番号": "zip",
  "住所": "address",
  "電話番号": "tel",
  "URL": "URL",
  "備考": "description",
  "経度": "lng",
  "緯度": "lat",

  "分類": "type",

  //"開園年月日",
  "面積": "size_m2",
  //"その他",
  "写真URL": "url_image",
  /*
  "公園の概要",
  "園名の由来",
  "利用時間",
  "休園日",
  "駐車場",
  "アクセス",
  "休業日",
  "地域の方々との関わり",
  "柏の宮公園ができるまで",
  "柏の宮公園憲章",
  "茶室（林丘亭）",
  "災害に備えた公園",
  "この公園ができるまで",
  "主要防災施設",
  "ファクス番号",
  "みどりの相談所概要",
  "ホームページ",
  "市民緑地制度",
  "施設等紹",
  "施設等紹介",
  "交通アクセス",
  "開園時間",
  "ご寄附のお願い",
  "利用上の注意"
  */

  "公園名": "name",
  //"Id",
  //"公園番号",
  //"公園種別",
  "読み仮名": "name_kana",
  "公園所在地": "address",
  "公園面積_m2": "size_m2",
  /*
  "主な施設",
  "主な遊具",
  "閉鎖管理施設",
  "トイレ",
  "その他情報",
  "備考1",
  "備考2",
  */
  "経度": "lng",
  "緯度": "lat",
  "分類": "type",
};
const remap = (place, color, d) => {
  const d2 = {};
  d2.owner = place;
  d2.color = color;
  for (const name in d) {
    const n2 = namemap[name];
    if (n2) {
      const s = d[name];
      const n = s.indexOf("平方メートル");
      if (n >= 0) {
        d2[n2] = s.substring(0, n).replace(/\,/g, "");
      } else {
        d2[n2] = d[name];
      }
    }
  }
  for (const name in d) {
    const n2 = namemap[name];
    if (!n2) {
      d2[name] = d[name];
    }
  }
  return d2;
}

const data = [];
for (const d of data1) {
  data.push(remap("中野区", "red", d));
}
for (const d of data2) {
  data.push(remap("杉並区", "green", d));
}
await Deno.writeTextFile("park.csv", CSV.stringify(data));
await Deno.writeTextFile("park_nakanoku.csv", CSV.stringify(data.filter(i => i.owner == "中野区")));
await Deno.writeTextFile("park_suginamiku.csv", CSV.stringify(data.filter(i => i.owner == "杉並区")));

import { fetchOrLoad } from "https://js.sabae.cc/fetchOrLoad.js";
import { HTMLParser } from "https://js.sabae.cc/HTMLParser.js";
import { Day } from "https://js.sabae.cc/DateTime.js";
import { CSV } from "https://js.sabae.cc/CSV.js";

const path = "org/park_suginamiku.csv";

const data = await CSV.fetchJSON(path);
for (const d of data) {
  //console.log(d.URL);
  const html = await fetchOrLoad(d.URL);
  const dom = HTMLParser.parse(html);
  //console.log(dom);
  const dds = dom.querySelectorAll("article dl > *");
  let name = null;
  for (const dd of dds) {
    //console.log(dd.rawTagName);
    if (dd.rawTagName == "dt") {
      name = dd.text.trim();
    } else if (dd.rawTagName == "dd") {
      d[name] = dd.text.trim();
    }
  }
  const img = dom.querySelector("article .imagecenter img");
  if (img) {
    const src = img.getAttribute("src");
    const imgurl = new URL(src, d.URL);
    //console.log(imgurl.href);
    d.写真URL = imgurl.href;
  }
  //console.log(d);
}
await Deno.writeTextFile("org/park_suginamiku_scraped.csv", CSV.stringify(data));

const fs = require("fs");
const Fontmin = require("fontmin");
let charset = new Set();

const scanFolder = (dir, done) => {
  let results = [];
  fs.readdir(dir, (err, list) => {
    if (err) {
      return done(err);
    }
    let i = 0;
    (function iter() {
      let file = list[i++];
      if (!file) {
        return done(null, results);
      }
      file = dir + "/" + file;
      fs.stat(file, (err, stat) => {
        if (stat && stat.isDirectory()) {
          scanFolder(file, (err, res) => {
            results = results.concat(res);
            iter();
          });
        } else {
          results.push(file);
          iter();
        }
      });
    })();
  });
};

const compressFont = (finalString, src, dest) => {
  const fontmin = new Fontmin()
    .src(src)
    .dest(dest)
    .use(
      Fontmin.glyph({
        text: finalString,
        hinting: false,
      })
    );
  fontmin.run((err) => {
    if (err) {
      throw err;
    }
  });
};

scanFolder("docs", (n, results) => {
  results.forEach((file) => {
    const result = fs.readFileSync(file, "utf8");
    const currentCharSet = new Set(result);
    charset = new Set([...charset, ...currentCharSet]);
  });
  compressFont(
    Array.from(charset).join(""),
    "./docs/css/fonts/HYShuSongErS.ttf",
    "./out"
  );
  compressFont(
    Array.from(charset).join(""),
    "./docs/css/fonts/HYFangSongJ.ttf",
    "./out"
  );
  compressFont(
    Array.from(charset).join(""),
    "./docs/css/fonts/FZKTJW.ttf",
    "./out"
  );
  compressFont(
    Array.from(charset).join(""),
    "./docs/css/fonts/FZHTJW.ttf",
    "./out"
  );
  console.log("共生成：" + Array.from(charset).length + "个字符");
});

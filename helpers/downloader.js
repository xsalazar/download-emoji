const emojiDatasource = require("emoji-datasource/emoji_pretty.json");
const twemoji = require("twemoji");
const axios = require("axios").default;
var fs = require("fs");

// Create local path for emoji category
const path = `../assets/`;
if (!fs.existsSync(path)) {
  fs.mkdirSync(path);
}

const emojisToDownload = emojiDatasource.sort((e1, e2) => {
  return e1.sort_order > e2.sort_order ? 1 : -1;
});

emojisToDownload.forEach(async (emoji) => {
  if (emoji.has_img_twitter) {
    await downloadEmoji(emoji.unified, emoji);

    if (emoji.skin_variations) {
      Object.values(emoji.skin_variations).forEach(async (variation) => {
        if (variation) {
          await downloadEmoji(variation.unified, emoji);
        }
      });
    }
  }
});

async function downloadEmoji(codepoint, emoji) {
  process.stdout.write(".");
  twemoji.parse(
    codepoint.split("-").map(twemoji.convert.fromCodePoint).join(""),
    async (icon, options) => {
      const url = `${options.base}svg/${icon}.svg`;
      try {
        let response = await axios.get(url, {
          responseType: "stream",
        });
        response.data.pipe(
          fs.createWriteStream(`../assets/${emoji.sort_order}-${codepoint}.svg`)
        );
      } catch (e) {
        console.log(`Failed to get ${emoji.short_name} at ${url}`);
      }
    }
  );
}

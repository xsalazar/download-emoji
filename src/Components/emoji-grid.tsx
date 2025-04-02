import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { imageListItemClasses } from "@mui/material/ImageListItem";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import emojiDatasource from "emoji-datasource/emoji_pretty.json";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import Emoji, { EmojiDatasource, EmojiVariation } from "./emoji";

export default function EmojiGrid() {
  const defaultSelectedTab = 0;

  const sortedEmojis = emojiDatasource
    .sort((e1, e2) => {
      return e1.sort_order > e2.sort_order ? 1 : -1;
    })
    .filter((e: EmojiDatasource) => e.sort_order !== 159); // Filter out eye in speech bubble. See: https://git.io/JDj18

  const emojiCategories = sortedEmojis
    .map((e: EmojiDatasource) => e.category)
    .filter((category: string, index: number, self: Array<string>) => {
      return self.indexOf(category) === index;
    });

  const defaultEmojis = sortedEmojis.filter((e: EmojiDatasource) => {
    return e.category === emojiCategories[defaultSelectedTab];
  });

  const [emojis, setEmojis] = useState(defaultEmojis);
  const [selectedTab, setSelectedTab] = useState(defaultSelectedTab);

  const handleSelectedTabChanged = (selectedTab: number) => {
    var emojis = sortedEmojis.filter((e: EmojiDatasource) => {
      return e.category === emojiCategories[selectedTab];
    });

    setEmojis(emojis);
    setSelectedTab(selectedTab);
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        flexGrow: 1,
        display: "flex",
        flexDirection: "column",
        overflowY: "auto",
      }}
    >
      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={selectedTab}
          onChange={(_, value) => handleSelectedTabChanged(value)}
          variant="scrollable"
          scrollButtons
          allowScrollButtonsMobile
        >
          {emojiCategories.map((category: string) => {
            return <Tab label={category} key={category}></Tab>;
          })}
        </Tabs>
      </Box>

      {/* Emoji List */}
      <Box
        sx={{
          mx: 3,
          justifyItems: "center",
          flexGrow: "1",
          overflowY: "scroll",
        }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "repeat(4, 1fr)",
              sm: "repeat(5, 1fr)",
              md: "repeat(7, 1fr)",
              lg: "repeat(7, 1fr)",
              xl: "repeat(8, 1fr)",
            },
            [`& .${imageListItemClasses.root}`]: {
              display: "flex",
            },
          }}
        >
          {emojis.map((e: EmojiDatasource) => {
            var emojiVariations = new Array<EmojiVariation>();
            if (e.skin_variations) {
              Object.values(e.skin_variations).forEach(
                (variation: EmojiVariation | undefined) => {
                  if (variation) {
                    emojiVariations.push(variation);
                  }
                }
              );
            }

            return (
              <Emoji
                key={uuidv4()}
                codepoint={e.unified}
                emoji={e}
                variations={emojiVariations}
              />
            );
          })}
        </Box>
      </Box>
    </Container>
  );
}

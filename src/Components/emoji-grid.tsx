import React from "react";
import Emoji, { EmojiDatasource, EmojiVariation } from "./emoji";
import emojiDatasource from "emoji-datasource/emoji_pretty.json";
import { Container, ImageList, Tab, Tabs, Box } from "@mui/material";
import { v4 as uuidv4 } from "uuid";

interface GridProps {}

interface GridState {
  sortedEmojis: Array<EmojiDatasource>;
  emojis: Array<EmojiDatasource>;
  emojiCategories: Array<string>;
  selectedTab: number;
}

export default class EmojiGrid extends React.Component<GridProps, GridState> {
  constructor(props: GridProps) {
    super(props);

    var selectedTab = 0;

    var sortedEmojis = emojiDatasource
      .sort((e1, e2) => {
        return e1.sort_order > e2.sort_order ? 1 : -1;
      })
      .filter((e: EmojiDatasource) => e.sort_order !== 159); // Filter out eye in speech bubble. See: https://git.io/JDj18

    var emojiCategories = sortedEmojis
      .map((e: EmojiDatasource) => e.category)
      .filter((category: string, index: number, self: Array<string>) => {
        return self.indexOf(category) === index;
      });

    var emojis = sortedEmojis.filter((e: EmojiDatasource) => {
      return e.category === emojiCategories[selectedTab];
    });

    this.state = {
      sortedEmojis,
      emojis,
      emojiCategories,
      selectedTab,
    };

    this.handleSelectedTabChanged = this.handleSelectedTabChanged.bind(this);
  }

  render() {
    const emojiToRender = new Array<JSX.Element>();
    this.state.emojis.forEach((e: EmojiDatasource) => {
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
      emojiToRender.push(
        <Emoji
          key={uuidv4()}
          codepoint={e.unified}
          emoji={e}
          variations={emojiVariations}
        />
      );
    });

    return (
      <div style={{ height: "calc(100vh - 200px)" }}>
        <Container maxWidth="sm">
          {/* Tabs */}
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={this.state.selectedTab}
              onChange={this.handleSelectedTabChanged}
              variant="scrollable"
              scrollButtons
              allowScrollButtonsMobile
            >
              {this.state.emojiCategories.map((category: string) => {
                return <Tab label={category} key={category}></Tab>;
              })}
            </Tabs>
          </Box>

          {/* Emoji List */}
          <Box
            sx={{
              mx: 3,
              height: "calc(100vh - 250px)",
              overflowY: "auto",
              justifyItems: "center",
            }}
          >
            <ImageList cols={8} gap={4}>
              {emojiToRender}
            </ImageList>
          </Box>
        </Container>
      </div>
    );
  }

  handleSelectedTabChanged(event: React.SyntheticEvent, selectedTab: number) {
    var emojis = this.state.sortedEmojis.filter((e: EmojiDatasource) => {
      return e.category === this.state.emojiCategories[selectedTab];
    });

    this.setState({
      emojis,
      selectedTab,
    });
  }
}

import React from "react";
import Emoji, { EmojiDatasource, EmojiVariation } from "./emoji";
import emojiDatasource from "emoji-datasource/emoji_pretty.json";
import { Container, Tab, Tabs, Box } from "@mui/material";
import { imageListItemClasses } from "@mui/material/ImageListItem";
import { v4 as uuidv4 } from "uuid";

interface GridProps {}

interface GridState {
  emojis: Array<EmojiDatasource>;
  emojiCategories: Array<string>;
  selectedTab: number;
  sortedEmojis: Array<EmojiDatasource>;
}

export default class EmojiGrid extends React.Component<GridProps, GridState> {
  constructor(props: GridProps) {
    super(props);

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

    const emojis = sortedEmojis.filter((e: EmojiDatasource) => {
      return e.category === emojiCategories[defaultSelectedTab];
    });

    this.state = {
      sortedEmojis,
      emojis,
      emojiCategories,
      selectedTab: defaultSelectedTab,
    };

    this.handleSelectedTabChanged = this.handleSelectedTabChanged.bind(this);
  }

  render() {
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
            {this.state.emojis.map((e: EmojiDatasource) => {
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

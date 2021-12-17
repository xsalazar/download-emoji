import React from "react";
import Emoji, { EmojiDatasource, EmojiVariation } from "./emoji";
import emojiDatasource from "emoji-datasource/emoji_pretty.json";
import { Container, ImageList } from "@mui/material";
import { v4 as uuidv4 } from "uuid";

interface GridProps {}

interface GridState {
  emojis: Array<EmojiDatasource>;
}

export default class EmojiGrid extends React.Component<GridProps, GridState> {
  constructor(props: GridProps) {
    super(props);

    this.state = {
      emojis: emojiDatasource
        .sort((e1, e2) => {
          return e1.sort_order > e2.sort_order ? 1 : -1;
        })
        .slice(0, 100),
    };
  }

  render() {
    const emojiToRender = new Array<JSX.Element>();
    this.state.emojis.forEach((e: EmojiDatasource) => {
      emojiToRender.push(
        <Emoji key={uuidv4()} codepoint={e.unified} emoji={e} />
      );

      if (e.skin_variations) {
        Object.values(e.skin_variations).forEach(
          (variation: EmojiVariation | undefined) => {
            if (variation) {
              emojiToRender.push(
                <Emoji
                  key={uuidv4()}
                  codepoint={variation.unified}
                  emoji={e}
                  variation={variation}
                />
              );
            }
          }
        );
      }
    });

    return (
      <Container maxWidth="sm">
        <ImageList cols={8} gap={8}>
          {emojiToRender}
        </ImageList>
      </Container>
    );
  }
}

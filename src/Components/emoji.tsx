import { v4 as uuidv4 } from "uuid";
import { Box, ImageListItem, Modal, Grid, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import React from "react";
import twemoji from "twemoji";

interface EmojiProps {
  codepoint: string;
  emoji: EmojiDatasource;
  variation?: EmojiVariation;
}

interface EmojiState {
  codepoint: string;
  emoji: EmojiDatasource;
  variation?: EmojiVariation;
  isModalOpen: boolean;
}

const modalStyle = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 200,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

const codeStyle = {
  fontFamily: "monospace",
  bgcolor: "grey.300",
  mr: 1,
};

export default class Emoji extends React.Component<EmojiProps, EmojiState> {
  constructor(props: EmojiProps) {
    super(props);

    this.state = {
      codepoint: props.codepoint,
      emoji: props.emoji,
      variation: props.variation ?? undefined,
      isModalOpen: false,
    };

    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  render() {
    return (
      <div>
        {/* List Item */}
        <ImageListItem
          onClick={this.openModal}
          key={uuidv4()}
          style={{ width: "32px", height: "32px" }}
        >
          <div
            dangerouslySetInnerHTML={this.createEmoji(this.state.codepoint)}
          ></div>
        </ImageListItem>

        {/* Modal */}
        <Modal open={this.state.isModalOpen} onClose={this.closeModal}>
          <Box sx={modalStyle}>
            <Grid container columns={1}>
              <Grid item container xs={12} justifyContent="flex-end">
                <CloseIcon onClick={this.closeModal} />
              </Grid>
              <Grid item xs={12}>
                <div
                  dangerouslySetInnerHTML={this.createEmoji(
                    this.state.codepoint
                  )}
                ></div>
              </Grid>
              {/* <Grid item xs>
                {this.state.emoji.short_names.map((shortName: string) => {
                  return (
                    <Typography display="inline" sx={codeStyle}>
                      :{shortName}:
                    </Typography>
                  );
                })}
              </Grid> */}
            </Grid>
          </Box>
        </Modal>
      </div>
    );
  }

  createEmoji(codePoint: string) {
    return {
      __html: twemoji.parse(
        codePoint.split("-").map(twemoji.convert.fromCodePoint).join(""),
        {
          ext: ".svg",
          folder: "svg",
        }
      ),
    };
  }

  openModal() {
    this.setState({ isModalOpen: true });
  }

  closeModal() {
    this.setState({ isModalOpen: false });
  }
}

export interface EmojiDatasource {
  name: string;
  unified: string;
  non_qualified?: string | null;
  docomo?: string | null;
  au?: string | null;
  softbank?: string | null;
  google?: string | null;
  image: string;
  sheet_x: number;
  sheet_y: number;
  short_name: string;
  short_names: string[];
  text?: string | null;
  texts?: string[] | null;
  category: string;
  subcategory: string;
  sort_order: number;
  added_in: string;
  has_img_apple: boolean;
  has_img_google: boolean;
  has_img_twitter: boolean;
  has_img_facebook: boolean;
  skin_variations?: { [variation: string]: EmojiVariation | undefined };
  obsoletes?: string;
  obsoleted_by?: string;
}

export interface EmojiVariation {
  unified: string;
  image: string;
  sheet_x: number;
  sheet_y: number;
  added_in: string;
  has_img_apple: boolean;
  has_img_google: boolean;
  has_img_twitter: boolean;
  has_img_facebook: boolean;
}

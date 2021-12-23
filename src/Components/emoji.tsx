import { v4 as uuidv4 } from "uuid";
import {
  Box,
  ImageListItem,
  Modal,
  Grid,
  Typography,
  IconButton,
  Collapse,
  TextField,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import React from "react";
import twemoji from "twemoji";
import {
  ExpandLess,
  ExpandMore,
  Download,
  Link,
  LinkOff,
} from "@mui/icons-material";
import axios from "axios";

interface EmojiProps {
  codepoint: string;
  emoji: EmojiDatasource;
  variation?: EmojiVariation;
}

interface EmojiState {
  codepoint: string;
  emoji: EmojiDatasource;
  variation?: EmojiVariation;
  modalState: {
    isOpen: boolean;
    isMetadataOpen: boolean;
    ratioLocked: boolean;
    width: number;
    height: number;
  };
}

const modalStyle = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 300,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 2,
};

// const codeStyle = {
//   fontFamily: "monospace",
//   bgcolor: "grey.300",
//   mr: 1,
// };

export default class Emoji extends React.Component<EmojiProps, EmojiState> {
  constructor(props: EmojiProps) {
    super(props);

    this.state = {
      codepoint: props.codepoint,
      emoji: props.emoji,
      variation: props.variation ?? undefined,
      modalState: {
        isOpen: false,
        isMetadataOpen: false,
        ratioLocked: true,
        width: 36,
        height: 36,
      },
    };

    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.handleMetadataClick = this.handleMetadataClick.bind(this);
    this.handleRatioLockedClick = this.handleRatioLockedClick.bind(this);
    this.handleWidthChanged = this.handleWidthChanged.bind(this);
    this.handleHeightChanged = this.handleHeightChanged.bind(this);
    this.handleDownloadClick = this.handleDownloadClick.bind(this);
  }

  render() {
    return (
      <div>
        {/* List Item */}
        <ImageListItem
          onClick={this.openModal}
          key={uuidv4()}
          sx={{
            maxWidth: 32,
            borderRadius: 2,
            padding: 0.5,
            "&:hover": {
              backgroundColor: () => this.getRandomBackgroundColor(),
            },
          }}
        >
          <div
            dangerouslySetInnerHTML={this.createEmoji(this.state.codepoint)}
          ></div>
        </ImageListItem>

        {/* Modal */}
        <Modal open={this.state.modalState.isOpen} onClose={this.closeModal}>
          <Box sx={modalStyle}>
            <Grid container>
              {/* Close Icon */}
              <Grid item container xs={12} justifyContent="flex-end">
                <IconButton onClick={this.closeModal}>
                  <CloseIcon />
                </IconButton>
              </Grid>

              {/* Image */}
              <Grid item xs={12} sx={{ p: 1 }}>
                <div
                  dangerouslySetInnerHTML={this.createEmoji(
                    this.state.codepoint
                  )}
                ></div>
              </Grid>

              {/* Download Options */}
              <Grid item container xs={12} sx={{ p: 1 }}>
                {/* Width Input */}
                <Grid item xs={4}>
                  <TextField
                    label="width"
                    size="small"
                    value={this.state.modalState.width}
                    onChange={this.handleWidthChanged}
                    inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                    error={this.state.modalState.width === 0}
                  />
                </Grid>

                {/* Lock Ratio */}
                <Grid item container xs={2} justifyContent="center">
                  <IconButton onClick={this.handleRatioLockedClick}>
                    {this.state.modalState.ratioLocked ? <Link /> : <LinkOff />}
                  </IconButton>
                </Grid>

                {/* Height Input */}
                <Grid item xs={4}>
                  <TextField
                    label="height"
                    size="small"
                    value={this.state.modalState.height}
                    disabled={this.state.modalState.ratioLocked}
                    onChange={this.handleHeightChanged}
                    inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                    error={this.state.modalState.height === 0}
                  />
                </Grid>

                {/* Download Button */}
                <Grid item container xs={2} justifyContent="flex-end">
                  <IconButton
                    onClick={this.handleDownloadClick}
                    disabled={
                      this.state.modalState.height === 0 ||
                      this.state.modalState.width === 0
                    }
                  >
                    <Download />
                  </IconButton>
                </Grid>
              </Grid>

              {/* Metadata Header*/}
              <Grid item container xs={12} sx={{ p: 1 }}>
                <Grid item xs={2}>
                  <IconButton onClick={this.handleMetadataClick}>
                    {this.state.modalState.isMetadataOpen ? (
                      <ExpandLess />
                    ) : (
                      <ExpandMore />
                    )}
                  </IconButton>
                </Grid>
                <Grid
                  item
                  container
                  xs="auto"
                  justifyContent="left"
                  alignSelf="center"
                >
                  <Typography>Metadata</Typography>
                </Grid>
              </Grid>

              {/* Metadata */}
              <Grid item container xs={12}>
                <Collapse in={this.state.modalState.isMetadataOpen}>
                  {/* Emoji Name */}
                  <Grid item xs={12} sx={{ p: 1 }}>
                    <Typography>
                      {this.getFormattedName(this.state.emoji.name)}
                    </Typography>
                  </Grid>

                  {/* Short Names */}
                  {/* <Grid item xs={12}>
                    {this.state.emoji.short_names.map((shortName: string) => {
                      return (
                        <Typography
                          display="inline"
                          sx={codeStyle}
                          key={shortName}
                        >
                          :{shortName}:
                        </Typography>
                      );
                    })}
                  </Grid> */}
                </Collapse>
              </Grid>
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
    this.setState({ modalState: { ...this.state.modalState, isOpen: true } });
  }

  closeModal() {
    this.setState({ modalState: { ...this.state.modalState, isOpen: false } });
  }

  getRandomBackgroundColor(): string {
    var partyColors = [
      "#FF6B6B",
      "#FF6BB5",
      "#FF81FF",
      "#D081FF",
      "#81ACFF",
      "#81FFFF",
      "#81FF81",
      "#FFD081",
      "#FF8181",
    ];
    return partyColors[Math.floor(Math.random() * partyColors.length)];
  }

  getFormattedName(name: string): string {
    return name
      .toLowerCase()
      .split(" ")
      .map((w: string) => w[0].toUpperCase() + w.slice(1))
      .join(" ");
  }

  handleMetadataClick() {
    this.setState({
      modalState: {
        ...this.state.modalState,
        isMetadataOpen: !this.state.modalState.isMetadataOpen,
      },
    });
  }

  handleRatioLockedClick() {
    // If ratio lock is currently unlocked, we're going _to_ locked, so sync ratio up
    var shouldSyncHeight = !this.state.modalState.ratioLocked;

    this.setState({
      modalState: {
        ...this.state.modalState,
        ratioLocked: !this.state.modalState.ratioLocked,
        height: shouldSyncHeight
          ? this.state.modalState.width
          : this.state.modalState.height,
      },
    });
  }

  handleWidthChanged(event: React.ChangeEvent<HTMLInputElement>): void {
    var newWidth = parseInt(event.target.value);

    if (isNaN(newWidth)) {
      newWidth = 0;
    }

    this.setState({
      modalState: {
        ...this.state.modalState,
        width: newWidth,
        height: this.state.modalState.ratioLocked
          ? newWidth
          : this.state.modalState.height,
      },
    });
  }

  handleHeightChanged(event: React.ChangeEvent<HTMLInputElement>) {
    var newHeight = parseInt(event.target.value);

    if (isNaN(newHeight)) {
      newHeight = 0;
    }

    this.setState({
      modalState: {
        ...this.state.modalState,
        height: newHeight,
      },
    });
  }

  async handleDownloadClick() {
    var parser = new DOMParser();
    var emojiHtml = twemoji.parse(
      this.state.codepoint
        .split("-")
        .map(twemoji.convert.fromCodePoint)
        .join(""),
      {
        ext: ".svg",
        folder: "svg",
      }
    );

    var parsedHtml = parser.parseFromString(emojiHtml, "text/html");
    var src = parsedHtml.getElementsByTagName("img")[0].src;

    var response = await axios.post(
      "https://7uara1y3v7.execute-api.us-west-2.amazonaws.com/",
      {
        imageSource: src,
        width: this.state.modalState.width,
        height: this.state.modalState.height,
      },
      {
        responseType: "blob",
      }
    );

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${this.state.emoji.short_name}.png`); //or any other extension
    document.body.appendChild(link);
    link.click();
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

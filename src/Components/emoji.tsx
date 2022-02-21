import { v4 as uuidv4 } from "uuid";
import {
  Box,
  ImageListItem,
  Modal,
  Grid,
  Typography,
  IconButton,
  TextField,
  CircularProgress,
  InputAdornment,
  ImageList,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import React from "react";
import twemoji from "twemoji";
import { Download } from "@mui/icons-material";
import axios from "axios";

interface EmojiProps {
  codepoint: string;
  emoji: EmojiDatasource;
  variations?: Array<EmojiVariation>;
}

interface EmojiState {
  codepoint: string;
  emoji: EmojiDatasource;
  variations?: Array<EmojiVariation>;
  modalState: {
    selectedCodepoint: string;
    isOpen: boolean;
    isLoading: boolean;
    size: number;
    imageFormat: ImageFormat;
  };
}

enum ImageFormat {
  png = "png",
  jpeg = "jpeg",
  svg = "svg",
}

const maxImageSize = 16384;

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

export default class Emoji extends React.Component<EmojiProps, EmojiState> {
  constructor(props: EmojiProps) {
    super(props);

    var variations = new Array<EmojiVariation>();
    if (props.variations) {
      var defaultVariation: EmojiVariation = {
        unified: props.emoji.unified,
        image: props.emoji.image,
        sheet_x: props.emoji.sheet_x,
        sheet_y: props.emoji.sheet_y,
        added_in: props.emoji.added_in,
        has_img_apple: props.emoji.has_img_apple,
        has_img_google: props.emoji.has_img_google,
        has_img_twitter: props.emoji.has_img_twitter,
        has_img_facebook: props.emoji.has_img_facebook,
      };

      variations = [defaultVariation, ...props.variations];
    }

    this.state = {
      codepoint: props.codepoint,
      emoji: props.emoji,
      variations: variations,
      modalState: {
        selectedCodepoint: props.codepoint,
        isOpen: false,
        isLoading: false,
        size: 64,
        imageFormat: ImageFormat.png,
      },
    };

    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.handleSizeChanged = this.handleSizeChanged.bind(this);
    this.handleFormatChanged = this.handleFormatChanged.bind(this);
    this.handleDownloadClick = this.handleDownloadClick.bind(this);
    this.handleVariationClick = this.handleVariationClick.bind(this);
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
              <Grid item container xs={12} sx={{ pb: 1 }}>
                <Grid item xs={10} sx={{ pl: 1 }} alignSelf="center">
                  <Typography>
                    {this.getFormattedName(this.state.emoji.name)}
                  </Typography>
                </Grid>
                <Grid
                  item
                  container
                  xs={2}
                  justifyContent="flex-end"
                  alignSelf="center"
                >
                  <IconButton onClick={this.closeModal}>
                    <CloseIcon />
                  </IconButton>
                </Grid>
              </Grid>

              {/* Image */}
              <Grid item xs={12} sx={{ p: 1, pb: 2 }}>
                <div
                  dangerouslySetInnerHTML={this.createEmoji(
                    this.state.modalState.selectedCodepoint
                  )}
                ></div>
              </Grid>

              {/* Variations */}
              {this.state.variations && this.state.variations.length > 1 ? (
                <Grid item xs={12}>
                  <ImageList cols={6}>
                    {this.state.variations.map((variation: EmojiVariation) => {
                      return (
                        <ImageListItem
                          onClick={(event) =>
                            this.handleVariationClick(variation.unified, event)
                          }
                          key={uuidv4()}
                          sx={{
                            textAlign: "center",
                            borderRadius: 2,
                            padding: 0.5,
                            backgroundColor: (theme) =>
                              variation.unified ===
                              this.state.modalState.selectedCodepoint
                                ? theme.palette.action.selected
                                : "",
                            "&:hover": {
                              backgroundColor: (theme) =>
                                theme.palette.action.hover,
                            },
                          }}
                        >
                          <div
                            dangerouslySetInnerHTML={this.createEmoji(
                              variation.unified
                            )}
                          ></div>
                        </ImageListItem>
                      );
                    })}
                  </ImageList>
                </Grid>
              ) : (
                <div></div>
              )}

              {/* Download Options */}
              <Grid item container xs={12} sx={{ p: 1 }}>
                {/* Size Input */}
                <Grid item xs={5} sx={{ pr: 1 }}>
                  <TextField
                    label="size"
                    size="small"
                    disabled={
                      this.state.modalState.imageFormat === ImageFormat.svg // SVGs don't have a "size", so disable this input
                    }
                    value={this.state.modalState.size}
                    onChange={this.handleSizeChanged}
                    inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                    error={
                      this.state.modalState.size === 0 ||
                      this.state.modalState.size > maxImageSize
                    }
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">px</InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                {/* Image Format */}
                <Grid item xs={5} sx={{ pr: 1 }}>
                  <FormControl fullWidth size="small">
                    <InputLabel>format</InputLabel>
                    <Select
                      label="format"
                      value={this.state.modalState.imageFormat}
                      onChange={this.handleFormatChanged}
                    >
                      <MenuItem value={ImageFormat.png}>.png</MenuItem>
                      <MenuItem value={ImageFormat.jpeg}>.jpeg</MenuItem>
                      <MenuItem value={ImageFormat.svg}>.svg</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                {/* Download Button */}
                <Grid item container xs={2} justifyContent="flex-end">
                  <IconButton
                    color="primary"
                    onClick={this.handleDownloadClick}
                    disabled={
                      this.state.modalState.size === 0 ||
                      this.state.modalState.size > maxImageSize ||
                      this.state.modalState.isLoading
                    }
                  >
                    {this.state.modalState.isLoading ? (
                      <CircularProgress size={24} />
                    ) : (
                      <Download />
                    )}
                  </IconButton>
                </Grid>
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

  // Reset modal state when closing
  closeModal() {
    this.setState({
      modalState: {
        ...this.state.modalState,
        selectedCodepoint: this.state.codepoint,
        isOpen: false,
        size: 64,
        imageFormat: ImageFormat.png,
      },
    });
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

  handleSizeChanged(event: React.ChangeEvent<HTMLInputElement>): void {
    var newSize = parseInt(event.target.value);

    if (isNaN(newSize)) {
      newSize = 0;
    }

    this.setState({
      modalState: {
        ...this.state.modalState,
        size: newSize,
      },
    });
  }

  handleFormatChanged(
    event: SelectChangeEvent<ImageFormat>,
    child: React.ReactNode
  ): void {
    this.setState({
      modalState: {
        ...this.state.modalState,
        imageFormat: event.target.value as ImageFormat,
      },
    });
  }

  async handleDownloadClick() {
    var parser = new DOMParser();
    var emojiHtml = twemoji.parse(
      this.state.modalState.selectedCodepoint
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

    var requestUrl: string;

    if (this.state.modalState.imageFormat === ImageFormat.svg) {
      // If we want an SVG, we can just download the URL we already have
      requestUrl = src;
    } else {
      // Otherwise, we need to make an external request to convert it
      requestUrl = `https://7uara1y3v7.execute-api.us-west-2.amazonaws.com?imageSource=${src}&imageFormat=${this.state.modalState.imageFormat}&width=${this.state.modalState.size}&height=${this.state.modalState.size}`;
    }

    this.setState({
      modalState: { ...this.state.modalState, isLoading: true },
    });

    var response = await axios.get(requestUrl, {
      responseType: "blob",
    });

    this.setState({
      modalState: { ...this.state.modalState, isLoading: false },
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `${this.state.emoji.short_name}.${this.state.modalState.imageFormat}`
    );
    document.body.appendChild(link);
    link.click();
  }

  handleVariationClick(
    variationCodepoint: string,
    event: React.SyntheticEvent
  ) {
    this.setState({
      modalState: {
        ...this.state.modalState,
        selectedCodepoint: variationCodepoint,
      },
    });
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

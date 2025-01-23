import { Download } from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid2";
import IconButton from "@mui/material/IconButton";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import InputAdornment from "@mui/material/InputAdornment";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Modal from "@mui/material/Modal";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import twemoji from "@twemoji/api";
import axios from "axios";
import React from "react";
import { v4 as uuidv4 } from "uuid";

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
    let emojiUrl = "";
    try {
      emojiUrl = this.createEmoji(this.state.codepoint);
    } catch (e) {
      return null;
    }

    return (
      <div>
        {/* List Item */}
        <ImageListItem
          onClick={this.openModal}
          key={uuidv4()}
          sx={{
            borderRadius: 2,
            padding: 0.5,
            "&:hover": {
              backgroundColor: () => this.getRandomBackgroundColor(),
            },
          }}
        >
          <img
            loading="lazy"
            width="32px"
            height="32px"
            src={emojiUrl}
            alt={this.state.emoji.short_name}
          />
        </ImageListItem>

        {/* Modal */}
        <Modal open={this.state.modalState.isOpen} onClose={this.closeModal}>
          <Box sx={modalStyle}>
            <Grid container>
              {/* Close Icon */}
              <Grid container size={12} sx={{ pb: 1 }}>
                <Grid size={10} sx={{ pl: 1 }} alignSelf="center">
                  <Typography>
                    {this.getFormattedName(this.state.emoji.name)}
                  </Typography>
                </Grid>
                <Grid
                  container
                  size={2}
                  justifyContent="flex-end"
                  alignSelf="center"
                >
                  <IconButton onClick={this.closeModal}>
                    <CloseIcon />
                  </IconButton>
                </Grid>
              </Grid>

              {/* Image */}
              <Grid size={12} sx={{ p: 1, pb: 2 }}>
                {React.createElement("img", {
                  loading: "lazy",
                  src: this.createEmoji(
                    this.state.modalState.selectedCodepoint
                  ),
                  width: "100%",
                })}
              </Grid>

              {/* Variations */}
              {this.state.variations && this.state.variations.length > 1 ? (
                <Grid size={12}>
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
                          {React.createElement("img", {
                            loading: "lazy",
                            src: this.createEmoji(variation.unified),
                          })}
                        </ImageListItem>
                      );
                    })}
                  </ImageList>
                </Grid>
              ) : (
                <div></div>
              )}

              {/* Download Options */}
              <Grid container size={12} sx={{ p: 1 }}>
                {/* Size Input */}
                <Grid size={5} sx={{ pr: 1 }}>
                  <TextField
                    label="size"
                    size="small"
                    disabled={
                      this.state.modalState.imageFormat === ImageFormat.svg // SVGs don't have a "size", so disable this input
                    }
                    value={this.state.modalState.size}
                    onChange={this.handleSizeChanged}
                    error={
                      this.state.modalState.size === 0 ||
                      this.state.modalState.size > maxImageSize
                    }
                    slotProps={{
                      htmlInput: {
                        inputMode: "numeric",
                        pattern: "[0-9]*",
                      },
                      input: {
                        endAdornment: (
                          <InputAdornment position="end">px</InputAdornment>
                        ),
                      },
                    }}
                  />
                </Grid>

                {/* Image Format */}
                <Grid size={5} sx={{ pr: 1 }}>
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
                <Grid container size={2} justifyContent="flex-end">
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
    const div = document.createElement("div");

    div.textContent = codePoint
      .split("-")
      .map((part) => twemoji.convert.fromCodePoint(part))
      .join("");

    twemoji.parse(div, {
      ext: ".svg",
      folder: "svg",
    });

    return div.querySelector("img")!.src;
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

    const div = document.createElement("div");
    div.textContent = this.state.modalState.selectedCodepoint
      .split("-")
      .map(twemoji.convert.fromCodePoint)
      .join("");

    twemoji.parse(div, {
      ext: ".svg",
      folder: "svg",
      base: "https://cdn.jsdelivr.net/gh/jdecked/twemoji@latest/assets/",
    });

    var parsedHtml = parser.parseFromString(div.innerHTML, "text/html");
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

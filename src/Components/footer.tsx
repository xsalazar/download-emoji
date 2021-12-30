import { Link, List, ListItem, Typography } from "@mui/material";
import { MentionIcon, FileCodeIcon } from "@primer/octicons-react";
import React from "react";

export default class Footer extends React.Component {
  render() {
    return (
      <div>
        <List
          sx={{
            display: "inline-flex",
            flexDirection: "row",
            whiteSpace: "nowrap",
          }}
        >
          {/* Link */}
          <ListItem alignItems="center">
            <Typography variant="body2">
              <Link
                href="https://github.com/xsalazar"
                color="textPrimary"
                aria-label="Contact Me"
                target="_blank"
                rel="noopener"
              >
                <MentionIcon size="small" verticalAlign="middle" />
              </Link>
            </Typography>
          </ListItem>
          {/* Link */}
          <ListItem alignItems="center">
            <Typography variant="body2">
              <Link
                href="https://github.com/xsalazar/download-emoji"
                color="textPrimary"
                aria-label="Source Code"
                target="_blank"
                rel="noopener"
              >
                <FileCodeIcon size="small" verticalAlign="middle" />
              </Link>
            </Typography>
          </ListItem>
        </List>
      </div>
    );
  }
}

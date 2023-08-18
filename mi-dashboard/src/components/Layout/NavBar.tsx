import React from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Button,
  Menu,
  MenuItem,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AddIcon from "@mui/icons-material/Add";
import LogoutButton from "../Auth/LogoutButton";
import * as events from "events";

interface Conversation {
  topic: string;
  conversation_id: number;
}

interface NavbarProps {
  onNewConversation: () => void;
  usersConversations: Conversation[];
}

const Navbar: React.FC<NavbarProps> = ({
  onNewConversation,
  usersConversations,
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (e: React.MouseEvent<HTMLElement>) => {
    const conversationId: string = e.currentTarget.id;
    console.log(conversationId);
    setAnchorEl(null);
  };

  return (
    <AppBar
      position="static"
      color="default"
      sx={{
        width: "100vw",
        minWidth: "390px",
        borderRadius: 0,
        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.5)", // Adding a subtle shadow
      }}
    >
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={handleClick}
        >
          <MenuIcon />
        </IconButton>
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <LogoutButton />
          {usersConversations &&
            usersConversations.map((conversation, index) => (
              <MenuItem
                key={index}
                onClick={handleClose}
                id={conversation.conversation_id.toString()}
              >
                {conversation.topic}
              </MenuItem>
            ))}
        </Menu>
        <Button
          startIcon={<AddIcon />}
          color="primary"
          onClick={onNewConversation}
          sx={{ marginLeft: "auto" }} // pushes button to right
        ></Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;

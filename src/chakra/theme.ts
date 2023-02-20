import "@fontsource/open-sans/300.css";
import "@fontsource/open-sans/400.css";
import "@fontsource/open-sans/700.css";
import { extendTheme } from "@chakra-ui/react";
import { Button } from "./button";
import { Input } from "./input";

export const theme = extendTheme({
  colors: {
    brand: {
      100: "#FF3C00",
    },
  },
  fonts: {
    body: "Open Sans, sans-serif",
  },

  styles: {
    global: {
      "*": {
        boxSizing: "border-box",
      },

      "html, body": {
        padding: 0,
        margin: 0,
      },
      body: { bg: "gray.200" },
      a: {
        color: "inherit",
        textDecoration: "none",
      },
    },
  },

  components: {
    Button,
    Input,
  },
});

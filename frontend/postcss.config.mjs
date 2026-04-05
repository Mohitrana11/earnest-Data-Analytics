const config = {
  plugins: {
    "@tailwindcss/postcss": {
      theme: {
        extend: {
          colors: {
            primary: "#8B5E3C",
            secondary: "#D4A373",
            background: "#1E1E1E",
            surface: "#2A2A2A",
            text: "#F5F5F5",
            muted: "#A3A3A3",
          },
        },
      },
    },
  },
};

export default config;

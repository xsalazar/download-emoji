import EmojiGrid from "./Components/emoji-grid";
import Footer from "./Components/footer";

export default function App() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "calc(100vh - 56px)",
        alignItems: "center",
      }}
    >
      <EmojiGrid />
      <Footer />
    </div>
  );
}

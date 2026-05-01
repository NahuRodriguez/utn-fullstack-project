import { useState } from "react";

export function Hero() {
  const [index, setIndex] = useState(0);

  return   (
    <section style={{
      outline: "1px solid white", 
      padding: "20px", 
      height: "400px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      margin: "2rem"
      }}>
      TODO: SLIDER
    </section>
  );
}
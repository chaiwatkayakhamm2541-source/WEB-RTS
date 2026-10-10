import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/guide")({
  component: GuideRedirect,
  head: () => ({
    meta: [{ title: "Conquest of Nine Kingdoms · สมรภูมิ RTS" }],
  }),
});

function GuideRedirect() {
  useEffect(() => {
    window.location.replace("/guide/index.html");
  }, []);
  return null;
}
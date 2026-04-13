import { PartPage } from "@/components/PartPage";
import Content from "@/content/intro.mdx";

export default function Home() {
  return (
    <PartPage title="Intro — 5 min" partId="intro">
      <Content />
    </PartPage>
  );
}

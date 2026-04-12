import type { MDXComponents } from "mdx/types";
import { CopyBlock } from "@/components/ui/CopyBlock";
import { Badge } from "@/components/ui/Badge";
import { Tip } from "@/components/ui/Tip";
import { Quiz } from "@/components/ui/Quiz";
import { AgenticLoop } from "@/components/animations/AgenticLoop";
import { Exercise } from "@/components/ui/Exercise";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    CopyBlock,
    Badge,
    Tip,
    Quiz,
    AgenticLoop,
    Exercise,
    // Let rehype-pretty-code handle pre/code — don't override them
  };
}

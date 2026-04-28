import { CodeBlock } from "@/components/mdx/codeblock";
import { Callout, StatCard, SimpleChart } from "@/components/mdx/widgets";

export const mdxComponents = {
  Callout,
  StatCard,
  SimpleChart,
  code: (props: any) => {
    if (!props.className) {
      return (
        <code
          className="bg-zinc-100 dark:bg-zinc-800 rounded px-1 py-0.5 text-pink-500 dark:text-pink-400 font-mono text-sm"
          {...props}
        />
      );
    }
    return <CodeBlock {...props} />;
  },
  pre: (props: any) => <>{props.children}</>,
};

import { useMemo } from "react";

type Props = {
    svg: string;
    className?: string;
};

export const InlineSvg = ({ svg, className }: Props) => {
    const html = useMemo(() => ({ __html: svg }), [svg]);
    return <span className={className} dangerouslySetInnerHTML={html} />;
};

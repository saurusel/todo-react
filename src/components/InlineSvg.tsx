type Props = {
    svg: string;
    className?: string;
};

export function InlineSvg({ svg, className }: Props) {
    return (
        <span className={className} dangerouslySetInnerHTML={{ __html: svg }} />
    );
}

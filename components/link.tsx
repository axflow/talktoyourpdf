import NextLink, { type LinkProps } from 'next/link';
import { cn } from '@/lib/client-utils';

type SpanLinkPropsType = React.HTMLAttributes<HTMLSpanElement> & {
  children: React.ReactNode;
} & React.RefAttributes<HTMLSpanElement>;

export function SpanLink(props: SpanLinkPropsType) {
  return (
    <span
      {...props}
      className={cn('font-medium underline underline-offset-4 cursor-pointer', props.className)}
    />
  );
}

type PropsType = Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps> &
  LinkProps & {
    children: React.ReactNode;
  } & React.RefAttributes<HTMLAnchorElement>;

export default function Link(props: PropsType) {
  return (
    <NextLink
      {...props}
      className={cn('font-medium underline underline-offset-4 cursor-pointer', props.className)}
    />
  );
}

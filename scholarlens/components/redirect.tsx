"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export type RedirectProps = {
  href: string;
};

export function Redirect(props: RedirectProps) {
  const router = useRouter();
  useEffect(() => {
    router.push(props.href);
  });

  return <Link href={props.href}>Click me</Link>;
}

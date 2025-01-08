'use client'

import type { FC } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

type ButtonLinkProps = React.JSX.IntrinsicElements['button'] & {
  href: string
  target?: string
}

const ButtonLink: FC<ButtonLinkProps> = ({ href, target, ...props }) => {
  const currentPath = usePathname()

  return (
    <button
      {...props}
      onClick={(e) => {
        const link = e.currentTarget.firstElementChild

        props.onClick?.(e)
        if (link instanceof HTMLAnchorElement) link?.click()
      }}
    >
      <Link
        {...{ href, target }}
        className='inline-block'
        onClick={(e) => {
          e.stopPropagation()

          if (currentPath === href) {
            e.preventDefault()
          }
        }}
      >
        {props.children}
      </Link>
    </button>
  )
}

export default ButtonLink

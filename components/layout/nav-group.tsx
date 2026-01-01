'use client'

import { type ReactNode } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    useSidebar,
} from '@/components/ui/sidebar'
import { Badge } from '@/components/ui/badge'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
    type NavCollapsible,
    type NavItem,
    type NavLink,
    type NavButton,
    type NavGroup as NavGroupProps,
} from './types'

export function NavGroup({ title, items }: NavGroupProps) {
    const { state, isMobile } = useSidebar()
    const pathname = usePathname()
    return (
        <SidebarGroup>
            <SidebarGroupLabel>{title}</SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item, index) => {
                    const key = `${item.title}-${item.url || 'collapsible'}-${index}`

                    // Handle button items with onClick
                    if ('onClick' in item && item.onClick) {
                        return (
                            <motion.div
                                key={key}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05, duration: 0.3 }}
                            >
                                <SidebarMenuButtonItem item={item} />
                            </motion.div>
                        )
                    }

                    if (!item.items)
                        return (
                            <motion.div
                                key={key}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05, duration: 0.3 }}
                            >
                                <SidebarMenuLink item={item} pathname={pathname} />
                            </motion.div>
                        )

                    if (state === 'collapsed' && !isMobile)
                        return (
                            <motion.div
                                key={key}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05, duration: 0.3 }}
                            >
                                <SidebarMenuCollapsedDropdown item={item} pathname={pathname} />
                            </motion.div>
                        )

                    return (
                        <motion.div
                            key={key}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05, duration: 0.3 }}
                        >
                            <SidebarMenuCollapsible item={item} pathname={pathname} />
                        </motion.div>
                    )
                })}
            </SidebarMenu>
        </SidebarGroup>
    )
}

function NavBadge({ children }: { children: ReactNode }) {
    return <Badge className='rounded-none px-1 py-0 text-xs'>{children}</Badge>
}

function SidebarMenuLink({ item, pathname }: { item: NavLink; pathname: string }) {
    const { setOpenMobile } = useSidebar()
    return (
        <SidebarMenuItem>
            <SidebarMenuButton
                asChild
                isActive={checkIsActive(pathname, item)}
                tooltip={item.title}
            >
                <Link href={item.url} onClick={() => setOpenMobile(false)}>
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                    {item.badge && <NavBadge>{item.badge}</NavBadge>}
                </Link>
            </SidebarMenuButton>
        </SidebarMenuItem>
    )
}

function SidebarMenuButtonItem({ item }: { item: NavButton }) {
    const { setOpenMobile } = useSidebar()
    return (
        <SidebarMenuItem>
            <SidebarMenuButton
                onClick={() => {
                    item.onClick()
                    setOpenMobile(false)
                }}
                tooltip={item.title}
            >
                {item.icon && <item.icon />}
                <span>{item.title}</span>
                {item.badge && <NavBadge>{item.badge}</NavBadge>}
            </SidebarMenuButton>
        </SidebarMenuItem>
    )
}

function SidebarMenuCollapsible({
    item,
    pathname,
}: {
    item: NavCollapsible
    pathname: string
}) {
    const { setOpenMobile } = useSidebar()
    return (
        <Collapsible
            asChild
            defaultOpen={item.defaultOpen ?? checkIsActive(pathname, item, true)}
            className='group/collapsible'
        >
            <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip={item.title}>
                        {item.icon && <item.icon />}
                        <span>{item.title}</span>
                        {item.badge && <NavBadge>{item.badge}</NavBadge>}
                        <ChevronRight className='ms-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90 rtl:rotate-180' />
                    </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent className='CollapsibleContent'>
                    <SidebarMenuSub>
                        {item.items.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.title}>
                                <SidebarMenuSubButton
                                    asChild
                                    isActive={checkIsActive(pathname, subItem)}
                                >
                                    <Link href={subItem.url} onClick={() => setOpenMobile(false)}>
                                        {subItem.icon && <subItem.icon />}
                                        <span>{subItem.title}</span>
                                        {subItem.badge && <NavBadge>{subItem.badge}</NavBadge>}
                                    </Link>
                                </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                        ))}
                    </SidebarMenuSub>
                </CollapsibleContent>
            </SidebarMenuItem>
        </Collapsible>
    )
}

function SidebarMenuCollapsedDropdown({
    item,
    pathname,
}: {
    item: NavCollapsible
    pathname: string
}) {
    return (
        <SidebarMenuItem>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <SidebarMenuButton
                        tooltip={item.title}
                        isActive={checkIsActive(pathname, item)}
                    >
                        {item.icon && <item.icon />}
                        <span>{item.title}</span>
                        {item.badge && <NavBadge>{item.badge}</NavBadge>}
                        <ChevronRight className='ms-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90' />
                    </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent side='right' align='start' sideOffset={4}>
                    <DropdownMenuLabel>
                        {item.title} {item.badge ? `(${item.badge})` : ''}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {item.items.map((sub) => (
                        <DropdownMenuItem key={`${sub.title}-${sub.url}`} asChild>
                            <Link
                                href={sub.url}
                                className={`${checkIsActive(pathname, sub) ? 'bg-secondary' : ''}`}
                            >
                                {sub.icon && <sub.icon />}
                                <span className='max-w-52 text-wrap'>{sub.title}</span>
                                {sub.badge && (
                                    <span className='ms-auto text-xs'>{sub.badge}</span>
                                )}
                            </Link>
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
        </SidebarMenuItem>
    )
}

function checkIsActive(pathname: string, item: NavItem, mainNav = false) {
    const cleanPathname = pathname
    const cleanPathnameWithoutQuery = cleanPathname.split('?')[0]

    if (!('url' in item)) {
        return !!item?.items?.filter((i) => i.url === cleanPathnameWithoutQuery).length
    }

    return (
        cleanPathname === item.url ||
        cleanPathnameWithoutQuery === item.url ||
        (mainNav &&
            cleanPathnameWithoutQuery.split('/')[1] !== '' &&
            cleanPathnameWithoutQuery.split('/')[1] === item?.url?.split('/')[1])
    )
}

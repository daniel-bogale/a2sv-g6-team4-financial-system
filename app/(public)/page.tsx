// This page should never be reached due to middleware redirects
// But we keep it as a fallback redirect
import { redirect } from "next/navigation"

export default async function RootPage({
	params
}: {
	params: Promise<{ locale: string }>
}) {
	const { locale } = await params
	// Middleware handles redirects, but this is a fallback
	redirect(`/${locale}/login`)
}


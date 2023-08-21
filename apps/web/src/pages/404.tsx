import Head from "next/head"
import ErrorComponent from "../core/components/ErrorComponent"
import Layout from "../core/layouts/Layout"

export default function Page404() {
  const statusCode = 404
  const title = "This page could not be found"
  return (
    <Layout title={`${statusCode}: ${title}`}>
      <div className="h-full">
        <main className="grid min-h-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
          <ErrorComponent
            statusCode={statusCode}
            title={title}
            details="Sorry, we couldn’t find the page you’re looking for."
          />
        </main>
      </div>
    </Layout>
  )
}

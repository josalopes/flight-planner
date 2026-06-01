type Params =
  Record<string, string>

export async function externalApi(
  path: string,
  params?: Params
) {

  const url = new URL(
    `${process.env.AISWEB}${path}`
  )

  // 🔥 credenciais da API
  url.searchParams.set(
    "apiKey",
    process.env.AISWEB_API_KEY!
  )

  url.searchParams.set(
    "apiPassword",
    process.env.AISWEB_API_PASSWORD!
  )

  // 🔥 params adicionais
  if (params) {
    Object.entries(params)
      .forEach(([key, value]) => {
        url.searchParams.set(
          key,
          value
        )
      })
  }

  const response = await fetch(
    url.toString(),
    {
      method: "GET",
    //   cache: "no-store"
    }
  )

  if (!response.ok) {
    throw new Error(
      `Erro API externa (${response.status})`
    )
  }

  return response.json()
}
import { externalApi }
from "@/lib/external-api"

interface Props {
  code: string
}

export async function getAerodrome({
  code
}: Props) {
  const data = await externalApi("/products",
      {
        code
      }
    )

  return data
}
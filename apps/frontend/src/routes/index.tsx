import { createFileRoute } from '@tanstack/react-router'

const Hello = () => {
  return (
    <div>
      hello
    </div>
  )
}

export const Route = createFileRoute('/')({
  component: Hello,
})  






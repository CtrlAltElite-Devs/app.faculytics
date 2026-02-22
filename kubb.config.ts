import { defineConfig } from '@kubb/core'
import { pluginOas } from '@kubb/plugin-oas'
import { pluginTs } from '@kubb/plugin-ts'
import { pluginZod } from '@kubb/plugin-zod'

export default defineConfig({
  root: '.',
  input: {
    path: 'https://raw.githubusercontent.com/CtrlAltElite-Devs/faculytics-contracts/main/develop/openapi.yaml',
  },
  output: {
    path: './types/kubb/gen',
    clean: true,
  },
  plugins: [
    pluginOas(),
    pluginTs({
      output: {
        path: 'models',
      },
    }),
    pluginZod({
      output: {
        path: 'zod',
      },
    }),
  ],
})

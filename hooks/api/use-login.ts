import { $api } from "@/lib/api-client"

export const useLogin = () => {
  return $api.useMutation('post', '/api/v1/auth/login')
}

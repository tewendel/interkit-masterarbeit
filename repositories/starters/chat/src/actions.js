import { registerActions, InterkitClient } from 'interkit'

export default () => registerActions([
  {
    triggers: ["createNewUser"],
    method: async function (arg) {
      const token = await InterkitClient.createProjectTokenUserAndLogin()
    }
  }
])

import { UserAuth } from '@users/schemas/user.schema'

export class UpdateUserProfileDto {
  username?: string
  password?: string
  auth?: UserAuth
}

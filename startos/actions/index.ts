import { sdk } from '../sdk'
import { demoteFromAdmin } from './demoteFromAdmin'
import { manageSignup } from './manageSignup'
import { manageSmtp } from './manageSmtp'
import { promoteToAdmin } from './promoteToAdmin'
import { resetUserPassword } from './resetUserPassword'
import { setPrimaryUrl } from './setPrimaryUrl'

export const actions = sdk.Actions.of()
  .addAction(setPrimaryUrl)
  .addAction(manageSmtp)
  .addAction(manageSignup)
  .addAction(resetUserPassword)
  .addAction(promoteToAdmin)
  .addAction(demoteFromAdmin)

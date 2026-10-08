import { primaryUrl } from '../primaryUrl'
import { sdk } from '../sdk'
import { demoteFromAdmin } from './demoteFromAdmin'
import { manageCallsTurn } from './manageCallsTurn'
import { manageSignup } from './manageSignup'
import { manageSmtp } from './manageSmtp'
import { promoteToAdmin } from './promoteToAdmin'
import { resetUserPassword } from './resetUserPassword'

export const actions = sdk.Actions.of()
  .addAction(primaryUrl.action)
  .addAction(manageSmtp)
  .addAction(manageSignup)
  .addAction(manageCallsTurn)
  .addAction(resetUserPassword)
  .addAction(promoteToAdmin)
  .addAction(demoteFromAdmin)

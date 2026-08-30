import { ownerOnly } from "../middleware/owner.middleware.js";

router.use(protectRoute);
router.use(ownerOnly);
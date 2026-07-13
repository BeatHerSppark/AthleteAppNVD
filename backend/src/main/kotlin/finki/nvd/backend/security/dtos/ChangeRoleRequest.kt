package finki.nvd.backend.security.dtos

import finki.nvd.backend.security.model.UserRole

data class ChangeRoleRequest(
    val embg: String,
    val role: UserRole
)

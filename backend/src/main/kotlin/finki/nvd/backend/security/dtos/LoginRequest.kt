package finki.nvd.backend.security.dtos

data class LoginRequest(
    val embg: String,
    val password: String
)

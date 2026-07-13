package finki.nvd.backend.dto
import finki.nvd.backend.model.enum.MoodProgress
import java.time.LocalDateTime

data class ProgressEntry(
    val date: LocalDateTime,
    val progress: MoodProgress
)

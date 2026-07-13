package finki.nvd.backend.dto
import jakarta.validation.constraints.Max
import jakarta.validation.constraints.Min
import jakarta.validation.constraints.NotNull
import finki.nvd.backend.model.enum.MoodEmotion

data class MoodCreatingResponseDTO(
    @field:NotNull
    val patientId: Long,
    @field:NotNull
    val moodEmotion: MoodEmotion,
    @field:NotNull
    val moodDescription: String,
    @field:NotNull
    @field:Min(1)
    @field:Max(24)
    val hoursSleptAverage: Int
)

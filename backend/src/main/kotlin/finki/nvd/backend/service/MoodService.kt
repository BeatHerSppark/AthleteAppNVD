package finki.nvd.backend.service
import org.springframework.data.domain.Page
import finki.nvd.backend.dto.MoodCreatingResponseDTO
import finki.nvd.backend.dto.MoodStatisticsDTO
import finki.nvd.backend.model.Mood
import finki.nvd.backend.model.enum.MoodEmotion
import finki.nvd.backend.model.enum.MoodProgress
import java.time.LocalDateTime

interface MoodService {
    fun save(dto: MoodCreatingResponseDTO): Mood
    fun getMoodStatsForPatient(patientId: Long): MoodStatisticsDTO
    fun findAllFiltered(
        patientId: Long?,
        from: LocalDateTime?,
        to: LocalDateTime?,
        moodEmotion: List<MoodEmotion>?,
        moodProgress: List<MoodProgress>?,
        pageSize: Int,
        pageNumber: Int
    ): Page<Mood>
}
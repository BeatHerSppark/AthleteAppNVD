package finki.nvd.backend.mappers

import finki.nvd.backend.dto.MoodDTO
import finki.nvd.backend.model.Mood

object MoodMapper {
    fun mapMoodToResponseDto(mood: Mood): MoodDTO = MoodDTO(
        moodId = mood.moodId,
        moodProgress = mood.moodProgress.name,
        moodEmotion = mood.moodEmotion.name,
        hoursSleptAverage = mood.hoursSleptAverage,
        moodDescription = mood.moodDescription,
        moodDescriptionScore = mood.moodDescriptionScore,
        createdAt = mood.createdAt.toString(),
        patientId = mood.patient.patientId ?: 0,
        patientName = "${mood.patient.user.firstName} ${mood.patient.user.lastName}"
    )
}
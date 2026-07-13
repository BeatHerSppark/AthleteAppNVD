package finki.nvd.backend.dto

import finki.nvd.backend.model.enum.MoodEmotion
import finki.nvd.backend.model.enum.MoodProgress

data class MoodStatisticsDTO(
    val averageSleepOverall: Double,
    val mostFrequentEmotion: MoodEmotion,
    val mostFrequentProgressState: MoodProgress,
    val totalMoodEntries: Int,
    val moodEmotionCounts: Map<MoodEmotion, Int>,
    val moodProgressCounts: Map<MoodProgress, Int>,
    val progressOverTime: List<ProgressEntry>
)

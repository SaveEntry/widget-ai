package ai.widget.platform.chatgpt;

import java.util.List;

public record WidgetActivityPreview(
        String activityType,
        String question,
        List<String> options,
        String rewardDisclosure,
        boolean previewOnly) {
}

